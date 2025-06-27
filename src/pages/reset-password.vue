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

                <form @submit="submitForm">
                    <input class="input-item" v-model="formModel.username" placeholder="请输入手机号" required
                        placeholder-style="color: #d1d5db;" />
                    <input class="input-item" v-model="formModel.email" placeholder="请输入邮箱" required type="email"
                        placeholder-style="color: #d1d5db;" />
                    <input class="input-item" v-model="formModel.password" type="password" placeholder="请输入新密码" required
                        placeholder-style="color: #d1d5db;" />
                    <input class="input-item" v-model="formModel.confirmPassword" type="password" placeholder="请确认新密码"
                        required placeholder-style="color: #d1d5db;" />

                    <button form-type="submit" @click="submitForm"
                        class="w-full py-6 mt-8 rounded-full text-white font-bold text-base"
                        style="background: linear-gradient(90deg, #f9b33b 0%, #f59743 100%)" :disabled="loading">
                        重置密码
                    </button>
                </form>


            </view>
        </view>

        <view class="absolute bottom-8 w-full flex justify-center">
            <img class="w-40" src="@/static/index/signup/logo.png" alt="logo" />
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { resetPassword } from "@/utils/api";
import useModal from "@/hooks/useModal";
import { go } from "@/utils/common";

const modal = useModal().modal;
const loading = ref(false);

const formModel = ref({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
});

function validateEmail(email: string) {
    return /^[\w-\.]+@[\w-]+(\.[\w-]+)+$/.test(email);
}

const submitForm = async () => {
    if (loading.value) return;
    loading.value = true;

    const { username, email, password, confirmPassword } = formModel.value;

    if (!username || !email || !password || !confirmPassword) {
        await modal("所有字段均为必填项");
        loading.value = false;
        return;
    }

    if (!validateEmail(email)) {
        await modal("邮箱格式不正确");
        loading.value = false;
        return;
    }

    if (password !== confirmPassword) {
        await modal("两次输入的密码不一致");
        loading.value = false;
        return;
    }

    try {
        const resetRes = await resetPassword({ username, email, password });

        if (resetRes.data) {
            await modal("若账号邮箱验证通过，密码将重置为您输入的密码！");
            go("/sign-in");
        } else {
            await modal("密码重置失败，请检查账号和邮箱是否正确");
        }
    } catch (err: any) {
        await modal(
            `操作失败！${err.response?.data?.errors?.[0]?.message || err.message}`
        );
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
