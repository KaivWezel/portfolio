<script setup>
import { usePageEnter, usePageLeave } from "~/composables/usePageState";
const { $gsap } = useNuxtApp();
const transitionStore = useTransitionStore();

const refTitle = ref(null);

usePageLeave(() => {
  const outro = $gsap.to(refTitle.value, { y: "-100%", duration: 0.5, ease: "power4.out" });
  transitionStore.registerOutro(outro);
});

usePageEnter(() => {
  $gsap.fromTo(refTitle.value, { y: "100%" }, { y: "0%", duration: 0.5, ease: "power4.out" });
});
</script>
<template>
  <Page>
    <div class="overflow-hidden">
      <h1 ref="refTitle">Kai van Wezel</h1>
    </div>
    <!-- <Button /> -->

    <!-- <div class="page"></div>
    <div class="page"></div>
    <div class="page"></div>
    <div class="page"></div> -->
  </Page>
</template>
<style lang="scss">
// // Generate colors for each page using nth-child
// @for $i from 1 through 10 {
//   .page:nth-child(#{$i + 1}) {
//     // +1 because h1 is the first child
//     background-color: color-from-index($i, 80%, 60%);
//   }
// }
</style>
