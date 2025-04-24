<template>
  <view class="bg-primary" style="height: calc(100vh - 44px)">
    <view class="pt-40">
      <view class="flex flex-center-row">
        <image
          src="/static/puzzles/title1.png"
          style="width: 50vw"
          mode="widthFix"
        />
      </view>

      <view class="flex flex-center-row pt-20">
        <image
          :src="
            isAllCompleted
              ? '/static/puzzles/title3.png'
              : '/static/puzzles/title2.png'
          "
          :style="{ width: isAllCompleted ? '40vw' : '30vw' }"
          mode="widthFix"
        />
      </view>
      <view class="pt-20">
        <PuzzleGrid
          :scale="0.2"
          :completed="completedPieces"
          @pieceClick="handlePieceClick"
        />
      </view>

      <view
        v-if="isAllCompleted"
        style="position: fixed; bottom: 20%; width: 80%; left: 10%"
        class="flex flex-center-row"
      >
        <button
          style="font-size: 20px; border-radius: 30px; color: #fff"
          class="bg-orange px-40 py-6"
          @click="submit"
        >
          继续下一幅拼图
        </button>
      </view>
    </view>

    <!-- <u-button
      :text="$t('apply logoff')"
      shape="circle"
      @click="submit"
    ></u-button> -->
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import PuzzleGrid from "@/components/PuzzleGrid.vue";
import { onLoad } from "@dcloudio/uni-app";
import {
  listStudentsByTeacherId,
  updateStudentPuzzleProgress,
  completeStudentPuzzle,
} from "@/utils/api";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

const completedPieces = ref<boolean[]>(Array(9).fill(false));
const studentInfo = ref<{
  id: number;
  nickname: string;
  completedCount: number;
} | null>(null);
const isAllCompleted = computed(() => {
  return completedPieces.value.every((piece) => piece === true);
});

onLoad((options: any) => {
  if (options.studentId) {
    // 如果有参数，说明是教师查看学生的拼图
    studentInfo.value = {
      id: parseInt(options.studentId),
      nickname: options.nickname,
      completedCount: parseInt(options.completedCount),
    };
    // 解析进度数据
    completedPieces.value = JSON.parse(decodeURIComponent(options.progress));
  } else {
    // 如果没有参数，说明是学生查看自己的拼图
    // TODO: 获取学生自己的拼图进度
  }
});

const handlePieceClick = async (index: number) => {
  const studentName = studentInfo.value?.nickname || "XX";
  uni.showModal({
    title: "赠送确认",
    content: `是否赠送一块拼图给${studentName}同学？`,
    success: async (res) => {
      if (res.confirm) {
        completedPieces.value[index] = true;
        // 更新拼图进度
        if (studentInfo.value) {
          try {
            await updateStudentPuzzleProgress(
              studentInfo.value.id,
              completedPieces.value
            );
          } catch (error) {
            console.error("Failed to update progress:", error);
            uni.showToast({
              title: "更新进度失败",
              icon: "none",
            });
          }
        }
      }
    },
  });
};

onMounted(async () => {
  // 如果是学生，直接跳转到拼图页面
  if (authStore.userRole === "student") {
    uni.redirectTo({
      url: "/pages/my/student-puzzle-account",
    });
    return;
  }

  // 如果是教师，获取学生列表
  try {
    const res = await listStudentsByTeacherId(authStore.userId);
    console.log(res);
  } catch (error) {
    console.error("Failed to fetch students:", error);
    uni.showToast({
      title: "获取学生列表失败",
      icon: "none",
    });
  }
});

const submit = async () => {
  if (!isAllCompleted.value) {
    uni.showToast({
      title: "请先完成当前拼图",
      icon: "none",
    });
    return;
  }

  if (studentInfo.value) {
    try {
      // 更新完成数量并重置进度
      const newCompletedCount = studentInfo.value.completedCount + 1;
      await completeStudentPuzzle(studentInfo.value.id, newCompletedCount);

      // 更新本地状态
      studentInfo.value.completedCount = newCompletedCount;
      completedPieces.value = Array(9).fill(false);

      uni.showToast({
        title: "恭喜完成一幅拼图！",
        icon: "success",
      });
    } catch (error) {
      console.error("Failed to complete puzzle:", error);
      uni.showToast({
        title: "保存进度失败",
        icon: "none",
      });
    }
  }
};
</script>

<style lang="scss"></style>
