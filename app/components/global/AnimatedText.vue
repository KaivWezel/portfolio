<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <div class="animatedText__wrapper">
    <span>{{ text }}</span>
  </div>
</template>
<style>
.animatedText {
  &__wrapper {
    overflow: hidden;
  }
}
</style>
