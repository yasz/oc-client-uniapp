<template>
  <div class="min-h-screen flex flex-col items-center bg-gradient-to-t">
    <div class="text-center pt-40">
      <div
        class="text-[1.05rem] text-gray-500 tracking-wider leading-tight leading-loose"
      >
        欢迎来到Lifefunner"乐凡中文"！<br />
        Lifefunner使中文学习更有效、更轻松。
      </div>
      <div class="text-base text-gray-500 tracking-wider mb-2 mt-10">
        Welcome to Lifefunner!<br />
        Lifefunner helps Chinese learning <br />happy and easy.
      </div>
    </div>
    <view class="w-[80%] flex flex-col gap-4">
      <form @submit.prevent="submitForm">
        <input
          class="input-item"
          v-model="formModel.name"
          placeholder="请输入您的名字(必填)"
          required
        />
        <input
          class="input-item"
          v-model="formModel.contact"
          placeholder="请输入您联系方式(必填)"
          required
        />
        <input
          class="input-item"
          readonly
          :value="formModel.gender"
          placeholder="性 别(必填)"
          @click="showGenderPicker = true"
        />
        <picker
          v-if="showGenderPicker"
          :range="genderOptions"
          @change="(e: any) => {
            formModel.gender = genderOptions[e.detail.value];
            showGenderPicker = false;
          }"
          @cancel="showGenderPicker = false"
        />
        <view
          class="bg-gray-100 rounded-full py-4 mb-1 flex items-center justify-center"
        >
          <uni-datetime-picker
            v-model="formModel.birth"
            type="date"
            :border="false"
            placeholder="请选择出生年月(必填)"
            class="w-full text-center"
          />
        </view>
        <input
          class="input-item"
          readonly
          :value="formModel.language"
          placeholder="外语水平(必填)"
          @click="showLanguagePicker = true"
        />
        <picker
          v-if="showLanguagePicker"
          :range="languageOptions"
          @change="(e: any) => {
            formModel.language = languageOptions[e.detail.value];
            showLanguagePicker = false;
          }"
          @cancel="showLanguagePicker = false"
        />
        <input
          class="input-item"
          readonly
          :value="formModel.religion"
          placeholder="宗教信仰(必填)"
          @click="showReligionPicker = true"
        />
        <picker
          v-if="showReligionPicker"
          :range="religionOptions"
          @change="(e: any) => {
            formModel.religion = religionOptions[e.detail.value];
            showReligionPicker = false;
          }"
          @cancel="showReligionPicker = false"
        />
        <input
          class="input-item"
          v-model="formModel.experience"
          placeholder="语文/国际中文相关教学工作经历(必填) (若无,请简知高考语文成绩 卷/卷 分)"
          required
        />
        <input
          class="input-item"
          v-model="formModel.certificate"
          placeholder="相关证书(普通话等级证,教师资格证等)"
        />
        <input
          class="input-item"
          v-model="formModel.remark"
          placeholder="备注"
        />
        <input
          class="input-item"
          v-model="formModel.password"
          type="password"
          placeholder="请输入密码(必填)"
          required
        />
        <input
          class="input-item"
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
    </view>
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

const genderOptions = ["男", "女", "其他"];
const religionOptions = ["无", "佛教", "基督教", "伊斯兰教", "其他"];
const languageOptions = ["CET4", "CET6", "以上"];

const showGenderPicker = ref(false);
const showReligionPicker = ref(false);
const showLanguagePicker = ref(false);

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

<style scoped>
.input-item {
  @apply w-full bg-gray-100 rounded-full text-center text-gray-500  text-base mb-1 px-0 py-4 my-4;
}
</style>
