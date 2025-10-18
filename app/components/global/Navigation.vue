<template>
  <nav class="navBar">
    <nuxt-link to="/">Home</nuxt-link>
    <nuxt-link to="/work">Work</nuxt-link>
    <nuxt-link to="/about">About</nuxt-link>
  </nav>
</template>
<style lang="scss">
.navBar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  padding: 0.5rem;
}
</style>
