<template>
  <div>
    <Navigation />
    <slot />
  </div>
</template>
<style lang="scss">
.navBar {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 100;
}
</style>
