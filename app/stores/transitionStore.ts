export const useTransitionStore = defineStore("transition", () => {
  const promises = ref<Promise<any>[]>([]);
  const isTransitioning = ref(false);

  function registerOutro(promise: Promise<any>) {
    promises.value.push(promise);
  }

  async function runOutro() {
    isTransitioning.value = true;
    await Promise.all(promises.value);
    promises.value = [];
    isTransitioning.value = false;
  }

  return {
    promises,
    isTransitioning,
    registerOutro,
    runOutro,
  };
});
