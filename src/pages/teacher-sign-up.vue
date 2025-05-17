<template>
  <div
    class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-t from-[#F9B33B] to-[#F59743] py-8"
  >
    <div class="text-center mb-6">
      <div class="text-lg font-bold text-gray-700 leading-tight mb-2">
        欢迎来到Lifefunner"乐凡中文"！<br />
        Lifefunner使中文学习更有效、更轻松。
      </div>
      <div class="text-base text-gray-500 mb-2">
        Welcome to Lifefunner!<br />
        Lifefunner helps Chinese learning happy and easy.
      </div>
    </div>
    <form class="w-full max-w-md space-y-4" @submit.prevent="submitForm">
      <input
        class="w-full bg-gray-100 rounded-full px-6 py-4 text-center text-gray-400 placeholder-gray-400 text-base mb-1"
        v-model="formModel.name"
        placeholder="请输入您的名字(必填)"
        required
      />
      <input
        class="w-full bg-gray-100 rounded-full px-6 py-4 text-center text-gray-400 placeholder-gray-400 text-base mb-1"
        v-model="formModel.contact"
        placeholder="请输入您联系方式(必填)"
        required
      />
      <input
        class="w-full bg-gray-100 rounded-full px-6 py-4 text-center text-gray-400 placeholder-gray-400 text-base mb-1"
        v-model="formModel.gender"
        placeholder="性 别(必填)"
        required
      />
      <input
        class="w-full bg-gray-100 rounded-full px-6 py-4 text-center text-gray-400 placeholder-gray-400 text-base mb-1"
        v-model="formModel.birth"
        placeholder="出生年月(必填)"
        required
      />
      <input
        class="w-full bg-gray-100 rounded-full px-6 py-4 text-center text-gray-400 placeholder-gray-400 text-base mb-1"
        v-model="formModel.language"
        placeholder="外语水平(必填)"
        required
      />
      <input
        class="w-full bg-gray-100 rounded-full px-6 py-4 text-center text-gray-400 placeholder-gray-400 text-base mb-1"
        v-model="formModel.religion"
        placeholder="宗教信仰(必填)"
        required
      />
      <input
        class="w-full bg-gray-100 rounded-full px-6 py-4 text-center text-gray-400 placeholder-gray-400 text-base mb-1"
        v-model="formModel.experience"
        placeholder="语文/国际中文相关教学工作经历(必填) (若无,请简知高考语文成绩 卷/卷 分)"
        required
      />
      <input
        class="w-full bg-gray-100 rounded-full px-6 py-4 text-center text-gray-400 placeholder-gray-400 text-base mb-1"
        v-model="formModel.certificate"
        placeholder="相关证书(普通话等级证,教师资格证等)"
      />
      <input
        class="w-full bg-gray-100 rounded-full px-6 py-4 text-center text-gray-400 placeholder-gray-400 text-base mb-1"
        v-model="formModel.remark"
        placeholder="备注"
      />
      <input
        class="w-full bg-gray-100 rounded-full px-6 py-4 text-center text-gray-400 placeholder-gray-400 text-base mb-1"
        v-model="formModel.password"
        type="password"
        placeholder="请输入密码(必填)"
        required
      />
      <input
        class="w-full bg-gray-100 rounded-full px-6 py-4 text-center text-gray-400 placeholder-gray-400 text-base mb-1"
        v-model="formModel.confirmPassword"
        type="password"
        placeholder="请再次输入密码(必填)"
        required
      />
      <button
        type="submit"
        class="w-full py-4 mt-2 rounded-full text-white font-bold text-lg"
        style="background: linear-gradient(90deg, #f9b33b 0%, #f59743 100%)"
      >
        申请成为平台老师
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const formModel = ref({
  name: "",
  contact: "",
  gender: "",
  birth: "",
  language: "",
  religion: "",
  experience: "",
  certificate: "",
  remark: "",
  password: "",
  confirmPassword: "",
});

const submitForm = () => {
  if (formModel.value.password !== formModel.value.confirmPassword) {
    // 这里可以用 uni.showToast 或 alert
    alert("两次输入的密码不一致");
    return;
  }
  // 这里可以添加表单校验和提交逻辑
  // 例如：uni.showToast({ title: '提交成功', icon: 'success' });
  console.log("提交表单", formModel.value);
};
</script>
