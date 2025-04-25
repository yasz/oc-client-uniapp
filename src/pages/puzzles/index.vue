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
import { ref, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import PuzzleGrid from "@/components/PuzzleGrid.vue";
import {
  updateStudentPuzzleProgress,
  completeStudentPuzzle,
} from "@/utils/api";
import { getAPIAxios } from "@/utils/common";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const puzzleGridRef = ref();
const student = ref<any>(null);
const completedPieces = ref<boolean[]>(Array(9).fill(false));
const completedCount = ref<number>(0);

// 检查是否所有拼图都完成
const isAllCompleted = computed(() => {
  return completedPieces.value.every((piece) => piece === true);
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
      // 初始化拼图状态
      completedPieces.value =
        student.value.brick_current_progress || Array(9).fill(false);
      completedCount.value = student.value.brick_completed_count || 0;
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    uni.showToast({
      title: "获取学生数据失败",
      icon: "none",
    });
  }
};

// 处理拼图点击
const handlePieceClick = async (index: number) => {
  const studentName = student.value?.nickname || "XX";
  uni.showModal({
    title: "赠送确认",
    content: `是否赠送一块拼图给${studentName}同学？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          // 更新本地状态
          completedPieces.value[index] = true;

          // 调用API更新进度
          await updateStudentPuzzleProgress(
            student.value.id,
            completedPieces.value
          );

          // 检查是否完成所有拼图
          // if (isAllCompleted.value) {
          //   uni.showModal({
          //     title: "恭喜",
          //     content: "你已完成所有拼图，是否提交？",
          //     success: async (res) => {
          //       if (res.confirm) {
          //         await submit();
          //       }
          //     },
          //   });
          // }
        } catch (error) {
          console.error("Error updating progress:", error);
          completedPieces.value[index] = false; // 还原状态
          uni.showToast({
            title: "更新进度失败",
            icon: "none",
          });
        }
      }
    },
  });
};

// 提交完成的拼图
const submit = async () => {
  if (!isAllCompleted.value) {
    uni.showToast({
      title: "请先完成所有拼图",
      icon: "none",
    });
    return;
  }

  try {
    const newCompletedCount = completedCount.value + 1;
    await completeStudentPuzzle(student.value.id, newCompletedCount);

    completedCount.value = newCompletedCount;
    completedPieces.value = Array(9).fill(false);

    uni.showToast({
      title: "提交成功",
      icon: "success",
    });
  } catch (error) {
    console.error("Error submitting puzzle:", error);
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

<style lang="scss"></style>
