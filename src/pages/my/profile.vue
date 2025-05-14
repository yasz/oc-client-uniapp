<template>
  <view class="">
    <view>
      <view class="">
        <HippoCard />
      </view>
    </view>
    <view class="menu-section">
      <MenuItem
        :label="t('nickname')"
        :value="userInfo.nickname"
        @click="handleNameClick"
      />
      <MenuItem
        :label="t('gender')"
        :value="userInfo.gender === 'male' ? '男' : '女'"
        @click="handleGenderClick"
      />
      <MenuItem
        :label="t('phone')"
        :value="userInfo.phone"
        @click="handlePhoneClick"
      />
      <!-- <MenuItem
        label="微信"
        value="已绑定"
        :valueColor="'#52c41a'"
        :arrow="false"
      /> -->
      <MenuItem
        :label="t('email')"
        value="已绑定"
        :valueColor="'#52c41a'"
        :arrow="false"
      />
    </view>

    <!-- 设置 -->

    <!-- 退出登录 -->
    <view class="">
      <MenuItem
        :label="t('logout')"
        :arrow="false"
        valueColor="#ff4d4f"
        @click="handleLogout"
      />
    </view>
    <view class="menu-section">
      <view class="flex px-20">
        <view class="mr-20">
          <u-image src="/static/translate.png" width="36rpx" height="36rpx" />
        </view>
        <LangSwitch />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { ref, onMounted } from "vue";
import LangSwitch from "@/components/langSwitch.vue";
import MenuItem from "@/components/MenuItem.vue";
import { useAuthStore } from "@/stores/authStore";
import { go } from "@/utils/common";
import { getUserInfoWithSpecialToken } from "@/utils/api";
import { uploadFile } from "@/utils/common";
import HippoCard from "@/components/HippoCard.vue";
const authStore = useAuthStore();
const userInfo = ref({
  nickname: "",
  gender: "female",
  phone: "",
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await getUserInfoWithSpecialToken(
      Number(authStore.userId)
    );
    if (response?.data) {
      userInfo.value = {
        nickname: response.data.nickname || "",
        gender: response.data.gender || "female",
        phone: response.data.phone || "",
      };
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

onMounted(() => {
  fetchUserInfo();
});

const handleAvatarClick = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      try {
        const tempFilePath = res.tempFilePaths[0];
        const uploadRes = await uploadFile({
          url: "attachments:upload",
          file: {
            url: tempFilePath,
            name: "avatar.jpg",
          },
        });

        if (uploadRes?.data?.url) {
          const avatarUrl =
            import.meta.env.VITE_BUCKET_ENDPOINT + uploadRes.data.url;
          authStore.avatar = avatarUrl;
          uni.showToast({
            title: "头像更新成功",
            icon: "success",
          });
        }
      } catch (error) {
        console.error("上传头像失败:", error);
        uni.showToast({
          title: "上传头像失败",
          icon: "error",
        });
      }
    },
  });
};

const handleNameClick = () => {
  uni.showModal({
    title: "修改名字",
    editable: true,
    content: userInfo.value.nickname,
    success: (res) => {
      if (res.confirm && res.content) {
        userInfo.value.nickname = res.content;
        // TODO: 调用API更新昵称
      }
    },
  });
};

const handleGenderClick = () => {
  uni.showActionSheet({
    itemList: ["男", "女"],
    success: (res) => {
      userInfo.value.gender = res.tapIndex === 0 ? "male" : "female";
      // TODO: 调用API更新性别
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
        authStore.signOut();
        go("/sign-in");
      }
    },
  });
};
</script>

<style lang="scss">
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
