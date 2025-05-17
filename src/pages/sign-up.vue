<template>
  <view>
    <view class="fixed inset-0 bg-gradient-yellow z--3"></view>
    <view class="flex-col pt-[20%] items-center z--2">
      <img class="w-40" src="@/static/index/signup/logo.png" alt="logo" />
      <view class="flex-col t-40 items-center tracking-widest pt-60">
        <text class="text-[#754D39] bold font-black"> WELCOME TO</text>
        <text class="text-[#754D39] bold font-black pt-10"> LIFEFUNNER</text>
      </view>
      <div class="flex justify-center gap-8 my-8 pt-20">
        <button
          @click="go('/teacher-sign-up')"
          type="button"
          class="w-[40vw] h-16 rounded-full shadow-lg bg-gradient-to-b from-white to-[#f7f3ed] flex items-center justify-center text-xl font-bold text-[#7a4d13] tracking-widest"
        >
          我是老师
        </button>
        <button
          type="button"
          class="w-[40vw] h-16 rounded-full shadow-lg bg-gradient-to-b from-white to-[#f7f3ed] flex items-center justify-center text-xl font-bold text-[#7a4d13] tracking-widest"
        >
          我是学生
        </button>
      </div>
      <img
        class="w-60 pt-[20%]"
        src="@/static/index/signup/hippo.png"
        alt="logo"
      />
    </view>
  </view>
</template>
<script setup lang="ts">
import { go } from "@/utils/common";
</script>
