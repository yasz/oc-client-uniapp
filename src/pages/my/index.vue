<template>
  <view>
    <!-- 头部区域 -->
    <view class="bg-primary px-5 pt-5 rounded-b-[40rpx]">
      <view class="flex justify-end">
        <image src=" /static/my/setting.png" mode="aspectFit" class="pl-8 pt-2 w-[70rpx] h-[70rpx]"
          @click="go('/my/profile')" />
      </view>
      <view class="flex justify-between items-start mb-8">
        <view class="flex items-center gap-5">
          <u-avatar :src="useAuthStore().avatar || 'avatars/wechat/defaultAvatar.png'" size="140rpx" shape="circle"
            mode="aspectFill"></u-avatar>
          <view class="text-white">
            <view class="text-[36rpx] font-bold mb-2">{{
              useAuthStore().token ? useAuthStore().nickname || "新用户" : "新用户"
              }}</view>
            <view class="text-[24rpx] opacity-90" v-if="day !== null">加入Lifefunner的第{{ day }}天</view>
          </view>
        </view>
        <view></view>
      </view>
      <HippoCard />
    </view>

    <!-- 菜单按钮区域 -->
    <view class="m-[20rpx] bg-white rounded-[24rpx] shadow">
      <view v-for="(i, idx) in getVisibleMenuItems()" :key="i" class="flex items-center py-[20rpx] px-[24rpx]" :style="idx !== getVisibleMenuItems().length - 1
        ? 'border-bottom: 1px solid #f0f0f0;'
        : ''
        " @click="handleMenuClick(i)">
        <view class="w-[64rpx] h-[64rpx] rounded-full flex justify-center items-center mr-[16rpx]"
          :style="'border: 3rpx solid #fce157;'">
          <image :src="getMenuIcon(i)" mode="aspectFit" class="w-[36rpx] h-[36rpx]" />
        </view>
        <text class="flex-1 text-[28rpx] text-[#333]">{{
          getMenuText(i)
          }}</text>
        <view class="flex items-center gap-[8rpx] text-[#bbbbbb] text-[22rpx]">
          <template v-if="i === 2">
            <view v-if="unreadCount > 0" class="w-[16rpx] h-[16rpx] bg-red-500 rounded-full"></view>
            <text>新消息查看</text>
          </template>
          <template v-else>
            <text>
              <span v-if="i === 1">查看收藏课程</span>
              <span v-else-if="i === 3">去联系</span>
              <span v-else>去查看</span>
            </text>
          </template>
          <text class="pl-[6rpx]">＞</text>
        </view>
      </view>
    </view>

    <Layout />
  </view>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { go } from "@/utils/common";
import Layout from "../layout.vue";
import { onLoad } from "@dcloudio/uni-app";
import { ref, onMounted, watch } from "vue";
import { listStudentsByTeacherId, listMessages } from "@/utils/api";
import HippoCard from "@/components/HippoCard.vue";
import dayjs from "dayjs";

interface Student {
  id: number;
  nickname: string;
  avatar: Array<{ url: string }>;
}

interface ApiResponse<T> {
  data: T;
}

type MenuIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
const hasStudents = ref(false);
const day = ref<number | null>(null);
const authStore = useAuthStore();
const unreadCount = ref(0);

const calculateDays = () => {
  if (authStore.createdAt) {
    const startDate = dayjs(authStore.createdAt);
    const endDate = dayjs();
    day.value = endDate.diff(startDate, "day");
  }
};

// 获取未读消息数量
const fetchUnreadCount = async () => {
  try {
    const response: any = await listMessages(authStore.userId);
    if (response?.data) {
      unreadCount.value = response.data.filter(
        (msg: any) => !msg.status
      ).length;
    }
  } catch (error) {
    console.error("获取未读消息数量失败:", error);
  }
};

onMounted(() => {
  calculateDays();
});

// Use onShow from uni-app
import { onShow } from "@dcloudio/uni-app";
onShow(() => {
  fetchUnreadCount();
});

watch(
  () => authStore.createdAt,
  () => {
    calculateDays();
  }
);

onLoad(async () => {
  if (authStore.userId) {
    // 如果是教师，检查是否有学生
    if (authStore.roles.includes("teacher")) {
      try {
        const res = (await listStudentsByTeacherId(
          authStore.userId
        )) as ApiResponse<Student[]>;
        hasStudents.value = Array.isArray(res?.data) && res.data.length > 0;
      } catch (error) {
        console.error("获取学生列表失败:", error);
      }
    }
  }
});

const menuTexts: Record<MenuIndex, string> = {
  1: "我的收藏",
  2: "系统提醒",
  3: "联系我们",
  4: "教学日程",
  5: "学生作业",
  6: "学生拼图账户",
  7: "我的日程",
  8: "我的作业",
  9: "我的拼图账户",
  10: "关联教师",
  11: "分配课程",
};

const menuRoutes: Record<MenuIndex, string> = {
  1: "/my/favorites",
  2: "/my/messages",
  3: "/my/contact",
  4: "/my/calendar-list",
  5: "/my/assignment-list",
  6: "/my/puzzle-list",
  7: `/my/calendar-list`,
  8: "/my/assignment-list",
  9: "/my/puzzle-list",
  10: "/my/admin-teachers",
  11: "/my/admin-courses",
};

const getMenuText = (index: number): string => {
  return menuTexts[index as MenuIndex] || "";
};

const getMenuIcon = (index: number): string => {
  // 管理员菜单项使用系统提醒的图标
  if (index === 10 || index === 11) {
    return "/static/my/i2.png";
  }
  return `/static/my/i${index}.png`;
};

const getVisibleMenuItems = () => {
  const isTeacher = authStore.roles.includes("teacher");
  const isAdmin = authStore.roles.includes("admin");

  // 基础菜单项（所有用户都可见）
  const baseItems = [1, 2, 3];

  // 如果是管理员，添加管理员专属菜单
  if (isAdmin) {
    return [...baseItems, 4, 6, 10, 11];
  }

  // 如果是教师且有学生，添加教师专属菜单
  if (isTeacher && hasStudents.value) {
    return [...baseItems, 4, 6];
  } else if (!isTeacher) {
    // #ifdef H5
    const systemInfo = uni.getSystemInfoSync();
    const isPC = !["ios", "android"].includes(systemInfo.platform);
    if (isPC && systemInfo.windowWidth > 500) {
      return [...baseItems, 7]; // PC端宽屏，隐藏我的拼图账户
    }
    // #endif
    return [...baseItems, 7, 9];
  }

  return baseItems;
};

const handleMenuClick = (index: number) => {
  const route = menuRoutes[index as MenuIndex];
  if (route) {
    go(route);
  }
};
</script>
