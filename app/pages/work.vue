<script setup>
import { usePageLeave, usePageEnter } from "~/composables/usePageState";
import { useImagePreload } from "~/composables/useImagePreload";

const { $gsap } = useNuxtApp();
const transitionStore = useTransitionStore();

const refTitle = ref(null);
const refProjectTitle = ref(null);
const refImage = ref([]);
console.log("🚀 ~ refImage:", refImage);

const activeProject = ref("Sculpting Harmony");

// Preload images
const { waitForImages } = useImagePreload(refImage);

usePageEnter(async () => {
  console.log("work page entering");

  // Wait for all images to load
  await waitForImages();

  // Start animation once images are ready
  const tl = $gsap.timeline();
  tl.fromTo(refTitle.value, { y: "100%" }, { y: "0%", duration: 0.4, ease: "power2.out" });
  tl.fromTo(
    refProjectTitle.value,
    { y: "100%" },
    {
      y: "0%",
      duration: 0.4,
      ease: "power2.out",
    },
    0
  );
  tl.fromTo(
    refImage.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
    0.2
  );
});

usePageLeave(() => {
  console.log("work page leaving");
  const tl = $gsap.timeline();
  tl.to(refTitle.value, { y: "-100%", duration: 0.4, ease: "power2.in" });
  tl.to(refProjectTitle.value, { y: "-100%", duration: 0.4, ease: "power2.in" }, 0);
  tl.to(
    refImage.value,
    {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.in",
      stagger: 0.1,
    },
    0
  );
  transitionStore.registerOutro(tl);
});
</script>
<template>
  <Page class="page-work">
    <div>
      <div class="overflow-hidden">
        <h1 ref="refTitle">Work</h1>
      </div>
      <div class="overflow-hidden">
        <h2 ref="refProjectTitle">{{ activeProject }}</h2>
      </div>
    </div>
    <div class="projects">
      <img :ref="(el) => refImage.push(el)" src="/images/projects/sculpting-harmony/sh-navigation.png" alt="" />
      <img :ref="(el) => refImage.push(el)" src="/images/projects/sculpting-harmony/sh-navigation.png" alt="" />
      <img :ref="(el) => refImage.push(el)" src="/images/projects/sculpting-harmony/sh-navigation.png" alt="" />
      <img :ref="(el) => refImage.push(el)" src="/images/projects/sculpting-harmony/sh-navigation.png" alt="" />
    </div>
  </Page>
</template>
<style lang="scss">
.page.page-work {
  display: grid;
  grid-template-columns: 1fr 2fr;

  .overflow-hidden {
    overflow: hidden;

    * {
      transform: translateY(100%);
    }
  }

  h1 {
    font-size: 1rem;
  }

  .projects {
    display: flex;
    flex-direction: column;

    img {
      width: 100%;
      opacity: 0;
    }
  }
}
</style>
