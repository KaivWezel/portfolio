<template>
  <div class="page">
    <slot />
  </div>
</template>

<style>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
