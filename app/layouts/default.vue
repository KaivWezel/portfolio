<template>
  <div>
    <Navigation />
    <slot />
  </div>
</template>
<style lang="scss">
.navBar {
  position: fixed;
  width: 100%;
  z-index: 100;
}
</style>
