import { Configuration } from "@/generated-client";
import axios from "axios";
import { defineStore } from "pinia";
import { watch } from "vue";

// 创建 Pinia store 来管理认证状态
export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: null as string | null, // token
    userId: null as string | null, // 用户 ID
    nickname: null as string | null, // 昵称
    role: "" as string, // 用户角色
    isAuthInitialized: false,
  }),

  getters: {
    // 动态生成 API 配置，确保始终使用最新的 token
    apiConfig: (state) => {
      return new Configuration({
        basePath: import.meta.env.VITE_API_ENDPOINT,
        baseOptions: {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      });
    },
  },

  actions: {
    // 检查 token 是否有效
    async refreshAuthStore() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/auth:check`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        if (response.data) {
          // 更新 store 数据

          const { id, nickname, roles } = response.data.data;
          this.userId = id;
          this.nickname = nickname;
          this.role = roles.map((e: any) => {
            return e.name;
          });
        }
        return response.data;
      } catch (error) {
        // console.error("Token 检查失败:", error);
        this.signOut(); // Token 无效，清除状态
        return null;
      }
    },

    // 登出逻辑
    async signOut() {
      this.token = "";
      this.userId = null;
      this.nickname = null;
      this.role = ""; // 清空状态
    },

    // 从存储中加载 token 并验证
    async loadTokenFromStorage() {
      try {
        //程序每次启动检验一下token是否过期
        const token = uni.getStorageSync("authToken");
        if (token) {
          this.token = token;
          // 检查 token 是否有效

          const checkResponse = await this.refreshAuthStore();

          if (!checkResponse) {
            this.signOut(); // 如果无效，登出并清理状态
          }
        }
      } catch (error) {
        console.error("加载 token 失败:", error);
      }
    },
  },
});

const authStore = useAuthStore();
watch(
  () => authStore.token,
  (newToken) => {
    console.log("【调试】:【", "refreshToken", "】");
    if (newToken) {
      uni.setStorageSync("authToken", newToken);
    } else {
      uni.removeStorageSync("authToken");
    }
  }
);
// 初始化 AuthStore
const initAuthStore = async () => {
  console.log("【调试】: 初始化 AuthStore");

  await useAuthStore().loadTokenFromStorage();

  // 监听 token 状态变化，仅在 token 变化时更新 storage
};
await initAuthStore();
