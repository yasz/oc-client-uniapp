import { defineStore } from "pinia";
import { watch } from "vue";

// 创建 Pinia store 来管理认证状态、token、userId、nickname 和 role
export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: null as string | null,
    userId: null as string | null,
    nickname: null as string | null,
    role: "" as string, // 新增 role
  }),

  getters: {
    // 动态生成 API 配置，确保始终使用最新的 token
    apiConfig: (state) => {
      return {
        basePath: "https://a.praise.site:3002/api",
        baseOptions: {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      };
    },
  },

  actions: {
    // 登录逻辑
    signIn(token: string, userId: string, nickname: string, role: string) {
      this.token = token;
      this.userId = userId;
      this.nickname = nickname;
      this.role = role; // 设置 role
      console.log("【调试】:~~~【", role, "】");
    },

    // 登出逻辑
    async signOut() {
      this.token = null;
      this.userId = null;
      this.nickname = null;
      this.role = ""; // 清空 role

      uni.removeStorageSync("authStore");
    },

    // 用于同步 token、userId、nickname 和 role 到 AsyncStorage 或 localStorage
    async saveAuthDataToStorage() {
      try {
        const authStoreInstance = JSON.stringify({
          token: this.token,
          userId: this.userId,
          nickname: this.nickname,
          role: this.role, // 保存 role
        });
        uni.setStorageSync("authStore", authStoreInstance);
      } catch (error) {
        console.error("Error saving auth data to storage:", error);
      }
    },

    // 从存储恢复数据
    loadAuthDataFromStorage() {
      try {
        const storageData = uni.getStorageSync("authStore");
        if (storageData) {
          const { token, userId, nickname, role } = JSON.parse(storageData);
          this.token = token;
          this.userId = userId;
          this.nickname = nickname;
          this.role = role; // 恢复 role
        }
      } catch (error) {
        console.error("Error loading auth data from storage:", error);
      }
    },
  },
});

// 创建实例后，初始化时从 storage 加载状态
export const initAuthStore = () => {
  console.log("【调试】:【", "initAuthStore", "】");
  const authStore = useAuthStore();
  authStore.loadAuthDataFromStorage();

  // 监听 authStore 的状态变化并保存到 storage
  watch(
    authStore.$state,
    () => {
      authStore.saveAuthDataToStorage();
    },
    { deep: true }
  );
};
initAuthStore();
