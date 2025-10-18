<script setup>
import { usePageLeave, usePageEnter } from "~/composables/usePageState";

const { $gsap } = useNuxtApp();
const transitionStore = useTransitionStore();

const refTitle = ref(null);

usePageEnter(() => {
  console.log("work page entering");
  const tl = $gsap.timeline();
  tl.fromTo(refTitle.value, { y: "100%" }, { y: "0%", duration: 0.4, ease: "power2.out" });
});

usePageLeave(() => {
  console.log("work page leaving");
  const tl = $gsap.timeline();
  tl.to(refTitle.value, { y: "-100%", duration: 0.4, ease: "power4.inOut" });
  transitionStore.registerOutro(tl);
});
</script>
<template>
  <Page class="page-work">
    <div class="overflow-hidden">
      <h1 ref="refTitle">Work</h1>
    </div>
  </Page>
</template>
<style lang="scss">
.page.page-work {
}
</style>
