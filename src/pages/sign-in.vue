<template>
  <view class="">
    <!-- 第一层 打底色-->
    <view class="fixed inset-0 bg-gradient-yellow z--3"></view>
    <!-- 第二层 图片 -->
    <view class="flex-col items-center z--2">
      <img class="w-32 mt-[10vh]" src="@/static/index/signin/hippo.png" alt="hippo" />
      <div class="h-[60vh]"></div>
      <img class="w-40" src="@/static/index/signin/logo.png" alt="logo" />
    </view>
    <!-- 第三层 登录框 -->
    <view class="absolute inset-0 flex flex-col items-center justify-center z-1">
      <view class="relative w-[80%] h-[40vh] bg-white rounded-2xl flex items-center justify-center">
        <text class="bottom-[30rpx] t-14 absolute text-base text-gray-400 text-center">
          还没有登录账号？
          <text class="text-primary" @click="go('/sign-up')">立即注册</text>
        </text>
      </view>
    </view>
    <!-- 第四层 -->
    <view class="relative inset-0 flex-col items-center justify-center z-3">
      <view class="w-[90%] h-[40vh] mt-[-103vh] bg-white rounded-2xl shadow-lg px-6 py-8 flex flex-col items-stretch">
        <!-- 手机号输入框 -->
        <view class="flex w-[80%] mx-auto mt-20 items-center bg-gray-100 rounded-full py-10 px-10">
          <u-icon name="account" color="#F9B33B" size="22" class="ml-1"></u-icon>
          <input class="flex-1 t-16 bg-transparent border-none outline-none ml-3 text-gray-700 text-20"
            v-model="username" placeholder-style="color: #bbb" placeholder="请输入手机号/邮箱" type="text" />
        </view>
        <!-- 密码输入框 -->
        <view class="flex w-[80%] my-20 mx-auto items-center bg-gray-100 rounded-full py-10 px-10">
          <u-icon name="lock" color="#F9B33B" size="22" class="ml-1"></u-icon>
          <input class="flex-1 ml-3 t-16 text-gray-700 text-base" placeholder-style="color: #bbb" v-model="password"
            placeholder="请输入密码" type="password" />
        </view>
        <!-- 忘记密码 -->
        <view class="flex justify-end mb-4" @click="go('/reset-password')">
          <text class="text-[#f9b33b] text-sm">
            忘记密码？
          </text>
        </view>
        <!-- 登录按钮 -->
        <view class="pt-20">
          <button class="w-[90%] py-3 rounded-full text-white font-bold text-lg"
            style="background: linear-gradient(90deg, #f9b33b 0%, #f59743 100%)" @click="handleSignIn">
            登录 SIGN IN
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import useModal from "@/hooks/useModal";
import { useAuthStore } from "@/stores/authStore";
import { getUserInfoWithSpecialToken } from "@/utils/api";
import { go, go2 } from "@/utils/common";
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
    if (err.response?.status === 401) {
      useModal().modal("密码错误，请检查手机号/邮箱与密码是否匹配！");
    } else {
      useModal().modal(err.message || "登录失败，请稍后重试");
    }
  } finally {
    loading.value = false;
  }
};
</script>
