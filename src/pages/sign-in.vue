<template>
  <div class="min-h-screen flex flex-col justify-between bg-orange-400">
    <div class="flex flex-col items-center mt-12">
      <img
        class="w-48 h-48 mb-4"
        src="@/static/index/signin/hippo.png"
        alt="hippo"
      />
      <img class="w-60 h-20" src="@/static/index/signin/logo.png" alt="logo" />
    </div>
    <div class="flex flex-col items-center">
      <div class="bg-white rounded-2xl shadow-lg p-8 w-11/12 max-w-md">
        <input
          class="block w-full mb-4 px-4 py-2 border rounded"
          placeholder="请输入手机号码"
        />
        <input
          class="block w-full mb-4 px-4 py-2 border rounded"
          type="password"
          placeholder="请输入密码"
        />
        <div class="flex justify-between text-sm text-gray-500 mb-4">
          <span>通过问题</span>
          <span>忘记密码？</span>
        </div>
        <button
          class="w-full py-3 bg-orange-400 text-white font-bold rounded-full mb-4"
        >
          登录 SIGN IN
        </button>
        <div class="flex justify-center space-x-6 mb-4">
          <span
            class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <i class="iconfont icon-weixin"></i>
          </span>
          <span
            class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <i class="iconfont icon-email"></i>
          </span>
          <span
            class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <i class="iconfont icon-bell"></i>
          </span>
        </div>
      </div>
      <div
        class="bg-white rounded-2xl shadow-lg p-4 mt-6 w-11/12 max-w-md flex justify-center text-gray-600 text-base"
      >
        <span>还没有登录账号？</span>
        <span class="text-orange-400 ml-2 cursor-pointer">立即注册</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useModal from "@/hooks/useModal";
import { useAuthStore } from "@/stores/authStore";
import { getUserInfoWithSpecialToken } from "@/utils/api";
import { go } from "@/utils/common";
import axios from "axios";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const loading = ref(false);
const authStore = useAuthStore();

const handleSignIn = async () => {
  if (!username.value || !password.value) {
    useModal().modal("请输入账号和密码");
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
        if (res?.data?.createdAt) {
          authStore.createdAt = res.data.createdAt;
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    }
    go("/index");
  } catch (err: any) {
    useModal().modal(err.message);
  } finally {
    loading.value = false;
  }
};
</script>
