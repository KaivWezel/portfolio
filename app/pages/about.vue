<script setup>
import { usePageLeave, usePageEnter } from "~/composables/usePageState";

const transitionStore = useTransitionStore();
const { $gsap } = useNuxtApp();

const refTitle = ref(null);
const refWordMark = ref([]);
onMounted(() => {
  console.log("🚀 ~ refWordMark:", refWordMark);
});

usePageEnter(() => {
  console.log("about page entering");
  const tl = $gsap.timeline();
  tl.fromTo(refTitle.value, { y: "100%" }, { y: "0%", duration: 0.4, ease: "power2.out" });
  tl.fromTo(
    refWordMark.value,
    { y: "100%" },
    {
      y: "0%",
      duration: 0.4,
      ease: "power4.out",
      stagger: 0.05,
    },
    0
  );
});

usePageLeave(() => {
  console.log("about page leaving");
  const tl = $gsap.timeline();
  tl.to(refTitle.value, { y: "-100%", duration: 0.4, ease: "power4.inOut" });
  tl.to(
    refWordMark.value,
    {
      y: "-100%",
      duration: 0.4,
      ease: "power4.out",
      stagger: 0.05,
    },
    0
  );
  transitionStore.registerOutro(tl);
});

onUnmounted(() => {
  console.log("about page unmounted");
});
</script>
<template>
  <Page>
    <div class="overflow-hidden">
      <h1 ref="refTitle">about</h1>
    </div>
    <div class="textGrid">
      <div v-for="n in 9" class="overflow-hidden">
        <span ref="refWordMark">( project no.{{ n }} )</span>
      </div>
    </div>
  </Page>
</template>
<style>
.overflow-hidden {
  overflow: hidden;
}
.textGrid {
  display: grid;
  width: 100%;
  height: 100%;
  position: absolute;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(3, 1fr);

  span {
    display: inline-block;
  }

  div {
    line-height: 0.75rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: 0.15s;

    &:hover {
      transform: scale(1.2);
    }
  }

  div:nth-child(5) {
    display: inline-block;
    visibility: hidden;
  }
}
</style>
