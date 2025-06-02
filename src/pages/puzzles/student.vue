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
        <PuzzleGrid :scale="0.2" :completed="completedPieces" />
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

onLoad((options: any) => {
  if (options.studentId) {
    fetchStudentData(parseInt(options.studentId));
  }
});
</script>

<style lang="scss"></style>
