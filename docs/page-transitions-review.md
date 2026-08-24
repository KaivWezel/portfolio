# PageProvider Transition System — Design Review

## 1. What I think of this design

The core idea is solid. You've built a lightweight orchestrator that:

- Intercepts Vue Router navigation via `beforeEach` to block until GSAP outro animations complete
- Uses a reactive page state (`LEAVE_START` → `ENTER_START`) to drive per-page animations
- Exposes clean `usePageEnter` / `usePageLeave` composables so pages only declare animations

This is genuinely better than Nuxt's built-in `<Transition>`-based system for GSAP-heavy work, because you get full programmatic control and can compose complex timelines without fighting CSS transition hooks.

---

## 2. Bugs & Optimizations

### A. The promises array is never cleared

After `resolvePromises` runs, old (already-resolved) promises stay in the array. Every subsequent navigation re-awaits them plus new ones. This will work by accident (resolved promises resolve instantly), but it's a ticking time bomb and makes `isTransitioning` meaningless.

### B. `isTransitioning` is never toggled

It's defined in the store but nothing sets it to `true` or `false`, so there's no actual guard preventing navigation during a running transition — which is exactly the browser-nav bug you mentioned.

### C. `LEAVE_END` and `ENTER_END` are never emitted

You defined 4 states but only use 2. If a component ever needs to know when enter animations finish (e.g., to enable scroll or interactivity), it can't.

### D. `usePageLeave` watchers fire on the old page after `LEAVE_START` — which works — but they also watch indefinitely

Vue 3 auto-cleans watchers on unmount, so this is fine technically, but if you ever move `usePageLeave` into a component that persists across routes (like a layout or navigation), you'll get duplicate firings.

### E. The `resolvePromises` callback is always a no-op `() => {}`

Dead code that adds confusion.

### F. No rapid-navigation protection

If a user clicks two links within 400ms, the second `beforeEach` fires while the first outro is still playing, leading to stacking timelines and visual glitches.

### Suggested transitionStore fix (addresses A, B, E)

```ts
export const useTransitionStore = defineStore("transition", () => {
  const promises = ref<Promise<any>[]>([]);
  const isTransitioning = ref(false);

  function registerOutro(promise: Promise<any>) {
    promises.value.push(promise);
  }

  async function runOutro() {
    isTransitioning.value = true;
    await Promise.all(promises.value);
    promises.value = []; // clear for next navigation
    isTransitioning.value = false;
  }

  return { isTransitioning, registerOutro, runOutro };
});
```

### Suggested CorePageProvider fix

Use `isTransitioning` as a real guard — `return false` in `beforeEach` is what **actually cancels** navigation (including browser back/forward):

```js
router.beforeEach(async (to, from) => {
  if (transitionStore.isTransitioning) return false; // block during transition

  pageStore.setPageState(PageStates.LEAVE_START);
  await nextTick();
  await transitionStore.runOutro();
});
```

---

## 3. Smarter Approaches

### State machine over loose states

Your 4 states and transitions form a natural state machine: `IDLE → LEAVE_START → LEAVE_END → ENTER_START → ENTER_END → IDLE`. Making this explicit (even without a library) prevents impossible transitions and makes adding features (like "skip transition on rapid nav") trivial.

#### Implementation

##### 1. Define states and allowed transitions

Replace `pageStates.js` with a machine definition:

```ts
// data/pageStateMachine.ts

export const PageStates = {
  IDLE: "idle",
  LEAVE_START: "leave:start",
  LEAVE_END: "leave:end",
  ENTER_START: "enter:start",
  ENTER_END: "enter:end",
} as const;

export type PageState = (typeof PageStates)[keyof typeof PageStates];

// Each state maps an event name → the next allowed state
export const transitions: Record<PageState, Partial<Record<string, PageState>>> = {
  [PageStates.IDLE]: { navigate: PageStates.LEAVE_START },
  [PageStates.LEAVE_START]: { animated: PageStates.LEAVE_END },
  [PageStates.LEAVE_END]: { mounted: PageStates.ENTER_START },
  [PageStates.ENTER_START]: { animated: PageStates.ENTER_END },
  [PageStates.ENTER_END]: { idle: PageStates.IDLE },
};
```

##### 2. Create a store that enforces the machine

```ts
// stores/pageStore.ts

import { PageStates, transitions, type PageState } from "~/data/pageStateMachine";

export const usePageStore = defineStore("page", () => {
  const state = ref<PageState>(PageStates.IDLE);

  /**
   * Send an event to the machine.
   * If the current state doesn't accept this event, warn and do nothing.
   * Returns the new state (or the unchanged state if the event was invalid).
   */
  function send(event: string): PageState {
    const allowed = transitions[state.value];
    const next = allowed?.[event];

    if (!next) {
      console.warn(
        `[PageMachine] Invalid event "${event}" in state "${state.value}". ` +
          `Allowed: ${Object.keys(allowed ?? {}).join(", ") || "none"}`,
      );
      return state.value;
    }

    state.value = next;
    return next;
  }

  /** Convenience: true while any transition animation is running */
  const isAnimating = computed(() => state.value === PageStates.LEAVE_START || state.value === PageStates.ENTER_START);

  return { state, send, isAnimating };
});
```

