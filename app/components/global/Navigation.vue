<template>
  <nav class="navBar">
    <nuxt-link to="/">Home</nuxt-link>
    <BtnMain url="/work" />
    <nuxt-link to="/about">About</nuxt-link>
  </nav>
</template>
<style lang="scss">
.navBar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  padding: 1rem 0;

  a {
    color: black;
    text-decoration: none;
  }
}
</style>
