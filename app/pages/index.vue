<script setup>
import { usePageEnter, usePageLeave } from "~/composables/usePageState";
const { $gsap } = useNuxtApp();
const transitionStore = useTransitionStore();

const refTitle = ref(null);

usePageLeave(() => {
  const outro = $gsap.to(refTitle.value, { y: "-100%", duration: 0.4, ease: "power4.inOut" });
  transitionStore.registerOutro(outro);
});

usePageEnter(() => {
  $gsap.fromTo(refTitle.value, { y: "100%" }, { y: "0%", duration: 0.5, ease: "power4.out" });
});
</script>
<template>
  <Page>
    <div class="overflow-hidden">
      <h1 ref="refTitle">Home</h1>
    </div>
  </Page>
</template>
