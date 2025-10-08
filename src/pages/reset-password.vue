<template>
    <view class="min-h-screen flex flex-col items-center justify-center relative bg-gradient-yellow px-4">
        <!-- <view class="w-full flex items-center px-8 pt-8 ">
            <img class="w-32" src="@/static/index/signup/hippo.png" alt="hippo" />
        </view> -->

        <view class="w-full max-w-md flex flex-col gap-4">
            <view class="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                <view class="text-center mb-6">
                    <text class="text-xl font-bold text-gray-700">重置密码</text>
                </view>

                <view>
                    <input class="input-item" v-model="formModel.email" placeholder="请输入注册时使用的邮箱" required type="email"
                        placeholder-style="color: #d1d5db;" />

                    <button @click="submitForm"
                        class="w-full py-6 mt-8 rounded-full text-white font-bold text-base"
                        style="background: linear-gradient(90deg, #f9b33b 0%, #f59743 100%)" :disabled="loading">
                        发送重置邮件
                    </button>
                </view>


            </view>
        </view>

        <view class="absolute bottom-8 w-full flex justify-center">
            <img class="w-40" src="@/static/index/signup/logo.png" alt="logo" />
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useModal from "@/hooks/useModal";
import { go } from "@/utils/common";
import axios from "axios";

const modal = useModal().modal;
const loading = ref(false);

const formModel = ref({
    email: "",
});

function validateEmail(email: string) {
    return /^[\w-\.]+@[\w-]+(\.[\w-]+)+$/.test(email);
}

const submitForm = async () => {
    if (loading.value) return;
    const { email } = formModel.value;

    if (!email || !validateEmail(email)) {
        await modal("请输入有效的邮箱地址。");
        return;
    }

    loading.value = true;
    try {
        await axios.get('https://id.lifefunchinese.cc/api/reset-password-request', {
            params: { email }
        });

        await modal("如果该邮箱已注册，您将会收到一封包含重置密码链接的邮件，请注意查收。");
        go("/sign-in");

    } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || '请稍后再试';
        await modal(`操作失败: ${errorMessage}`);
        console.error('Password reset request failed:', err);
    } finally {
        loading.value = false;
    }
};

const goBack = () => {
    go("/sign-in");
};
</script>

<style scoped>
.input-item {
    @apply w-full bg-gray-100 rounded-full text-center text-base px-0 py-4 my-3;
}
</style>
