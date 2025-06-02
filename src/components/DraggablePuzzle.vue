<template>
  <!-- 外层容器，居中 + 缩放 -->
  <div class="fixed inset-0 flex items-center justify-center">
    <!-- 缩放容器，拼图原始坐标按 100% 保持，缩放容器负责等比缩放 -->
    <div class="relative origin-top-left scale-[0.2] w-[1500px] h-[2000px]">
      <!-- 动态渲染每块拼图底图 -->
      <template v-for="(piece, index) in puzzleBackgroundPieces" :key="index">
        <img
          :src="piece.src"
          class="absolute"
          :style="{
            left: piece.x + 'px',
            top: piece.y + 'px',
          }"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { puzzleBackgroundPieces, type PuzzlePiece } from "./puzzle-data";
</script>

<style scoped>
/* 可根据需要添加额外样式，这里保持干净 */
</style>
