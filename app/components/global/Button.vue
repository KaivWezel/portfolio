<script setup>
import { usePageEnter, usePageLeave } from "~/composables/usePageState";
usePageEnter(() => {
  console.log("Button component mounted");
});

usePageLeave(() => {
  console.log("UsePageLeave called before navigation");
});
</script>
<template>
  <button>Global button</button>
</template>
