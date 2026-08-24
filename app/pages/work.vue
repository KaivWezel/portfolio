<script setup lang="ts">
import { usePageLeave, usePageEnter } from "~/composables/usePageState";
import { useImagePreload } from "~/composables/useImagePreload";

const { $gsap } = useNuxtApp();

const refTitle = ref(null);
const refProjectTitle = ref(null);
const refImage = ref([]);

const activeProject = ref("Sculpting Harmony");

// Preload images
const preloadResult = useImagePreload(refImage);
const { waitForImages } = preloadResult as any;
let tl: GSAPTimeline | null = null;

usePageEnter(async () => {
  if (tl) tl.kill(); // Kill any ongoing animations

  // Wait for all images to load
  await waitForImages();

  // Start animation once images are ready
  tl = $gsap.timeline();
  tl.fromTo(refTitle.value, { opacity: 0, y: "100%" }, { opacity: 1, y: "0%", duration: 0.4, ease: "power2.out" });
  tl.fromTo(
    refProjectTitle.value,
    { y: "100%" },
    {
      y: "0%",
      duration: 0.4,
      ease: "power2.out",
    },
    0,
  );
  tl.fromTo(
    refImage.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
    0.2,
  );
});

usePageLeave(() => {
  return new Promise<void>((resolve) => {
    tl = $gsap.timeline();
    tl.to(refTitle.value, { y: "-100%", opacity: 0, duration: 0.4, ease: "power2.in" });
    tl.to(refProjectTitle.value, { y: "-100%", opacity: 0, duration: 0.4, ease: "power2.in" }, 0);
    tl.to(
      refImage.value,
      {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
        stagger: 0.1,
      },
      0,
    );
    if (tl) {
      tl.eventCallback("onComplete", resolve);
    } else {
      resolve();
    }
  });
});
</script>
<template>
  <Page class="page-work">
    <div class="page-work__titles">
      <h1 ref="refTitle"><span>Work</span></h1>
      <h2 ref="refProjectTitle">{{ activeProject }}</h2>
    </div>
  </Page>
</template>
<style lang="scss">
.page.page-work {
  // display: grid;
  // grid-template-columns: 1fr 2fr;

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
