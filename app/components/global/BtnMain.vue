<script setup>
import { NuxtLink } from "#components";

defineProps({
  url: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: true,
    default: "Main Button",
  },
});
</script>
<template>
  <component :is="url ? NuxtLink : 'button'" :to="url" ref="refRoot">{{ label }}</component>
</template>
