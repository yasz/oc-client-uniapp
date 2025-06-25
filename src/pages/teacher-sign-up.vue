<template>
  <div class="min-h-screen flex flex-col items-center bg-gradient-to-t">
    <div class="text-center pt-40">
      <div class="text-[1.05rem] text-gray-500 tracking-wider leading-tight leading-loose">
        欢迎来到Lifefunner乐凡中文！<br />
        Lifefunner使中文学习更有效、更轻松。
      </div>
      <div class="text-base text-gray-500 tracking-wider mb-2 mt-10">
        Welcome to Lifefunner!<br />
        Lifefunner helps Chinese learning <br />happy and easy.
      </div>
    </div>
    <view class="w-[80%] flex flex-col gap-4">
      <form @submit="submitForm">
        <!-- 账号 -->
        <view v-if="!isReregisterMode" class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.username" placeholder="账号" required
            placeholder-style="color: #d1d5db;" />
        </view>

        <!-- 昵称 -->
        <view class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.nickname" placeholder="昵称" required
            placeholder-style="color: #d1d5db;" />
        </view>

        <!-- 邮箱 -->
        <view v-if="!isReregisterMode" class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.email" placeholder="邮箱" required type="email"
            placeholder-style="color: #d1d5db;" />
        </view>

        <!-- 手机号码 -->
        <view v-if="!isReregisterMode" class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.phone" placeholder="手机号码" required
            placeholder-style="color: #d1d5db;" />
        </view>

        <!-- 密码 -->
        <view v-if="!isReregisterMode" class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.password" type="password" placeholder="请输入密码" required
            placeholder-style="color: #d1d5db;" />
        </view>

        <!-- 确认密码 -->
        <view v-if="!isReregisterMode" class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.confirmPassword" type="password" placeholder="请再次输入密码" required
            placeholder-style="color: #d1d5db;" />
        </view>

        <!-- 姓名 -->
        <view class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.realname" placeholder="请输入您的名字" required
            placeholder-style="color: #d1d5db;" />
        </view>

        <!-- 联系方式 -->
        <view class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.contact" placeholder="请输入您联系方式" required
            placeholder-style="color: #d1d5db;" />
        </view>

        <!-- 性别 -->
        <view class="form-item">
          <text class="required-star">*</text>
          <picker mode="selector" :range="genderOptions" :value="genderIndex" @change="onGenderChange">
            <input class="input-item" readonly :value="formModel.gender" placeholder="性 别"
              placeholder-style="color: #d1d5db;" />
          </picker>
        </view>

        <!-- 出生年月 -->
        <view class="form-item">
          <text class="required-star">*</text>
          <picker mode="date" :value="formModel.birth" @change="onBirthChange">
            <input class="input-item" readonly :value="formModel.birth" placeholder="请选择出生年月"
              placeholder-style="color: #d1d5db;" />
          </picker>
        </view>

        <!-- 英语水平 -->
        <view class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.english_level" placeholder="英语水平"
            placeholder-style="color: #d1d5db;" />
        </view>

        <!-- 宗教信仰 -->
        <view class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.religion" placeholder="宗教信仰"
            placeholder-style="color: #d1d5db;" />
        </view>

        <!-- 教学经历 -->
        <view class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.experience" placeholder="语文/国际中文相关教学工作经历" required
            placeholder-style="color: #d1d5db;" />
        </view>

        <!-- 中文教学证书 -->
        <view class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.chinese_level" placeholder="中文教学相关证书（普通话等级、教师资格证类型等；或高考语文成绩）"
            placeholder-style="color: #d1d5db;font-size: 9px;" />
        </view>

        <!-- 备注 -->
        <view class="form-item">
          <text class="required-star">*</text>
          <input class="input-item" v-model="formModel.remark" placeholder="备注" placeholder-style="color: #d1d5db;" />
        </view>
        <button form-type="submit" @click="submitForm"
          class="w-full py-8 my-20 rounded-full text-white font-bold text-base"
          style="background: linear-gradient(90deg, #f9b33b 0%, #f59743 100%)" :disabled="loading">
          {{ isReregisterMode ? '申请成为本平台教师' : '申请成为本平台教师' }}
        </button>
      </form>
    </view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { signUpTeacher, updateTeacher } from "@/utils/api";
import useModal from "@/hooks/useModal";
import { useAuthStore } from "@/stores/authStore";

const modal = useModal().modal;
const loading = ref(false);
const authStore = useAuthStore();

// 判断是否为重新注册模式
const isReregisterMode = ref(false);

