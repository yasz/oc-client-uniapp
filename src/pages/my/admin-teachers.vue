<template>
  <view class="student-selector">
    <view class="student-list">
      <view
        v-for="student in students"
        :key="student.id"
        class="student-item"
        :class="{ 'student-item--active': selectedId === student.id }"
        @click="handleStudentClick(student)"
      >
        <image
          class="student-avatar"
          mode="aspectFill"
          :src="student.avatarUrl"
        />
        <text class="student-name">{{ student.nickname }}</text>
        <view class="progress-info">
          <text class="progress-text"
            >已完成: {{ student.brick_completed_count || 0 }}幅</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { listAllStudents } from "@/utils/api";
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { onShow } from "@dcloudio/uni-app";

const authStore = useAuthStore();
const students = ref<any[]>([]);
const selectedId = ref<number>();

onShow(async () => {
  if (!authStore.roles.includes("admin")) {
    uni.showToast({ title: "无权限访问", icon: "none" });
    setTimeout(() => {
      uni.switchTab({ url: "/pages/my/index" });
    }, 1000);
    return;
  }

  try {
    const res: any = await listAllStudents();
    students.value = res.data.map((student: any) => ({
      ...student,
      avatarUrl:
        import.meta.env.VITE_BUCKET_ENDPOINT +
        (student.avatar?.[0]?.url || "https://via.placeholder.com/50"),
    }));
  } catch (error) {
    uni.showToast({
      title: "获取学生列表失败",
      icon: "none",
    });
  }
});

const handleStudentClick = (student: any) => {
  // 你的业务逻辑
};
</script>

<style lang="scss">
.student-selector {
  padding: 20rpx;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

  &--active {
    background-color: #fff5e6;
    border: 2rpx solid #f8ae3d;
  }
}

.student-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.student-name {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.progress-info {
  font-size: 24rpx;
  color: #666;
}

.progress-text {
  color: #f8ae3d;
}
</style>
