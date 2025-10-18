export const useTransitionStore = defineStore("transition", () => {
  const promises = ref<Promise<any>[]>([]);
  const isTransitioning = ref(false);

  function registerOutro(promise: Promise<any>) {
    promises.value.push(promise);
  }

  async function resolvePromises(cb: () => void) {
    await Promise.all(promises.value);
    cb();
  }

  return {
    promises,
    isTransitioning,
    registerOutro,
    resolvePromises,
  };
});
