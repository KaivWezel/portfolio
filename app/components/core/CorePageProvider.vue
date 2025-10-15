<script setup>
onMounted(() => {
  console.log("page provider mounted");
});

const obj = reactive({
  name: "Kai",
  age: 24,
  job: "developer",
});

provide("user", obj);
</script>
<template>
  <div>
    <slot />
  </div>
</template>
