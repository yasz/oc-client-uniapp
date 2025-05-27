<template>
  <div class="px-20 py-20">
    <div class="text-gray-400 text-sm mb-2">官方账号</div>
    <div class="space-y-3">
      <div class="flex items-center bg-white rounded-xl shadow p-4">
        <div
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 mr-3"
        >
          <img
            src="/src/static/my/contact/redbook.png"
            class="w-7 h-7 object-contain"
          />
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
    <div
      class="flex items-center bg-white rounded-xl shadow p-4 cursor-pointer"
      @click="copyEmail('yangjiahao@outlook.com')"
    >
      <div
        class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 mr-3"
      >
        <img
          src="/src/static/my/contact/mail.png"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="flex-1">
        <div class="text-base text-gray-900 font-medium">
          yangjiahao@outlook.com
        </div>
        <div class="text-xs text-gray-400">技术问题</div>
      </div>
      <div class="text-xs text-gray-400">&gt;</div>
    </div>

    <!-- 邮箱2 -->
    <div
      class="flex items-center bg-white rounded-xl shadow p-4 cursor-pointer"
      @click="copyEmail('may4@tcd.ie')"
    >
      <div
        class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 mr-3"
      >
        <img
          src="/src/static/my/contact/mail.png"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="flex-1">
        <div class="text-base text-gray-900 font-medium">may4@tcd.ie</div>
        <div class="text-xs text-gray-400">中文学习问题</div>
      </div>
      <div class="text-xs text-gray-400">&gt;</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
</script>
