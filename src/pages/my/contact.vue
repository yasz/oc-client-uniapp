<template>
  <div class="px-20 py-20">
    <div class="text-gray-400 text-sm mb-2">官方账号</div>
    <div class="space-y-3">
      <div class="flex items-center bg-white rounded-xl shadow p-4" @click="openRedBook()">
        <div class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 mr-3">
          <img src="/static/my/contact/redbook.png" class="w-7 h-7 object-contain" />
        </div>
        <div class="flex-1">
          <div class="text-base text-gray-900 font-medium">乐凡中文</div>
          <div class="text-xs text-gray-400">官方小红书</div>
        </div>
        <div class="text-xs text-gray-400">&gt;</div>
      </div>
    </div>

    <div class="text-gray-400 text-sm mt-6 mb-2 pt-20">邮箱</div>

    <!-- 邮箱1 -->
    <div class="flex items-center bg-white rounded-xl shadow p-4 cursor-pointer"
      @click="copyEmail('info@lifefunchinese.cc')">
      <div class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 mr-3">
        <img src="/static/my/contact/mail.png" class="w-6 h-6 object-contain" />
      </div>
      <div class="flex-1">
        <div class="text-base text-gray-900 font-medium">
          info@lifefunchinese.cc
        </div>
        <div class="text-xs text-gray-400">平台技术问题</div>
      </div>
      <div class="text-xs text-gray-400">&gt;</div>
    </div>

    <!-- 邮箱2 -->
    <div class="flex items-center bg-white rounded-xl shadow p-4 cursor-pointer"
      @click="copyEmail('mayile@lifefunchinese.cc')">
      <div class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 mr-3">
        <img src="/static/my/contact/mail.png" class="w-6 h-6 object-contain" />
      </div>
      <div class="flex-1">
        <div class="text-base text-gray-900 font-medium">mayile@lifefunchinese.cc</div>
        <div class="text-xs text-gray-400">中文学习问题</div>
      </div>
      <div class="text-xs text-gray-400">&gt;</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { go } from "@/utils/common";

function copyEmail(email: string): void {
  uni.setClipboardData({
    data: email,
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "success",
      });
    },
    fail: (err) => {
      console.error("复制失败：", err);
      uni.showToast({
        title: "复制失败",
        icon: "none",
      });
    },
  });
}

const goToWebView = (url: string) => {
  if (url) {
    go(`/webview/index?url=${encodeURIComponent(url)}`);
  }
};

const openRedBook = () => {
  // #ifdef H5
  window.open('https://www.xiaohongshu.com/user/profile/593b7c9e33594a286da325ec', '_blank');
  // #endif

  // #ifdef APP-PLUS
  plus.runtime.openURL('https://www.xiaohongshu.com/user/profile/593b7c9e33594a286da325ec');
  // #endif

  // #ifdef MP
  uni.navigateTo({
    url: `/webview/index?url=${encodeURIComponent('https://www.xiaohongshu.com/user/profile/593b7c9e33594a286da325ec')}`
  });
  // #endif
};
</script>
