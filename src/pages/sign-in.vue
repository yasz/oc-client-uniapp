<template>
  <view class="full">
    <div class="bg-layer"></div>
    <view class="bg ab-c-x">
      <view :style="{ transform: `scale(0.5) translateY(20rpx)` }">
        <image
          class="hippo"
          src="@/static/index/signin/hippo.png"
          mode="aspectFit"
        />
      </view>
      <view style="transform: scale(0.7)">
        <image src="@/static/index/signin/logo.png" mode="aspectFit" />
      </view>
    </view>

    <view class="content">
      <!-- <view class="form-container">
        <view class="input-group">
          <view class="input-wrapper">
            <u-icon name="account" size="20"></u-icon>
            <input
              class="input"
              v-model="username"
              type="text"
              :placeholder="$t('请输入手机号码')"
            />
          </view>
          <view class="input-wrapper">
            <u-icon name="lock" size="20"></u-icon>
            <input
              class="input"
              v-model="password"
              type="password"
              :placeholder="$t('请输入密码')"
            />
          </view>
        </view>

        <view class="action-row">
          <text class="forgot-text">通过问题</text>
          <text class="forgot-text">忘记密码？</text>
        </view>

        <button
          class="sign-in-button"
          :disabled="loading"
          @click="handleSignIn"
        >
          登录 SIGN IN
        </button>

        <view class="divider">
          <text class="divider-text">其他方式登录</text>
        </view>

        <view class="social-icons">
          <view class="icon-wrapper">
            <u-icon name="weixin-fill" color="#333" size="24"></u-icon>
          </view>
          <view class="icon-wrapper">
            <u-icon name="email" color="#333" size="24"></u-icon>
          </view>
          <view class="icon-wrapper">
            <u-icon name="bell" color="#333" size="24"></u-icon>
          </view>
        </view>
      </view> -->

      <view class="signup-card">
        <text>还没有登录账号？</text>
        <text class="link" @click="go('/sign-up')">立即注册</text>
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

<style scoped></style>
