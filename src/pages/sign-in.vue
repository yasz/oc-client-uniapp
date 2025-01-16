<template>
    <view class="container">
        <view class="form-container">
            <!-- 本地图片 logo -->
            <image class="logo" src="@/static/images/logo.jpg" />

            <!-- 输入邮箱 -->
            <input class="input" v-model="email" type="text" placeholder="请输入邮箱" />

            <!-- 输入密码 -->
            <input class="input" v-model="password" type="password" placeholder="请输入密码" />

            <!-- 登录按钮 -->

            <button class="sign-in-button" :disabled="loading" @click="handleSignIn">
                {{ $t("sign in") }}
            </button>

        </view>
    </view>
</template>

<script setup lang="ts">
import useModal from '@/hooks/useModal';
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { go } from '@/utils/common';
import axios from 'axios';
import { ref } from 'vue';

// 定义状态
const email = ref('admin@nocobase.com');
const password = ref('admin123');
const loading = ref(false);
const authStore = useAuthStore();


async function axiosSignIn(email: string, password: string) {
    try {
        // 使用 axios 发送 POST 请求
        const response = await axios.post(
            'https://a.praise.site:3002/api/auth:signIn',
            { email, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-authenticator': 'basic',
                }
            }
        );

        // 从响应中提取数据
        const { token, id, nickname, role } = response.data.data;
        console.log('登录成功，获取的 Token:', token);

        // 返回所需的值
        return { token, id, nickname, role };
    } catch (error) {
        console.error('登录失败:', error);
        throw new Error('登录失败，请检查用户名和密码。');
    }
}


// 登录处理
const handleSignIn = async () => {
    if (!email.value || !password.value) {
        // alert('提示', '请输入邮箱和密码');
        return;
    }
    loading.value = true;
    try {
        const { token, id, nickname, role } = await axiosSignIn(email.value, password.value);
        authStore.signIn(token, id, nickname, role);
    } catch (err: any) {
        useModal().modal(err.message);
        return
    }
    go("/index")

};

</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #fff;
}

.form-container {
    width: 100%;
    max-width: 400px;
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo {
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
}

.input {
    width: 80%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 16px;
    padding-left: 8px;
}

.sign-in-button {
    width: 60%;
    height: 40px;
    background-color: #f59e0b;
    color: white;
    border-radius: 4px;
}
</style>