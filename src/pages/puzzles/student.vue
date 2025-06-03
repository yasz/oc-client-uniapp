<template>
  <view v-if="puzzleLeft">
    <view :class="`fixed top-[30%] left-[${puzzleLeft / 2}px]`">
      <!-- 缩放容器，拼图原始坐标按 100% 保持，缩放容器负责等比缩放 -->

      <view :class="`scale-[0.2]`">
        <!-- 动态渲染每块拼图底图 -->
        <template v-for="(piece, index) in puzzleBackgroundPieces" :key="index">
          <img
            :src="piece.src"
            class="absolute"
            :style="{
              left: piece.x - 276 + 'px',
              top: piece.y - 1094 + 'px',
            }"
          />
        </template>
      </view>
      {{ completedPieces }}
    </view>
  </view>
</template>

<script setup lang="ts">
//如何将背景居中，1 直接按原贴图左上角 拼图1(276,1094)坐标修正
//移到左上角后，要根据贴图的整体宽度，计算移动的坐标，比如在400width/中点为200px位置的屏幕，100width图片来说居中就是要移动到(150,250)，而对200width图片，则是移到(100,300)的位置；
//我们的图片宽度就是1791-(275*2)=1241 然后*0.2= 248.2
import {
  puzzleBackgroundPieces,
  type PuzzlePiece,
} from "@/components/puzzle-data";
import { useAuthStore } from "@/stores/authStore";
import { getAPIAxios } from "@/utils/common";
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
const info = uni.getSystemInfoSync();
const puzzleLeft = ref(info.screenWidth - (1791 - 275 * 2) / 5);
const student = ref<any>(null);

const completedPieces = ref<any>(null);
onShow((options: any) => {
  const studentId = useAuthStore().userId;
  fetchStudentData(studentId);
});

const fetchStudentData = async (studentId: any) => {
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
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    uni.showToast({
      title: "获取学生数据失败",
      icon: "none",
    });
  }
};
</script>
