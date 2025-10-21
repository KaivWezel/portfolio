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
      gsap.to(el, { y: "50%", duration: 1.2, ease: "expo.inOut" }).then(done);
    },
  },
});
</script>
<template>
  <Page class="about">
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
.page.about {
  background: coral;
}

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
