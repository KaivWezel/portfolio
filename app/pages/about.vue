<script setup>
import { usePageLeave, usePageEnter } from "~/composables/usePageState";

const transitionStore = useTransitionStore();

usePageEnter(() => {
  console.log("about page entering");
});

usePageLeave(() => {
  console.log("about page leaving");
  const outro = $gsap.to(refTitle.value, { y: "100%", duration: 1 });
  transitionStore.registerOutro(outro);
});

const { $gsap } = useNuxtApp();
const refTitle = ref(null);

onUnmounted(() => {
  console.log("about page unmounted");
});
</script>
<template>
  <div>
    <nuxt-link to="/">Home</nuxt-link>
    <h1 ref="refTitle">about</h1>
  </div>
</template>
