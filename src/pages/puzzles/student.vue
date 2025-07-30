<template>
  <view>
    <view class="fixed inset-0 bg-primary z-0">
      <view class="pt-80">
        <view class="flex flex-center-row">
          <image src="/static/puzzles/title1.png" style="width: 50vw" mode="widthFix" />
        </view>
      </view>
      <view class="flex flex-center-row pt-20">
        <image :src="false ? '/static/puzzles/title3.png' : '/static/puzzles/title2.png'
          " :style="{ width: false ? '40vw' : '30vw' }" mode="widthFix" />
      </view>
      <view class="mt-[105%]">
        <view class="relative" @click="
          go(`/my/puzzle-treasure?count=${student.brick_completed_count}`)
          ">
          <button form-type="submit"
            class="w-[60%] t-26 py-20 my-20 rounded-full text-white font-bold bg-orange text-base">
            我的宝盒
          </button>
        </view>
      </view>
    </view>
    <view class="z-1" v-if="puzzleLeft">
      <view :class="`fixed top-[40%] puzzle-background-container`" :style="{ left: puzzleLeft / 2 + 'px' }">
        <view :style="{ transform: 'scale(0.2)', transformOrigin: 'top left' }">
          <template v-for="(piece, index) in puzzleBackgroundPieces" :key="index">
            <img :src="piece.src" class="absolute" :style="{
              left: piece.x - 276 + 'px',
              top: piece.y - 1094 + 'px',
            }" />
          </template>
        </view>
      </view>
    </view>

    <view class="z-2">
      <template v-for="(got, index) in gottenPieces" :key="`completed-${index}`">
        <view v-if="got" class="fixed" :style="{
          transform: 'scale(0.2)',
          transformOrigin: 'top left',
          left: piecePositions[index]?.x + 'px',
          top: piecePositions[index]?.y + 'px',
          zIndex: activePiece === index ? 100 : 1,
        }">
          <img :src="`/static/puzzles/completed/${index + 1}.png`" @touchstart.prevent="handleTouchStart($event, index)"
            @touchmove.prevent="handleTouchMove($event, index)" @touchend.prevent="handleTouchEnd($event, index)" style="
              touch-action: none;
              -webkit-user-select: none;
              user-select: none;
            " />
        </view>
      </template>
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
import { go } from "@/utils/common";
import { getAPIAxios } from "@/utils/http";
import { onShow } from "@dcloudio/uni-app";
import { ref, watch } from "vue";
const info = uni.getSystemInfoSync();
const puzzleLeft = ref(info.screenWidth - (1791 - 275 * 2) / 5);
const student = ref<any>(null);

// 拖拽相关状态
const gottenPieces = ref<any>(null);
const piecePositions = ref<{ x: number; y: number }[]>([]);
const activePiece = ref<number | null>(null);
const touchOffset = ref<{ x: number; y: number }>({ x: 0, y: 0 });

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
      gottenPieces.value =
        student.value.brick_current_progress || Array(9).fill(false);
      initializePiecePositions();
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    uni.showToast({
      title: "获取学生数据失败",
      icon: "none",
    });
  }
};

const initializePiecePositions = () => {
  const currentInfo = uni.getSystemInfoSync(); // Get fresh screen info
  const positions: { x: number; y: number }[] = [];
  const topAreaHeight = currentInfo.windowHeight * 0.7; // Define area for pieces above the button

  for (let i = 0; i < 9; i++) {
    if (gottenPieces.value?.[i]) {
      positions[i] = {
        x: Math.random() * (currentInfo.screenWidth - 100), // Random x, with margin
        y: Math.random() * (topAreaHeight - 150) + 50, // Random y in the top area, with margin
      };
    } else {
      positions[i] = { x: -9999, y: -9999 };
    }
  }
  piecePositions.value = positions;
};

const handleTouchStart = (event: any, index: number) => {
  event.preventDefault();
  const touch = event.touches[0];
  const piece = piecePositions.value[index];

  activePiece.value = index;
  touchOffset.value = {
    x: touch.pageX - piece.x,
    y: touch.pageY - piece.y,
  };
};

const handleTouchMove = (event: any, index: number) => {
  if (activePiece.value !== index) return;
  event.preventDefault();

  const touch = event.touches[0];
  piecePositions.value[index] = {
    x: touch.pageX - touchOffset.value.x,
    y: touch.pageY - touchOffset.value.y,
  };
};

const handleTouchEnd = (event: any, index: number) => {
  if (activePiece.value !== index) return;
  event.preventDefault();

  // 检查是否接近目标位置
  const piece = piecePositions.value[index];
  const targetPiece = puzzleBackgroundPieces[index];

  // 获取背景容器的位置和大小
  uni.createSelectorQuery().select('.puzzle-background-container').boundingClientRect(rect => {
    if (rect) {
      const scale = 0.2;
      const calculatedTop = uni.getSystemInfoSync().windowHeight * 0.4;
      const targetX = rect.left + (targetPiece.x - 276) * scale;
      const targetY = calculatedTop + (targetPiece.y - 1094) * scale;

      const distance = Math.sqrt(
        Math.pow(piece.x - targetX, 2) + Math.pow(piece.y - targetY, 2)
      );

      // 如果距离小于50像素，自动吸附到目标位置
      if (distance < 50) {
        piecePositions.value[index] = {
          x: targetX,
          y: targetY,
        };
      }
    }
  }).exec();

  activePiece.value = null;
};

watch(gottenPieces, () => {
  initializePiecePositions();
});
</script>