import axios from "axios";
import { defineStore } from "pinia";
import { watch } from "vue";
import pinia from "./store";
import { getUserInfoWithSpecialToken } from "@/utils/api";

// 创建 Pinia store 来管理认证状态
export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: null as string | null, // token
    userId: null as string | null, // 用户 ID
    nickname: null as string | null, // 昵称
    username: null as string | null, // 用户名
    roles: [] as string[], // 改为 roles 数组
    avatar: null as string | null, // 用户头像
    createdAt: null as string | null, // 用户创建时间
    re_registered: false as boolean, // 二次注册状态
    userInfo: null as any, // 用户信息，包含分配的课程
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
          const { id, nickname, roles, re_registered, username } =
            response.data.data;

          this.userId = id;
          this.nickname = nickname;
          this.username = username;
          this.roles = roles.map((e: any) => e.name);
          this.re_registered = re_registered || false;

          // 获取用户详细信息（头像、创建时间、分配的课程等）
          if (this.userId) {
            try {
              const userInfoResponse = await getUserInfoWithSpecialToken(
                Number(this.userId)
              );
              const userInfo = userInfoResponse.data.data;

              // 存储完整的用户信息
              this.userInfo = userInfo;

              if (userInfo?.avatar?.[0]?.url) {
                this.avatar =
                  import.meta.env.VITE_BUCKET_ENDPOINT + userInfo.avatar[0].url;
              }
              // 存储用户创建时间
              if (userInfo?.createdAt) {
                this.createdAt = userInfo.createdAt;
              }
              // 存储二次注册状态
              if (userInfo?.re_registered !== undefined) {
                this.nickname = userInfo.nickname;
                this.re_registered = userInfo.re_registered;
              }
            } catch (error) {
              console.error("获取用户详细信息失败:", error);
            }
          }
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
      this.userInfo = null; // 清空用户信息
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
