<template>
  <nav class="navBar">
    <nuxt-link to="/">Home</nuxt-link>
    <BtnMain url="/work" label="Work" />
    <nuxt-link to="/about">About</nuxt-link>
  </nav>
</template>
<style lang="scss">
.navBar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  padding: 1rem 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;

  a {
    color: black;
    text-decoration: none;
  }
}
</style>
