<script setup>
const pageStore = usePageStore();
</script>
<template>
  <CorePageProvider>
    <CoreSmoothScrollProvider>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </CoreSmoothScrollProvider>
  </CorePageProvider>
</template>
