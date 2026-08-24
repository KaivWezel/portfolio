<script setup>
const router = useRouter();

const pageStore = usePageStore();
const transitionStore = useTransitionStore();

router.beforeEach(async (to, from) => {
  // Block navigation if not idle (transition in progress)

  if (pageStore.pageState !== "idle") return false;
  pageStore.send("navigate");

  await nextTick();
  // Wait for all leave animations to complete
  await transitionStore.runOutro();
  pageStore.send("left");
});

router.afterEach((to, from) => {
  // Set page state to enter:start after navigation completes and new page is mounted
  nextTick(() => {
    pageStore.send("entering");
  });
});

// Use nuxt app hook for initial pageload
useNuxtApp().hook("page:finish", async () => {
  pageStore.send("entering");
});
</script>
<template>
  <div>
    <slot />
  </div>
</template>
