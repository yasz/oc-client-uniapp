<template>
  <view class="container">
    <uni-card :is-shadow="true">
      <u-form class="bg-white" :rules="rules" :model="formModel" placeholder errorType="border-bottom" ref="formRef">

        <!-- Username Field -->
        <u-form-item prop="username" borderBottom labelWidth="90" :label="$t('username')">
          <u-input border="none" :placeholder="$t('please input ') + $t('username')"
            v-model="formModel.username"></u-input>
        </u-form-item>

        <!-- Password Field -->
        <u-form-item prop="password" borderBottom labelWidth="90" :label="$t('password')">
          <u-input type="password" border="none" :placeholder="$t('please input ') + $t('password')"
            v-model="formModel.password"></u-input>
        </u-form-item>

        <!-- Confirm Password Field -->
        <u-form-item prop="confirmPassword" borderBottom labelWidth="90" :label="$t('confirm password')">
          <u-input type="password" border="none" :placeholder="$t('please input ') + $t('confirm password')"
            v-model="formModel.confirmPassword"></u-input>
        </u-form-item>

        <!-- Email Field -->
        <u-form-item prop="email" borderBottom labelWidth="90" :label="$t('email')">
          <u-input border="none" :placeholder="$t('please input ') + $t('email')" v-model="formModel.email"></u-input>
        </u-form-item>

      </u-form>
      <view class="flex">
        <u-button @click="submitForm">
          {{ $t('sign up') }}
        </u-button>
      </view>
    </uni-card>
    <!-- Move Don’t miss out text -->
    <text class="slanted-text">Don’t miss out.</text>
  </view>
</template>

<script lang="ts" setup>
import { back, toast } from '@/utils/common';
import { computed, reactive, ref } from 'vue';

// Register form reactive data
const formModel = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
});
const formRef: any = ref();
// Submit form method
const submitForm = async () => {
  // Check if confirm password matches
  if (formModel.password !== formModel.confirmPassword) {
    uni.showToast({
      title: 'Passwords do not match',
      icon: 'none',
    });
    return;
  }
  console.log("【调试】:【", formModel, "】");
  try {
    await formRef.value.validate();

    // toast(t("success"));
    back();
  } catch (e: any) {
    toast(e[0].message);
    return;
  }
  // Assume registration is successful
  // 系统判断用户是否注册

  uni.showToast({
    title: 'Registration Successful',
    icon: 'success',
  });

  // Here, network request logic can be added
};

// Validation rules
const rules = computed(() => {
  return {
    username: {
      required: true,
      message: `username is required`,
      trigger: "blur",
    },
    password: {
      required: true,
      message: `password is required`,
      trigger: "blur",
      min: 6,
      pattern: /^[a-zA-Z0-9]*$/, // No special characters
    },
    confirmPassword: {
      required: true,
      message: `confirm password is required`,
      trigger: "blur",
    },
    email: {
      required: true,
      message: `email is required`,
      trigger: "blur",
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email format validation
    },
  };
});
</script>

<style>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top, #F15929 200px, #F9B23C);
  position: relative;
}

.container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: url('/static/images/title.jpg') no-repeat bottom center;
  background-size: cover;
}

/* Move Don’t miss out to the right-top corner */
.slanted-text {
  transform: rotate(-10deg);
  color: #895408;
  font-weight: bold;
  position: absolute;
  top: 35%;
  right: 20px;
  font-size: 1.5rem;
  z-index: 2;
}
</style>
