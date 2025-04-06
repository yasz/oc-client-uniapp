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
        <view v-for="(piece, index) in puzzlePieces" :key="index" class="puzzle-piece">
          <image :src="piece.src" mode="aspectFit" @click="handlePieceClick(index)"></image>
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
      puzzlePieces: [
        { statc: './src/static/puzzles/1.png' },
        { statc: './src/static/puzzles/2.png' },
        { statc: './src/static/puzzles/3.png' },
        { statc: './src/static/puzzles/4.png' },
        { statc: './src/static/puzzles/5.png' },
        { statc: './src/static/puzzles/6.png' },
        { statc: './src/static/puzzles/7.png' },
        { statc: './src/static/puzzles/8.png' },
        { statc: './src/static/puzzles/9.png' }
      ]
    }
  },
  methods: {
    handlePieceClick(index) {
      // Handle puzzle piece click logic here
      console.log('Piece clicked:', index)
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
      gap: 10rpx;

      .puzzle-piece {
        aspect-ratio: 1;
        border: 2rpx solid #ddd;
        border-radius: 10rpx;
        overflow: hidden;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>