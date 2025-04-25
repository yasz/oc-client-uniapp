<template>
  <view class="bg-primary" style="height: calc(100vh - 44px)">
    <view class="pt-40">
      <view class="flex flex-center-row">
        <image
          src="/static/calendars/title1.png"
          style="width: 50vw"
          mode="widthFix"
        />
      </view>

      <view class="flex flex-center-row pt-20">
        <image
          :src="
            isAllCompleted
              ? '/static/calendars/title3.png'
              : '/static/calendars/title2.png'
          "
          :style="{ width: isAllCompleted ? '40vw' : '30vw' }"
          mode="widthFix"
        />
      </view>

      <view class="pt-20 px-20">
        <view class="calendar-container">
          <view class="calendar-header">
            <text class="student-name">{{ student?.nickname }}的日历</text>
          </view>
          <view class="calendar-grid">
            <view
              v-for="(day, index) in calendarDays"
              :key="index"
              class="calendar-day"
              :class="{ 'calendar-day--completed': day.completed }"
              @click="handleDayClick(day)"
            >
              <text class="day-number">{{ day.number }}</text>
              <text class="day-status">{{
                day.completed ? "已完成" : "未完成"
              }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import {
  updateStudentCalendarProgress,
  completeStudentCalendar,
} from "@/utils/api";
import { getAPIAxios } from "@/utils/common";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const student = ref<any>(null);
const calendarDays = ref<any[]>([]);
const completedCount = ref<number>(0);

// 检查是否所有天数都完成
const isAllCompleted = computed(() => {
  return calendarDays.value.every((day) => day.completed);
});

// 获取学生数据
const fetchStudentData = async (studentId: number) => {
  try {
    const response = await getAPIAxios(
      `students:get?filterByTk=${studentId}`,
      null
    );
    if (response && response.data) {
      student.value = response.data;
      // 初始化日历状态
      calendarDays.value =
        student.value.calendar_current_progress ||
        Array(31)
          .fill(false)
          .map((_, index) => ({
            number: index + 1,
            completed: false,
          }));
      completedCount.value = student.value.calendar_completed_count || 0;
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    uni.showToast({
      title: "获取学生数据失败",
      icon: "none",
    });
  }
};

// 处理日期点击
const handleDayClick = async (day: any) => {
  const studentName = student.value?.nickname || "XX";
  const studentAvatar = student.value?.avatar?.[0]?.url
    ? `${import.meta.env.VITE_BUCKET_ENDPOINT}${student.value.avatar[0].url}`
    : "https://via.placeholder.com/50";

  uni.showModal({
    title: "确认完成",
    content: `
      <view style="display: flex; align-items: center; justify-content: center; margin: 10px 0;">
        <image src="${studentAvatar}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;" />
        <text>是否确认${studentName}同学完成了第${day.number}天的任务？</text>
      </view>
    `,
    success: async (res) => {
      if (res.confirm) {
        try {
          // 更新本地状态
          day.completed = true;

          // 调用API更新进度
          await updateStudentCalendarProgress(
            student.value.id,
            calendarDays.value.map((day) => day.completed)
          );

          // 检查是否完成所有天数
          if (isAllCompleted.value) {
            uni.showModal({
              title: "恭喜",
              content: "已完成所有天数，是否提交？",
              success: async (res) => {
                if (res.confirm) {
                  await submit();
                }
              },
            });
          }
        } catch (error) {
          console.error("Error updating progress:", error);
          day.completed = false; // 还原状态
          uni.showToast({
            title: "更新进度失败",
            icon: "none",
          });
        }
      }
    },
  });
};

// 提交完成的日历
const submit = async () => {
  if (!isAllCompleted.value) {
    uni.showToast({
      title: "请先完成所有天数",
      icon: "none",
    });
    return;
  }

  try {
    const newCompletedCount = completedCount.value + 1;
    await completeStudentCalendar(student.value.id, newCompletedCount);

    completedCount.value = newCompletedCount;
    calendarDays.value = calendarDays.value.map((day) => ({
      ...day,
      completed: false,
    }));

    uni.showToast({
      title: "提交成功",
      icon: "success",
    });
  } catch (error) {
    console.error("Error submitting calendar:", error);
    uni.showToast({
      title: "提交失败",
      icon: "none",
    });
  }
};

onLoad((options: any) => {
  if (options.studentId) {
    fetchStudentData(parseInt(options.studentId));
  }
});
</script>

<style lang="scss" scoped>
.calendar-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  margin-bottom: 20px;
  text-align: center;
}

.student-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 5px;
  padding: 10px;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  &--completed {
    background-color: #e6f7ff;
    border: 1px solid #1890ff;
  }
}

.day-number {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.day-status {
  font-size: 12px;
  color: #666;
}
</style>
