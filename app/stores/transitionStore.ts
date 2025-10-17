export const useTransitionStore = defineStore("transition", () => {
  const promises = ref<Promise<any>[]>([]);
  const isTransitioning = ref(false);

  function registerOutro(promise: Promise<any>) {
    promises.value.push(promise);
  }

  function resolvePromises(cb: () => void) {
    return Promise.all(promises.value).then(() => {
      cb();
    });
  }

  return {
    promises,
    isTransitioning,
    registerOutro,
    resolvePromises,
  };
});
