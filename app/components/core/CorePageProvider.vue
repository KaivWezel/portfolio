<script setup>
import { PageStates } from "~/data/pageStates";
const router = useRouter();

const pageStore = usePageStore();
const transitionStore = useTransitionStore();

router.beforeEach(async (to, from) => {
  // Set page state to leave:start
  pageStore.setPageState(PageStates.LEAVE_START);

  await nextTick();
  // Wait for all leave animations to complete
  await transitionStore.resolvePromises(() => {});

  // Navigation continues automatically after the promise resolves
});

router.afterEach((to, from) => {
  // Set page state to enter:start after navigation completes and new page is mounted
  nextTick(() => {
    pageStore.setPageState(PageStates.ENTER_START);
  });
});

function onSetPageState(newState) {
  console.log("Page state changed to:", newState);
}

// Use nuxt app hook for initial pageload
useNuxtApp().hook("page:finish", async () => {
  console.log("Initial page load finished");
  pageStore.setPageState(PageStates.ENTER_START);
});

watch(
  () => pageStore.pageState,
  (state) => {
    onSetPageState(state);
  }
);
</script>
<template>
  <div>
    <slot />
  </div>
</template>
