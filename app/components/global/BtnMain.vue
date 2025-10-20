<script setup>
import { NuxtLink } from "#components";

defineProps({
  url: {
    type: String,
    required: false,
  },
});
</script>
<template>
  <component :is="url ? NuxtLink : 'button'" :to="url" ref="refRoot"> Test button </component>
</template>
