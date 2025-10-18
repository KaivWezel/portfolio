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
  await transitionStore.resolvePromises(() => {
    console.log("All leave animations completed");
  });

  // Navigation continues automatically after the promise resolves
});

router.afterEach((to, from) => {
  // Set page state to enter:start after navigation completes and new page is mounted
  nextTick(() => {
    pageStore.setPageState(PageStates.ENTER_START);
  });
});

function onSetPageState(newState) {
  // console.log("Page state changed to:", newState);
}

watch(
  () => pageStore.pageState,
  (state) => {
    onSetPageState(state);
  }
);

watch(
  () => pageStore.pageState,
  (state) => {
    // console.log("Page state changed to", state);
  }
);
</script>
<template>
  <div>
    <slot />
  </div>
</template>