onMounted(() => {
  // 获取URL参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = (currentPage as any).options || {};

  isReregisterMode.value = options.from === 'reregister';

  // 如果是重新注册模式，预填充用户信息
  if (isReregisterMode.value) {
    formModel.value.nickname = authStore.nickname || '';
    // 其他字段保持空白，让用户填写
  }
});

// const formModel = ref({
//   username: "test1",
//   email: "test@a.com",
//   phone: "",
//   password: "123123",
//   confirmPassword: "123123",
//   realname: "",
//   contact: "",
//   gender: "女",
//   birth: "1991-01-01",
//   english_level: "",
//   religion: "",
//   experience: "",
//   chinese_level: "",
//   remark: "",
// });
const formModel = ref({
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  realname: "",
  nickname: "",
  contact: "",
  gender: "",
  birth: "",
  english_level: "",
  religion: "",
  experience: "",
  chinese_level: "",
  remark: "",
});
const genderOptions = ["男", "女"];

const genderIndex = ref(-1);

const onGenderChange = (e: any) => {
  genderIndex.value = e.detail.value;
  formModel.value.gender = genderOptions[genderIndex.value];
};
const onBirthChange = (e: any) => {
  formModel.value.birth = e.detail.value;
};

function validateEmail(email: string) {
  return /^[\w-\.]+@[\w-]+(\.[\w-]+)+$/.test(email);
}

const submitForm = async () => {
  if (loading.value) return;
  loading.value = true;

  // 重新注册模式下的验证逻辑
  if (isReregisterMode.value) {
    // 验证所有必填字段
    const requiredFields = [
      { field: 'nickname', name: '昵称' },
      { field: 'realname', name: '姓名' },
      { field: 'contact', name: '联系方式' },
      { field: 'gender', name: '性别' },
      { field: 'birth', name: '出生年月' },
      { field: 'english_level', name: '英语水平' },
      { field: 'religion', name: '宗教信仰' },
      { field: 'experience', name: '教学经历' },
      { field: 'chinese_level', name: '中文教学证书' },
      { field: 'remark', name: '备注' }
    ];

    for (const { field, name } of requiredFields) {
      if (!formModel.value[field as keyof typeof formModel.value]) {
        await modal(`${name}为必填项`);
        loading.value = false;
        return;
      }
    }

    try {
      // 在二次注册模式下，只提交必要的字段，排除username、email、password、confirmPassword、phone
      const { username, email, password, confirmPassword, phone, ...updateData } = formModel.value;
      const res = await updateTeacher(Number(authStore.userId), {
        name: updateData.realname,
        ...updateData,
        re_registered: true,
      });
      if (res.data) {
        await modal("信息更新成功！");
        // 更新authStore中的re_registered状态
        authStore.re_registered = true;
        // 返回上一页
        uni.navigateBack();
      } else {
        await modal("更新失败！");
      }
    } catch (err: any) {
      await modal(`更新异常！${err.response?.data?.errors?.[0]?.message || err.message}`);
    } finally {
      loading.value = false;
    }
    return;
  }

  // 原始注册模式的验证逻辑
  // 验证所有必填字段
  const requiredFields = [
    { field: 'username', name: '账号' },
    { field: 'email', name: '邮箱' },
    { field: 'password', name: '密码' },
    { field: 'confirmPassword', name: '确认密码' },
    { field: 'phone', name: '手机号码' },
    { field: 'nickname', name: '昵称' },
    { field: 'realname', name: '姓名' },
    { field: 'contact', name: '联系方式' },
    { field: 'gender', name: '性别' },
    { field: 'birth', name: '出生年月' },
    { field: 'english_level', name: '英语水平' },
    { field: 'religion', name: '宗教信仰' },
    { field: 'experience', name: '教学经历' },
    { field: 'chinese_level', name: '中文教学证书' },
    { field: 'remark', name: '备注' }
  ];

  for (const { field, name } of requiredFields) {
    if (!formModel.value[field as keyof typeof formModel.value]) {
      await modal(`${name}为必填项`);
      loading.value = false;
      return;
    }
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
    const res = await signUpTeacher({
      name: formModel.value.realname,
      ...formModel.value,
    });
    if (res.data) {
      await modal("提交成功！");
    } else {
      await modal("提交失败！");
    }
  } catch (err: any) {
    await modal(`提交异常！${err.response?.data?.errors?.[0]?.message || err.message}`);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-item {
  @apply relative w-full my-4;
}

.required-star {
  @apply absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 font-bold text-lg z-10;
}

.input-item {
  @apply w-full bg-gray-100 rounded-full text-center text-base mb-1 py-3;
}

.textarea-container {
  @apply w-full relative;
}
</style>
