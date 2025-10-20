/**
 * Composable to preload images before animations
 * @param {Array<Ref>|Ref} imageRefs - Single ref or array of refs to image elements
 * @returns {Object} { allImagesLoaded, waitForImages }
 */
export function useImagePreload(imageRefs) {
  const allImagesLoaded = ref(false);
  const loadedCount = ref(0);
  const totalImages = ref(0);

  /**
   * Check if an image is loaded
   */
  const isImageLoaded = (img) => {
    return img && img.complete && img.naturalHeight !== 0;
  };

  /**
   * Setup image loading listeners
   */
  const setupImageLoading = () => {
    const images = Array.isArray(imageRefs) ? imageRefs : [imageRefs];

    // Filter out null/undefined refs and ensure they are HTMLImageElements
    const validImages = images
      .map((ref) => ref?.value)
      .filter((img) => img !== null && img !== undefined && img instanceof HTMLImageElement);

    totalImages.value = validImages.length;

    if (totalImages.value === 0) {
      allImagesLoaded.value = true;
      return;
    }

    // Check how many are already loaded
    loadedCount.value = validImages.filter(isImageLoaded).length;

    if (loadedCount.value === totalImages.value) {
      allImagesLoaded.value = true;
      return;
    }

    // Setup load listeners for images that aren't loaded yet
    validImages.forEach((img) => {
      if (!isImageLoaded(img)) {
        const onLoad = () => {
          loadedCount.value++;
          if (loadedCount.value === totalImages.value) {
            allImagesLoaded.value = true;
          }
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onError);
        };

        const onError = () => {
          console.warn("Image failed to load:", img.src);
          loadedCount.value++;
          if (loadedCount.value === totalImages.value) {
            allImagesLoaded.value = true;
          }
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onError);
        };

        img.addEventListener("load", onLoad);
        img.addEventListener("error", onError);
      }
    });
  };

  /**
   * Returns a promise that resolves when all images are loaded
   */
  const waitForImages = () => {
    return new Promise((resolve) => {
      if (allImagesLoaded.value) {
        resolve();
      } else {
        const unwatch = watch(allImagesLoaded, (loaded) => {
          if (loaded) {
            resolve();
            unwatch();
          }
        });
      }
    });
  };

  // Setup on mount
  onMounted(() => {
    setupImageLoading();
  });

  return {
    allImagesLoaded,
    loadedCount,
    totalImages,
    waitForImages,
  };
}
