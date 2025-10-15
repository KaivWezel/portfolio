<script setup lang="ts">
import Lenis from "lenis";
const lenis = new Lenis({
  autoRaf: true,
  autoResize: true,
});
</script>
<template>
  <div>
    <slot></slot>
  </div>
</template>
