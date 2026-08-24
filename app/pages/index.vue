<script setup>
import { usePageEnter, usePageLeave } from "~/composables/usePageState";

const { $gsap } = useNuxtApp();
const transitionStore = useTransitionStore();

const refTitle = ref(null);
const refSubtitle = ref(null);

usePageLeave(() => {
  const outro = $gsap.to(refTitle.value, { y: "-100%", duration: 0.4, ease: "power2.in", opacity: 0 });
  const outroSubtitle = $gsap.to(refSubtitle.value, { y: "-100%", duration: 0.4, ease: "power2.in", opacity: 0 });
  transitionStore.registerOutro(outro);
  transitionStore.registerOutro(outroSubtitle);
});

usePageEnter(() => {
  $gsap.fromTo(refTitle.value, { opacity: 0, y: "100%" }, { opacity: 1, y: "0%", duration: 0.5, ease: "power2.out" });
  $gsap.fromTo(
    refSubtitle.value,
    { opacity: 0, y: "100%" },
    { opacity: 1, y: "0%", duration: 0.6, ease: "power2.out" },
  );
});
</script>
<template>
  <Page>
    <!-- <div class="overflow-hidden"> -->
    <div class="hero">
      <h1 ref="refTitle">Kai van Wezel</h1>
      <img src="/images/projects/sculpting-harmony/sh-cover.jpg" alt="" />
      <h2 ref="refSubtitle">Creative Developer</h2>
    </div>
    <!-- </div> -->
  </Page>
</template>
<style lang="scss">
.hero {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100%;
  gap: 1rem;
  align-items: center;

  h1 {
    font-size: 1rem;
    white-space: nowrap;
    justify-self: center;
    transform: translateX(calc((60vh)));
  }

  img {
    width: 100%;
    max-height: 60vh;
    aspect-ratio: 4/5;
    object-fit: cover;
  }

  h2 {
    font-size: 1rem;
    flex-shrink: 0;
    white-space: nowrap;
    justify-self: center;
  }
}
</style>
