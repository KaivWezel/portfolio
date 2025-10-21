<script setup>
import gsap from "gsap";

definePageMeta({
  pageTransition: {
    name: "custom-reveal",
    onEnter: (el, done) => {
      gsap
        .fromTo(el, { clipPath: `inset(0 0 100% 0)` }, { clipPath: "inset(0 0 0% 0)", duration: 1, ease: "expo.inOut" })
        .then(done);
    },
    onLeave: (el, done) => {
      gsap.to(el, { y: "50%", duration: 1, ease: "expo.inOut" }).then(done);
    },
  },
});

const refTitle = ref(null);
</script>
<template>
  <Page class="home">
    <div class="overflow-hidden">
      <h1 ref="refTitle">Home</h1>
    </div>
  </Page>
</template>

<style>
.page.home {
  background: lightblue;
}
</style>
