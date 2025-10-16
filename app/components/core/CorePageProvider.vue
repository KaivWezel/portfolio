<script setup>
const router = useRouter();

router.beforeEach((to, from, next) => {
  console.log("Navigating from", from.fullPath, "to", to.fullPath);
  // Set page state to leave:start

  // When ended, set to leave:end
  setTimeout(() => {
    // Calling next to start navigation
    next();
    // Imediately set to enter:start
  }, 1000);
});
</script>
<template>
  <div>
    <slot />
  </div>
</template>
