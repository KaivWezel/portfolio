<script setup lang="ts">
import Lenis from "lenis";

const scrollProvider = reactive({
  lenis: null as Lenis | null,
});

onMounted(() => {
  scrollProvider.lenis = new Lenis({
    autoRaf: true,
    autoResize: true,
  });
});
</script>
<template>
  <div ref="refRoot">
    <slot></slot>
  </div>
</template>
