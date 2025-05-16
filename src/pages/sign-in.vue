<template>
  <view class="">
    <!-- 第一层 打底色-->
    <view class="fixed inset-0 bg-gradient-yellow z--3"></view>
    <!-- 第二层 图片 -->
    <view class="flex-col items-center z--2">
      <img
        class="w-32 mt-[10vh]"
        src="@/static/index/signin/hippo.png"
        alt="hippo"
      />
      <div class="h-[60vh]"></div>
      <img class="w-40" src="@/static/index/signin/logo.png" alt="logo" />
    </view>
    <!-- 第三层 登录框 -->
    <view
      class="absolute inset-0 flex flex-col items-center justify-center z-[-1]"
    >
      <view
        class="relative w-[80%] h-[40vh] bg-white rounded-2xl flex items-center justify-center"
      >
        <text
          class="bottom-[30rpx] t-14 absolute text-base text-gray-400 text-center"
        >
          还没有登录账号？立即注册
        </text>
      </view>
    </view>
    <!-- 第四层 -->
    <view class="absolute inset-0 flex-col items-center justify-center z-2">
      <view class="w-[90%] h-[40vh] mt-[-20vh] bg-white rounded-2xl shadow-lg">
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
