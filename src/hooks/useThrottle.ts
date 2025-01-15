// useThrottle.ts
import { ref, onUnmounted } from "vue";

export function useThrottle(throttleTime: number) {
  const isThrottled = ref(false);
  let throttleTimeout: ReturnType<typeof setTimeout> | null = null;

  const throttleClick = (callback: () => void) => {
    if (throttleTime > 0) {
      if (!isThrottled.value) {
        callback();
        isThrottled.value = true;
        throttleTimeout = setTimeout(() => {
          isThrottled.value = false;
        }, throttleTime);
      }
    } else {
      callback();
    }
  };

  onUnmounted(() => {
    if (throttleTimeout) {
      clearTimeout(throttleTimeout);
    }
  });

  return { throttleClick };
}
