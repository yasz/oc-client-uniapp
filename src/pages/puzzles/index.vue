<template>
  <view class="puzzle-container">
    <view class="account-section">
      <view class="account-title">Puzzle Account</view>
      <view class="account-info">
        <view class="info-item">
          <text class="label">Username:</text>
          <text class="value">{{ username }}</text>
        </view>
        <view class="info-item">
          <text class="label">Level:</text>
          <text class="value">{{ level }}</text>
        </view>
        <view class="info-item">
          <text class="label">Score:</text>
          <text class="value">{{ score }}</text>
        </view>
      </view>
    </view>

    <view class="puzzle-section">
      <view class="puzzle-title">Puzzle Game</view>
      <view class="puzzle-grid">
        <!-- 底板层 -->
        <view v-for="(piece, index) in baseLayer" :key="'base-' + index" class="puzzle-piece base-piece" :style="{
          transform: `translate(${(index % 3) * (100 / 3)}%, ${Math.floor(index / 3) * (100 / 3)}%) scale(${piece.scale || 1})`,
          left: 0,
          top: 0,
          width: `${100 / 3}%`,
          height: `${100 / 3}%`
        }">
          <image :src="piece.src" mode="aspectFit"></image>
        </view>

        <!-- 游戏层 -->
        <view v-for="(piece, index) in puzzlePieces" :key="'game-' + index" class="puzzle-piece game-piece"
          @touchstart="startDrag($event, index)" @touchmove="onDrag($event, index)" @touchend="endDrag($event, index)"
          :style="{
            transform: `translate(${piece.x}px, ${piece.y}px) scale(${piece.scale})`,
            zIndex: isDragging && currentPiece === index ? 10 : piece.scale > 1 ? 1 : 0,
            transition: isDragging && currentPiece === index ? 'none' : 'all 0.3s ease'
          }">
          <image :src="piece.src" mode="aspectFit"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: 'Player',
      level: 1,
      score: 0,
      // 底板层
      baseLayer: [
        { src: '/static/puzzles/1.png', x: 0, y: 0 },
        { src: '/static/puzzles/2.png', x: 0, y: 0, scale: 1.25 },
        { src: '/static/puzzles/3.png', x: 0, y: 0 },
        { src: '/static/puzzles/4.png', x: 0, y: 0 },
        { src: '/static/puzzles/5.png', x: 0, y: 0, scale: 1.25 },
        { src: '/static/puzzles/6.png', x: 0, y: 0 },
        { src: '/static/puzzles/7.png', x: 0, y: 0 },
        { src: '/static/puzzles/8.png', x: 0, y: 0, scale: 1.25 },
        { src: '/static/puzzles/9.png', x: 0, y: 0 }
      ],
      // 游戏层
      puzzlePieces: [
        { src: '/static/puzzles/completed/1.png', x: 0, y: 0, originalIndex: 0, scale: 1 },
        { src: '/static/puzzles/completed/2.png', x: 0, y: 0, originalIndex: 1, scale: 1.25 },
        { src: '/static/puzzles/completed/3.png', x: 0, y: 0, originalIndex: 2, scale: 1 },
        { src: '/static/puzzles/completed/4.png', x: 0, y: 0, originalIndex: 3, scale: 1 },
        { src: '/static/puzzles/completed/5.png', x: 0, y: 0, originalIndex: 4, scale: 1.25 },
        { src: '/static/puzzles/completed/6.png', x: 0, y: 0, originalIndex: 5, scale: 1 },
        { src: '/static/puzzles/completed/7.png', x: 0, y: 0, originalIndex: 6, scale: 1 },
        { src: '/static/puzzles/completed/8.png', x: 0, y: 0, originalIndex: 7, scale: 1.25 },
        { src: '/static/puzzles/completed/9.png', x: 0, y: 0, originalIndex: 8, scale: 1 }
      ],
      isDragging: false,
      currentPiece: null,
      startX: 0,
      startY: 0,
      gridSize: 200,
      snapThreshold: 50
    }
  },
  mounted() {
    // 初始化时计算每个拼图块的目标位置
    this.initializePositions();
  },
  methods: {
    initializePositions() {
      const gridSize = this.gridSize;
      this.puzzlePieces.forEach((piece, index) => {
        // 计算目标位置
        piece.targetX = (index % 3) * gridSize;
        piece.targetY = Math.floor(index / 3) * gridSize;
        // 随机打乱初始位置
        piece.x = Math.random() * (window.innerWidth - gridSize);
        piece.y = Math.random() * (window.innerHeight - gridSize);
      });
    },
    startDrag(event, index) {
      this.isDragging = true;
      this.currentPiece = index;
      this.startX = event.touches[0].clientX - this.puzzlePieces[index].x;
      this.startY = event.touches[0].clientY - this.puzzlePieces[index].y;
      // 拖动时提升z-index
      this.puzzlePieces[index].zIndex = 10;
    },
    onDrag(event, index) {
      if (!this.isDragging || this.currentPiece !== index) return;

      const x = event.touches[0].clientX - this.startX;
      const y = event.touches[0].clientY - this.startY;

      this.puzzlePieces[index].x = x;
      this.puzzlePieces[index].y = y;
    },
    endDrag(event, index) {
      if (!this.isDragging || this.currentPiece !== index) return;

      const piece = this.puzzlePieces[index];
      const snapThreshold = this.snapThreshold;

      // 检查是否接近目标位置
      const distanceToTarget = Math.sqrt(
        Math.pow(piece.x - piece.targetX, 2) +
        Math.pow(piece.y - piece.targetY, 2)
      );

      // 如果接近目标位置，自动吸附
      if (distanceToTarget < snapThreshold) {
        piece.x = piece.targetX;
        piece.y = piece.targetY;
        piece.isSnapped = true;
      }

      // 重置z-index
      piece.zIndex = piece.scale > 1 ? 1 : 0;

      this.isDragging = false;
      this.currentPiece = null;

      // 检查是否完成拼图
      this.checkCompletion();
    },
    checkCompletion() {
      const isComplete = this.puzzlePieces.every(piece => piece.isSnapped);
      if (isComplete) {
        uni.showToast({
          title: '恭喜完成拼图！',
          icon: 'success'
        });
        this.score += 100;
      }
    }
  }
}
</script>

<style lang="scss">
.puzzle-container {
  padding: 20rpx;

  .account-section {
    background-color: #f5f5f5;
    padding: 20rpx;
    border-radius: 10rpx;
    margin-bottom: 30rpx;

    .account-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .account-info {
      .info-item {
        display: flex;
        margin-bottom: 10rpx;

        .label {
          width: 150rpx;
          color: #666;
        }

        .value {
          color: #333;
          font-weight: bold;
        }
      }
    }
  }

  .puzzle-section {
    .puzzle-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .puzzle-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
      width: 100%;
      max-width: 600rpx;
      margin: 0 auto;
      position: relative;
      height: 600rpx;
      background-color: #f0f0f0;
      padding: 0;
      border-radius: 8rpx;

      .puzzle-piece {
        aspect-ratio: 1;
        overflow: hidden;
        position: absolute;

        &.base-piece {
          pointer-events: none;
          opacity: 0.3;
          z-index: 0;
          transform-origin: top left;
        }

        &.game-piece {
          width: calc(100% / 3);
          height: calc(100% / 3);
          touch-action: none;
          transition: transform 0.1s;
          border-radius: 4rpx;
          z-index: 1;
        }

        image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>