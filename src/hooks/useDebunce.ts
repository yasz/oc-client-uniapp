// useDebounce.ts
import { ref, onUnmounted } from "vue";

export function useDebounce(debounceTime: number) {
  const isDisabled = ref(false);
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  const debounceClick = (callback: () => void) => {
    if (debounceTime > 0) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(() => {
        isDisabled.value = false;
        callback();
      }, debounceTime);
      isDisabled.value = true;
    } else {
      callback();
    }
  };

  onUnmounted(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  });

  return { isDisabled, debounceClick };
}
