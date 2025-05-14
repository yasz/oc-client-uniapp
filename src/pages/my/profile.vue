<template>
  <view class="flex-col bg-primary">
    <view class="py-10 f-c-c" @click="handleAvatarClick">
      <u-avatar
        :src="useAuthStore().avatar || 'avatars/wechat/defaultAvatar.png'"
        size="120rpx"
        shape="circle"
        mode="aspectFill"
      />
    </view>
    <view>
      <view class="px-10">
        <HippoCard />
      </view>
    </view>
  </view>

  <view class="">
    <view class="menu-section">
      <MenuItem
        :label="t('nickname')"
        :value="userInfo.nickname"
        @click="handleNameClick"
        :height="60"
      />
      <!-- <MenuItem
        :label="t('gender')"
        :value="userInfo.gender === 'male' ? '男' : '女'"
        @click="handleGenderClick"
        :height="60"
      /> -->
      <MenuItem
        :label="t('phone')"
        :value="userInfo.phone"
        @click="handlePhoneClick"
        :height="60"
      />
      <!-- <MenuItem
        label="微信"
        value="已绑定"
        :valueColor="'#52c41a'"
        :arrow="false"
      /> -->
      <MenuItem
        :label="t('email')"
        :value="userInfo.email"
        :arrow="false"
        :height="60"
      />
    </view>

    <view
      class="menu-section"
      style="
        height: 60rpx;
        align-items: center;
        border-bottom: 2rpx solid #f5f5f5;
        display: flex;
      "
    >
      <view
        class="flex px-20 justify-between"
        style="width: 100%; align-items: center"
      >
        <view class="">
          <u-image src="/static/translate.png" width="36rpx" height="36rpx" />
        </view>
        <view class="">
          <LangSwitch />
        </view>
      </view>
    </view>

    <MenuItem
      :label="t('logout')"
      :arrow="false"
      valueColor="#ff4d4f"
      @click="handleLogout"
      :height="60"
    />
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
import { onLoad } from "@dcloudio/uni-app";
const authStore = useAuthStore();
const userInfo = ref({
  nickname: "",
  gender: "female",
  phone: "",
  email: "",
});

const SPECIAL_TOKEN = import.meta.env.VITE_SPECIAL_TOKEN;
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const BUCKET_ENDPOINT = import.meta.env.VITE_BUCKET_ENDPOINT;

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = (
      await getUserInfoWithSpecialToken(Number(authStore.userId))
    ).data;

    if (response?.data) {
      userInfo.value = {
        nickname: response.data.nickname || "",
        gender: response.data.gender || "female",
        phone: response.data.phone || "",
        email: response.data.email || "",
      };
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};
onLoad(() => {
  fetchUserInfo();
});

const handleAvatarClick = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      try {
        const tempFilePath = res.tempFilePaths[0];
        // 1. 上传图片到服务器（special token）
        await new Promise((resolve, reject) => {
          uni.uploadFile({
            url: `${API_ENDPOINT}/attachments:create?attachmentField=users.avatar`,
            filePath: tempFilePath,
            name: "file",
            header: {
              Authorization: `Bearer ${SPECIAL_TOKEN}`,
            },
            success: async (uploadRes) => {
              let uploadData = {};
              try {
                uploadData = JSON.parse(uploadRes.data);
              } catch (e) {
                return reject("上传返回数据解析失败");
              }
              if (!uploadData?.data?.id) return reject("上传失败");
              // 2. 获取当前用户信息
              const userRes = await getUserInfoWithSpecialToken(
                Number(authStore.userId)
              );
              const userData = userRes.data.data;
              // 3. 更新用户信息，avatar 字段用新上传的附件对象
              userData.avatar = uploadData.data;
              // 4. 更新用户（以教师为例）
              await fetch(
                `${API_ENDPOINT}/teachers:update?filterByTk=${authStore.userId}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${SPECIAL_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(userData),
                }
              );
              // 5. 刷新本地头像
              authStore.avatar = BUCKET_ENDPOINT + uploadData.data.url;
              uni.showToast({ title: "头像更新成功", icon: "success" });
              resolve();
            },
            fail: (err) => {
              uni.showToast({ title: "上传头像失败", icon: "error" });
              reject(err);
            },
          });
        });
      } catch (error) {
        console.error("上传头像失败:", error);
        uni.showToast({ title: "上传头像失败", icon: "error" });
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

.profile-avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 48rpx;
  margin-bottom: 32rpx;
}
.avatar-list {
  display: flex;
  margin-top: 16rpx;
}
.avatar-empty {
  color: #bbb;
  font-size: 24rpx;
  margin-top: 16rpx;
}
</style>
