<template>
  <div>
    <h1>Kai van Wezel</h1>
    <div class="page"></div>
    <div class="page"></div>
    <div class="page"></div>
    <div class="page"></div>
  </div>
</template>
<style lang="scss">
.page {
  height: 100vh;
  width: 100%;
}

// Generate colors for each page using nth-child
@for $i from 1 through 10 {
  .page:nth-child(#{$i + 1}) {
    // +1 because h1 is the first child
    background-color: color-from-index($i, 80%, 60%);
  }
}
</style>
