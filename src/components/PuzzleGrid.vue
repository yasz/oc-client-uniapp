<template>
  <view
    class="puzzle-container"
    :style="{ transform: `scale(${props.scale})` }"
  >
    <view
      v-for="(piece, index) in displayPieces"
      :key="index"
      class="puzzle-piece"
      :style="pieceStyles[index]"
      @click="onPieceClick(index)"
    >
      <image
        :src="getPieceImage(index)"
        mode="scaleToFill"
        :style="{ width: '100%', height: '100%' }"
        @load="onImageLoad($event, index)"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  puzzlePieces as completedPieces,
  puzzleBackgroundPieces as backgroundPieces,
  type PuzzlePiece,
} from "./puzzle-data";

const props = defineProps({
  scale: {
    type: Number,
    default: 1,
  },
  completed: {
    type: Array as () => boolean[],
    default: () => Array(9).fill(false),
  },
  offsetX: {
    type: Number,
  },
  offsetY: {
    type: Number,
  },
});

const emit = defineEmits(["pieceClick", "puzzleComplete"]);

const displayPieces = ref<PuzzlePiece[]>(
  backgroundPieces.map((p) => ({ ...p }))
);
const imagesLoaded = ref<boolean[]>(
  Array(displayPieces.value.length).fill(false)
);

const getPieceImage = (index: number) => {
  return props.completed[index]
    ? completedPieces[index].src
    : backgroundPieces[index].src;
};

const onImageLoad = (event: any, index: number) => {
  const { width, height } = event.detail;
  const pieceRef = displayPieces.value[index];
  if (pieceRef) {
    pieceRef.originalWidth = width;
    pieceRef.originalHeight = height;
    imagesLoaded.value[index] = true;
  }
};

const pieceStyles = computed(() => {
  const deltaX =
    displayPieces.value[0].x -
    (displayPieces.value[0].originalWidth / 2 +
      uni.getSystemInfoSync().screenWidth / 2);
  const deltaY =
    displayPieces.value[0].y - displayPieces.value[0].originalHeight / 2;

  return displayPieces.value.map((piece, index) => {
    const w = piece.originalWidth || 0;
    const h = piece.originalHeight || 0;
    const x = piece.x;
    const y = piece.y;

    return {
      position: "absolute" as const,
      top: `${y - deltaY}px`,
      left: `${x - deltaX}px`,
      width: `${w}px`,
      height: `${h}px`,
      opacity: imagesLoaded.value[index] ? 1 : 0,
      transition: "opacity 0.3s ease",
    };
  });
});

const onPieceClick = (index: number) => {
  if (!props.completed[index]) {
    emit("pieceClick", index);
  }
};
</script>

<style lang="scss">
.puzzle-container {
  position: absolute;
}
.puzzle-piece {
  cursor: pointer;
}
html,
body {
  overflow: hidden;
  position: fixed; /* 防止内容因隐藏滚动条导致跳动 */
  width: 100%;
  height: 100%;
  touch-action: none; /* 尽量禁止触摸行为 */
  overscroll-behavior: none; /* 防止滚动穿透 */
}
</style>