Key benefit: calling `send("navigate")` while already in `LEAVE_START` is a no-op with a console warning, so rapid clicks and browser back/forward can't corrupt the flow.

##### 3. Update `CorePageProvider.vue`

```vue
<script setup>
import { PageStates } from "~/data/pageStateMachine";

const router = useRouter();
const pageStore = usePageStore();
const transitionStore = useTransitionStore();

router.beforeEach(async (to, from) => {
  // Block if already transitioning
  if (pageStore.isAnimating) return false;

  // IDLE → LEAVE_START (fires usePageLeave watchers)
  pageStore.send("navigate");

  await nextTick();

  // Wait for all registered outro animations
  await transitionStore.runOutro();

  // LEAVE_START → LEAVE_END
  pageStore.send("animated");

  // Navigation proceeds — Vue Router renders the new page
});

router.afterEach(() => {
  nextTick(() => {
    // LEAVE_END → ENTER_START (fires usePageEnter watchers)
    pageStore.send("mounted");
  });
});

// When enter animations finish, the page itself calls:
//   pageStore.send("animated")  → ENTER_START → ENTER_END
//   pageStore.send("idle")      → ENTER_END   → IDLE

// Initial page load
useNuxtApp().hook("page:finish", () => {
  pageStore.send("mounted");
});
</script>
<template>
  <div><slot /></div>
</template>
```

##### 4. Update composables to complete the cycle

```ts
// composables/usePageState.ts

import { PageStates } from "~/data/pageStateMachine";

export function usePageEnter(cb: () => void | Promise<void>) {
  const pageStore = usePageStore();

  watch(
    () => pageStore.state,
    async (state) => {
      if (state === PageStates.ENTER_START) {
        await cb();
        // Signal that enter animation finished
        pageStore.send("animated"); // ENTER_START → ENTER_END
        pageStore.send("idle"); // ENTER_END   → IDLE
      }
    },
  );
}

export function usePageLeave(cb: () => any) {
  const pageStore = usePageStore();
  const transitionStore = useTransitionStore();

  watch(
    () => pageStore.state,
    (state) => {
      if (state === PageStates.LEAVE_START) {
        const result = cb();
        // Auto-register if the callback returns a thenable (GSAP timeline / Promise)
        if (result?.then) transitionStore.registerOutro(result);
      }
    },
  );
}
```

##### 5. Simplified page usage

Pages no longer need to import `transitionStore`:

```vue
<script setup>
// pages/index.vue
const { $gsap } = useNuxtApp();
const refTitle = ref(null);

usePageLeave(() => {
  // Just return the timeline — the composable registers it automatically
  return $gsap.to(refTitle.value, {
    y: "-100%",
    duration: 0.4,
    ease: "power2.in",
    opacity: 0,
  });
});

usePageEnter(() => {
  $gsap.fromTo(refTitle.value, { opacity: 0, y: "100%" }, { opacity: 1, y: "0%", duration: 0.5, ease: "power2.out" });
});
</script>
```

##### State flow diagram

```
  ┌──────────────────────────────────────────────────┐
  │                                                  │
  ▼                                                  │
IDLE ──navigate──▶ LEAVE_START ──animated──▶ LEAVE_END
                                                │
                                             mounted
                                                │
                                                ▼
                   ENTER_END ◀──animated── ENTER_START
                      │
                     idle
                      │
                      ▼
                    IDLE (ready for next navigation)
```

Every arrow is a `send()` call. If an event arrives at a state that doesn't have that arrow, it's silently rejected — no corrupted state, no double animations.

### `onBeforeRouteLeave` as an alternative hook point

Instead of a global `beforeEach` that relies on all pages having registered their outros via a watcher race, you could use Vue Router's per-component `onBeforeRouteLeave` inside each page. This makes the leave animation ownership explicit — the page that defines the animation also controls when navigation proceeds. The tradeoff is more boilerplate per page.

### `usePageLeave` should return the promise

Right now pages create a timeline, then separately call `registerOutro(tl)`. A cleaner API would be:

```js
// Page just returns the timeline — composable handles registration
usePageLeave(() => {
  return $gsap.timeline().to(refTitle.value, { y: "-100%", duration: 0.4, ease: "power2.in" });
});
```

```js
// Composable auto-registers
export function usePageLeave(cb) {
  const transitionStore = useTransitionStore();
  watch(
    () => usePageStore().pageState,
    (state) => {
      if (state === PageStates.LEAVE_START) {
        const result = cb();
        if (result?.then) transitionStore.registerOutro(result);
      }
    },
  );
}
```

This removes the `transitionStore` import from every page and eliminates the risk of forgetting to register.

### View Transitions API

For a portfolio site, the native [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) (`document.startViewTransition()`) can handle cross-page morphing with zero JS animation libraries. You could use it as a complement — GSAP for the complex choreography, View Transitions for simple cross-fades as a fallback. Nuxt has experimental support via `definePageMeta({ viewTransition: true })`.

---

## TL;DR

The design pattern is good. The main issues are:

1. Never clearing promises
2. Never actually blocking navigation with `return false`
3. The composables could handle registration automatically

Fix those three things and this becomes a very clean system.
