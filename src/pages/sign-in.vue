<template>
  <view class="container">
    <image class="logo" src="@/static/images/logo.png" />
    <view class="form-container">
      <!-- 本地图片 logo -->
      <!-- 输入邮箱 -->
      <input
        class="input"
        v-model="username"
        type="text"
        placeholder="Please input username"
      />

      <!-- 输入密码 -->
      <input
        class="input"
        v-model="password"
        type="password"
        placeholder="Please input Password"
      />

      <!-- 登录按钮 -->

      <view class="flex">
        <button
          class="sign-in-button"
          :disabled="loading"
          @click="handleSignIn"
        >
          {{ $t("sign in") }}
        </button>
        <button class="sign-in-button" @click="go('/sign-up')">
          {{ $t("signup") }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import useModal from "@/hooks/useModal";

import { useAuthStore } from "@/stores/authStore";
import { getUserInfoWithSpecialToken } from "@/utils/api";
import { go } from "@/utils/common";
import axios from "axios";
import { ref } from "vue";

// 定义状态
const username = ref("nocobase");
const password = ref("admin123");
const loading = ref(false);
const authStore = useAuthStore();
// 登录处理
const handleSignIn = async () => {
  if (!username.value || !password.value) {
    // alert('提示', '请输入邮箱和密码');
    return;
  }
  loading.value = true;
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_ENDPOINT}/auth:signIn`,
      { account: username.value, password: password.value },
      {
        headers: {
          "Content-Type": "application/json",
          "x-authenticator": "basic",
        },
      }
    );
    const { token } = response.data.data;
    authStore.token = token;
    await authStore.refreshAuthStore();
    // authStore.initUserInfo();
    if (authStore.userId) {
      try {
        const response = await getUserInfoWithSpecialToken(
          Number(authStore.userId)
        );
        const res = response.data;
        if (res?.data?.avatar?.[0]?.url) {
          authStore.avatar =
            import.meta.env.VITE_BUCKET_ENDPOINT + res.data.avatar[0].url;
        }
        // 存储用户创建时间
        if (res?.data?.createdAt) {
          authStore.createdAt = res.data.createdAt;
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    }
  } catch (err: any) {
    useModal().modal(err.message);
    return;
  }
  go("/index");
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ff8800;
}

.container::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: url("/static/images/title.jpg") no-repeat bottom center;
  background-size: cover;
}

.form-container {
  width: 80%;
  padding: 20px;
  z-index: 1;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 120px;
  height: 120px;
  margin-bottom: -30px;
  z-index: 0;
}

.input {
  width: 80%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 16px;
  padding-left: 8px;
}
</style>
