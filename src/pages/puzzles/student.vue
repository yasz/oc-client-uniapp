<template>
  <view v-if="info">
    <view class="fixed top-[30%]">
      <!-- 缩放容器，拼图原始坐标按 100% 保持，缩放容器负责等比缩放 -->

      <view class="scale-[0.2]">
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
    </view>
  </view>
</template>

<script setup lang="ts">
//如何将背景居中，1 直接按原贴图左上角 拼图1(276,1094)坐标修正
//为何要移到左上角？主要是要为了左边贴到角落，应该就是让

import {
  puzzleBackgroundPieces,
  type PuzzlePiece,
} from "@/components/puzzle-data";
import { ref } from "vue";
const info = uni.getSystemInfoSync();
const width = ref(info.screenWidth);
const height = ref(info.screenHeight);
</script>
