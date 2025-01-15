import { defineStore, acceptHMRUpdate } from "pinia";
import { reactive } from "vue";

// 初始值定义为一个函数，返回初始状态对象
const initialValue = () => ({
  nickname: "",
  userId: null as string | null,
  role: "",
  token: "",
});

export const useAuthStore = defineStore("authStore", () => {
  // 定义状态
  const state = reactive(initialValue());

  // 定义 actions
  const reset = () => {
    Object.assign(state, initialValue());
  };

  return {
    ...state,
    reset,
  };
});

// 热重载支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
