<template>
  <view class="student-selector">
    <view class="student-list">
      <!-- {{ authStore }} -->
      <view
        v-for="student in students"
        :key="student.id"
        class="student-item"
        :class="{ 'student-item--active': selectedId === student.id }"
        @click="selectStudent(student)"
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
import { listStudentsByTeacherId } from "@/utils/api";
import { onMounted, ref } from "vue";

import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const students = ref<any[]>([]);
onMounted(async () => {
  // 如果是学生，直接跳转到拼图页面

  if (authStore.role.indexOf("teacher") == -1) {
    uni.redirectTo({
      url: "/my/student-puzzle-account",
    });
    return;
  }

  // 如果是教师，获取学生列表
  try {
    const res: any = await listStudentsByTeacherId(authStore.userId);
    console.log(res);
    // 处理每个学生的头像URL
    students.value = res.data.map((student: any) => ({
      ...student,
      avatarUrl:
        import.meta.env.VITE_BUCKET_ENDPOINT +
        (student.avatar[0]?.url || "https://via.placeholder.com/50"),
    }));
  } catch (error) {
    console.error("Failed to fetch students:", error);
    uni.showToast({
      title: "获取学生列表失败",
      icon: "none",
    });
  }
});
const emit = defineEmits(["select"]);
const selectedId = ref<number>();

const selectStudent = (student: any) => {
  selectedId.value = student.id;
  // 将需要的数据编码为URL参数
  const params = {
    studentId: student.id,
    nickname: student.nickname,
    progress: JSON.stringify(
      student.brick_current_progress || Array(9).fill(false)
    ),
    completedCount: student.brick_completed_count || 0,
  };

  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  uni.navigateTo({
    url: `/my/student-puzzle-account?${query}`,
  });
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
