<template>
  <view>
    <view class="fixed inset-0 bg-gradient-yellow z--3"></view>

    <!-- 选择用户类型页面 -->
    <view v-if="!showForm" class="flex-col pt-[10vh] items-center z--2">
      <img class="w-40" src="@/static/index/signup/logo.png" alt="logo" />
      <view class="flex-col t-40 items-center tracking-widest pt-60">
        <text class="text-[#754D39] bold font-black"> WELCOME TO</text>
        <text class="text-[#754D39] bold font-black pt-10"> LIFEFUNNER</text>
      </view>
      <div class="flex justify-center gap-8 my-8 pt-20">
        <button @click="selectUserType('teacher')" type="button"
          class="w-[40vw] h-16 rounded-full shadow-lg bg-gradient-to-b from-white to-[#f7f3ed] flex items-center justify-center text-xl font-bold text-[#7a4d13] tracking-widest">
          我是老师
        </button>
        <button @click="selectUserType('student')" type="button"
          class="w-[40vw] h-16 rounded-full shadow-lg bg-gradient-to-b from-white to-[#f7f3ed] flex items-center justify-center text-xl font-bold text-[#7a4d13] tracking-widest">
          我是学生
        </button>
      </div>
      <img class="w-60 pt-[20%]" src="@/static/index/signup/hippo.png" alt="logo" />
    </view>

    <!-- 注册表单页面 -->
    <view v-if="showForm" class="min-h-screen flex flex-col items-center relative ">
      <view class="relative z-10 pt-[5%] w-full justify-center md:hidden">
        <view class="absolute flex z-10 pt-[5%] w-full justify-center">
          <img class="w-32" src="@/static/index/signup/hippo.png" alt="hippo" />
          <view class="w-[50%] flex-col pt-[10%]">
            <img class="w-[80%]" src="@/static/index/signup/tip1.png" alt="tip1" />
            <img class="w-[60%]" src="@/static/index/signup/tip2.png" alt="tip2" />
          </view>
        </view>
      </view>

      <view class="w-[90%] flex flex-col gap-4 pt-[20vh]">
        <view class="bg-white rounded-3xl shadow-lg p-6">
          <form @submit="submitForm">
            <input class="input-item" v-model="formModel.username" placeholder="手机号(必填)" required
              placeholder-style="color: #d1d5db;" type="number" />
            <input class="input-item" v-model="formModel.email" placeholder="邮箱(选填)" required type="email"
              placeholder-style="color: #d1d5db;" />
            <input class="input-item" v-model="formModel.password" type="password" placeholder="请输入密码(必填)" required
              placeholder-style="color: #d1d5db;" />
            <input class="input-item" v-model="formModel.confirmPassword" type="password" placeholder="请再次输入密码(必填)"
              required placeholder-style="color: #d1d5db;" />

            <button form-type="submit" @click="submitForm"
              class="w-full py-6 mt-8 rounded-full text-white font-bold text-base"
              style="background: linear-gradient(90deg, #f9b33b 0%, #f59743 100%)" :disabled="loading">
              {{ userType === 'teacher' ? '注册' : '注册' }}
            </button>

            <button type="button" @click="goBack"
              class="w-full py-4 mt-4 rounded-full text-gray-600 font-bold text-base border border-gray-300">
              返回选择
            </button>
          </form>
        </view>
      </view>

      <view class="absolute bottom-8 w-full flex justify-center">
        <img class="w-40" src="@/static/index/signup/logo.png" alt="logo" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { signUpStudent, signUpTeacher } from "@/utils/api";
import useModal from "@/hooks/useModal";
import { go } from "@/utils/common";

const modal = useModal().modal;
const loading = ref(false);
const showForm = ref(false);
const userType = ref('');

const formModel = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
});

const selectUserType = (type: string) => {
  userType.value = type;
  formModel.value.role = type;
  showForm.value = true;
};

const goBack = () => {
  showForm.value = false;
  userType.value = '';
  formModel.value = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  };
};

function validateEmail(email: string) {
  return /^[\w-\.]+@[\w-]+(\.[\w-]+)+$/.test(email);
}

const submitForm = async () => {
  if (loading.value) return;
  loading.value = true;

  // 校验必填字段
  const requiredFields = userType.value === 'teacher'
    ? ['username', 'email', 'password', 'confirmPassword']
    : ['email', 'password', 'confirmPassword'];

  const missingFields = requiredFields.filter(field => !formModel.value[field as keyof typeof formModel.value]);
  if (missingFields.length > 0) {
    const fieldNames = {
      username: '手机号',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码'
    };
    await modal(`${missingFields.map(f => fieldNames[f as keyof typeof fieldNames]).join('、')}为必填项`);
    loading.value = false;
    return;
  }

  if (!validateEmail(formModel.value.email)) {
    await modal("邮箱格式不正确");
    loading.value = false;
    return;
  }

  if (formModel.value.password !== formModel.value.confirmPassword) {
    await modal("两次输入的密码不一致");
    loading.value = false;
    return;
  }

  try {
    const { confirmPassword, ...submitData } = formModel.value;
    const res = userType.value === 'teacher'
      ? await signUpTeacher({
        ...submitData,
        roles: ['teacher', 'student'],
      })
      : await signUpStudent({
        ...submitData,
        roles: 'student',
      });

    if (res.data) {
      await modal("注册成功！");
      go('/sign-in');
    } else {
      await modal("注册失败！");
    }
  } catch (err: any) {
    await modal(`注册异常！${err.response?.data?.errors?.[0]?.message || err.message}`);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input-item {
  @apply w-full bg-gray-100 rounded-full text-center text-base px-0 py-4 my-3;
}
</style>
