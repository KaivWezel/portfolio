<script setup>
import { PageStates } from "~/data/pageStates";
const router = useRouter();

const pageStore = usePageStore();
const transitionStore = useTransitionStore();

router.beforeEach(async (to, from, next) => {
  // Set page state to leave:start
  pageStore.setPageState(PageStates.LEAVE_START);

  await nextTick();

  // Wait for all leave animations to complete
  await new Promise((resolve) => {
    transitionStore.resolvePromises(() => {
      console.log("All leave animations completed");
      resolve();
      pageStore.setPageState(PageStates.ENTER_START);
    });
  });

  next();

  // Navigation continues automatically after the promise resolves
});

function onSetPageState(newState) {
  console.log("Page state changed to:", newState);
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
