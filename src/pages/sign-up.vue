<template>
  <view class="container">
    <uni-card :is-shadow="true" class="register-card">
      <view class="register-content">
        <view class="form-group">
          <uni-input v-model="username" type="text" placeholder="请输入用户名" class="form-input" />
        </view>
        <view class="form-group">
          <uni-input v-model="password" type="password" placeholder="请输入密码" class="form-input" />
        </view>
        <button class="submit-button" @click="submitForm">注册</button>
      </view>
    </uni-card>
    <!-- 把 Don’t miss out 文本移到卡片外面并调整位置 -->
    <text class="slanted-text">Don’t miss out.</text>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 注册表单的响应式数据
const username = ref<string>('');
const password = ref<string>('');

// 提交注册表单的方法
const submitForm = () => {
  if (!username.value || !password.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none',
    });
    return;
  }
  // 假设注册成功
  uni.showToast({
    title: '注册成功',
    icon: 'success',
  });
  // 在此处可以添加网络请求等逻辑
};
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

.register-card {
  width: 90%;
  max-width: 400px;
  padding: 20px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 10px;
  position: relative;
  z-index: 1;
}

.register-content {
  text-align: center;
  margin-top: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #f15929;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

/* 将 Don’t miss out 移到卡片外的右上角 */
.slanted-text {
  transform: rotate(-10deg);
  color: #895408;
  font-weight: bold;
  position: absolute;
  top: 20px;
  /* 距离上方一定距离 */
  right: 20px;
  /* 距离右边一定距离 */
  font-size: 1.5rem;
  z-index: 2;
  /* 保证它在背景上方 */
}
</style>
