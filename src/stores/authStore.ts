import axios from "axios";
import { defineStore } from "pinia";
import { watch } from "vue";
import pinia from "./store";

// 创建 Pinia store 来管理认证状态
export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: null as string | null, // token
    userId: null as string | null, // 用户 ID
    nickname: null as string | null, // 昵称
    roles: [] as string[], // 改为 roles 数组
    avatar: null as string | null, // 用户头像
    createdAt: null as string | null, // 用户创建时间
    re_registered: false as boolean, // 二次注册状态
  }),

  getters: {
    // 动态生成 API 配置，确保始终使用最新的 token
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
          const { id, nickname, roles, re_registered } = response.data.data;
          this.userId = id;
          this.nickname = nickname;
          this.roles = roles.map((e: any) => e.name);
          this.re_registered = re_registered || false;
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
      console.log("【调试】:【", "登出清token", "】");
      this.token = "";
      this.userId = null;
      this.nickname = null;
      this.roles = []; // 清空状态
      this.avatar = null; // 清空头像
      this.createdAt = null; // 清空创建时间
      this.re_registered = false; // 清空二次注册状态
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

watch(
  () => useAuthStore(pinia).token,
  (newToken) => {
    if (newToken) {
      uni.setStorageSync("authToken", newToken);
    } else {
      uni.removeStorageSync("authToken");
    }
  }
);
