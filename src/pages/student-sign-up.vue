<template>
  <div class="min-h-screen flex flex-col items-center bg-gradient-to-t">
    <div class="text-center pt-40">
      <div class="text-[1.05rem] text-gray-500 tracking-wider leading-tight leading-loose">
        欢迎来到Lifefunner 乐凡中文！<br />
        Lifefunner使中文学习更有效、更轻松。
      </div>
      <div class="text-base text-gray-500 tracking-wider mb-2 mt-10">
        Welcome to Lifefunner!<br />
        Lifefunner helps Chinese learning <br />happy and easy.
      </div>
    </div>
    <view class="w-[80%] flex flex-col gap-4">
      <form @submit="submitForm">
        <input v-if="!isReregisterMode" class="input-item" v-model="formModel.username" placeholder="账号(必填)" required
          placeholder-style="color: #d1d5db;" />
        <input class="input-item" v-model="formModel.nickname" placeholder="昵称(必填)" required
          placeholder-style="color: #d1d5db;" />
        <input v-if="!isReregisterMode" class="input-item" v-model="formModel.email" placeholder="邮箱(必填)" required
          type="email" placeholder-style="color: #d1d5db;" />
        <input v-if="!isReregisterMode" class="input-item" v-model="formModel.phone" placeholder="手机号码(必填)" required
          placeholder-style="color: #d1d5db;" />
        <input v-if="!isReregisterMode" class="input-item" v-model="formModel.password" type="password"
          placeholder="请输入密码(必填)" required placeholder-style="color: #d1d5db;" />
        <input v-if="!isReregisterMode" class="input-item" v-model="formModel.confirmPassword" type="password"
          placeholder="请再次输入密码(必填)" required placeholder-style="color: #d1d5db;" />

        <picker mode="selector" :range="genderOptions" :value="genderIndex" @change="onGenderChange">
          <input class="input-item" readonly :value="formModel.gender" placeholder="性 别"
            placeholder-style="color: #d1d5db;" />
        </picker>
        <picker mode="date" :value="formModel.birth" @change="onBirthChange">
          <input class="input-item" readonly :value="formModel.birth" placeholder="请选择出生年月(必填)"
            placeholder-style="color: #d1d5db;" />
        </picker>
        <input class="input-item" v-model="formModel.nationality" placeholder="国籍" required
          placeholder-style="color: #d1d5db;" />
        <input class="input-item" v-model="formModel.residence" placeholder="常居地" required
          placeholder-style="color: #d1d5db;" />
        <input class="input-item" v-model="formModel.chinese_level" placeholder="现在中文水平" required
          placeholder-style="color: #d1d5db;" />
        <picker class="input-item" mode="selector" :range="courseOptions" @change="handleCourseChange"
          :value="courseIndex">
          <input readonly :value="formModel.desired_courses" placeholder="想要学的课程(必填)"
            placeholder-style="color: #d1d5db;" />
        </picker>
        <input class="input-item" v-model="formModel.teacher_requirements" placeholder="对授课老师的要求" required
          placeholder-style="color: #d1d5db;" />
        <button form-type="submit" @click="submitForm"
          class="w-full py-8 my-20 rounded-full text-white font-bold text-base"
          style="background: linear-gradient(90deg, #f9b33b 0%, #f59743 100%)" :disabled="loading">
          {{ isReregisterMode ? '完善信息' : '申请直播课' }}
        </button>
      </form>
    </view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { signUpStudent, updateStudent } from "@/utils/api";
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

const formModel = ref({
  username: "",
  nickname: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  gender: "",
  birth: "",
  nationality: "",
  residence: "",
  chinese_level: "",
  desired_courses: "",
  teacher_requirements: "",
});

const genderOptions = ["男", "女"];
// const religionOptions = ["无", "佛教", "基督教", "伊斯兰教", "其他"];
// const englishLevelOptions = ["CET4以下", "CET4", "CET6", "CET6以上"];

const genderIndex = ref(-1);
const desiredCoursesIndex = ref(-1);
const courseOptions = ["部编版小学语文", "YCT", "HCK"];
const courseIndex = ref(0);

const onGenderChange = (e: any) => {
  genderIndex.value = e.detail.value;
  formModel.value.gender = genderOptions[genderIndex.value];
};

const onBirthChange = (e: any) => {
  formModel.value.birth = e.detail.value;
};

const handleCourseChange = (e: any) => {
  desiredCoursesIndex.value = e.detail.value;
  formModel.value.desired_courses = courseOptions[desiredCoursesIndex.value];
};

function validateEmail(email: string) {
  return /^[\w-\.]+@[\w-]+(\.[\w-]+)+$/.test(email);
}

const submitForm = async () => {
  if (loading.value) return;
  loading.value = true;

  // 重新注册模式下的验证逻辑
  if (isReregisterMode.value) {
    if (!formModel.value.nickname) {
      await modal("昵称为必填项");
      loading.value = false;
      return;
    }

    try {
      // 在二次注册模式下，只提交必要的字段，排除username、email、password、confirmPassword、phone
      const { username, email, password, confirmPassword, phone, ...updateData } = formModel.value;
      const res = await updateStudent(Number(authStore.userId), {
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
  if (
    !formModel.value.username ||
    !formModel.value.email ||
    !formModel.value.password ||
    !formModel.value.confirmPassword
  ) {
    await modal("账号、邮箱、密码、确认密码为必填项");
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
    const res = await signUpStudent({
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
.input-item {
  @apply w-full bg-gray-100 rounded-full text-center text-base mb-1 px-0 py-4 my-4;
}
</style>
