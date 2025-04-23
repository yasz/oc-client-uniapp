<template>
  <view class="profile-page">
    <!-- 顶部卡片 -->
    <view class="hippo-card flex" style="height: 200rpx">
      <image
        src="/static/my/logo.png"
        mode="aspectFit"
        class="pl-30 pt-6"
        style="width: 200rpx; height: 200rpx"
      />
      <image
        src="/static/my/title.png"
        mode="aspectFit"
        class="pt-40"
        style="width: 200rpx; height: 100rpx"
      />
      <image
        src="/static/my/logo_puzzle.png"
        mode="aspectFit"
        style="width: 120rpx; height: 120rpx"
        class="pl-30 pt-40"
      />
    </view>

    <!-- 基本信息 -->
    <view class="menu-section">
      <MenuItem label="名字" :value="userInfo.name" @click="handleNameClick" />
      <MenuItem
        label="性别"
        :value="userInfo.gender === 'female' ? '女' : '男'"
        @click="handleGenderClick"
      />
      <MenuItem
        label="手机"
        :value="userInfo.phone"
        @click="handlePhoneClick"
      />
      <MenuItem
        label="微信"
        value="已绑定"
        :valueColor="'#52c41a'"
        :arrow="false"
      />
      <MenuItem
        label="邮箱"
        value="已绑定"
        :valueColor="'#52c41a'"
        :arrow="false"
      />
    </view>

    <!-- 设置 -->
    <view class="menu-section">
      <view class="flex-col px-20">
        <view
          class="flex py-10 baseline fixed-height"
          style="align-items: center"
        >
          <view class="mr-20">
            <u-image src="/static/translate.png" width="36rpx" height="36rpx" />
          </view>

          <LangSwitch />
        </view>
      </view>
      <!-- <MenuItem label="通知设置" @click="handleNotificationClick" />
            <MenuItem label="隐私设置" @click="handlePrivacyClick" />
            <MenuItem label="关于我们" @click="handleAboutClick" /> -->
    </view>

    <!-- 退出登录 -->
    <view class="menu-section">
      <MenuItem
        label="退出登录"
        :arrow="false"
        valueColor="#ff4d4f"
        @click="handleLogout"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LangSwitch from "@/components/langSwitch.vue";
import MenuItem from "@/components/MenuItem.vue";
import { useAuthStore } from "@/stores/authStore";
import { go, go2 } from "@/utils/common";

const userInfo = ref({
  name: "MARY",
  gender: "female",
  phone: "18888888888",
});

const handleNameClick = () => {
  uni.showModal({
    title: "修改名字",
    editable: true,
    content: userInfo.value.name,
    success: (res) => {
      if (res.confirm && res.content) {
        userInfo.value.name = res.content;
      }
    },
  });
};

const handleGenderClick = () => {
  uni.showActionSheet({
    itemList: ["男", "女"],
    success: (res) => {
      userInfo.value.gender = res.tapIndex === 0 ? "male" : "female";
    },
  });
};

const handlePhoneClick = () => {
  uni.showToast({
    title: "暂不支持修改手机号",
    icon: "none",
  });
};

const handleNotificationClick = () => {
  uni.navigateTo({
    url: "/pages/settings/notification",
  });
};

const handlePrivacyClick = () => {
  uni.navigateTo({
    url: "/pages/settings/privacy",
  });
};

const handleAboutClick = () => {
  uni.navigateTo({
    url: "/pages/settings/about",
  });
};

const handleLogout = () => {
  uni.showModal({
    title: "确认退出",
    content: "是否确认退出登录？",
    success: (res) => {
      if (res.confirm) {
        // TODO: 执行退出登录逻辑
        useAuthStore().signOut();
        go("/sign-in");
      }
    },
  });
};
</script>

<style lang="scss">
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 32rpx;
}

.menu-section {
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.hippo-card {
  background-color: #fff;
  margin-bottom: 20rpx;
}
</style>
