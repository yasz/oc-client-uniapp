<template>
    <view class="puzzle-container">
        <view class="puzzle-section">
            <view class="puzzle-title">Completed Puzzle</view>
            <view class="puzzle-grid">
                <view v-for="(piece, index) in puzzlePieces" :key="index" class="puzzle-piece">
                    <image :src="piece.src" mode="widthFix"
                        :style="{ width: piece.width * scale + 'px', height: piece.height * scale + 'px' }"
                        @load="onImageLoad($event, index)"></image>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { puzzlePieces as puzzleData } from './puzzle-data'

const props = defineProps({
    scale: {
        type: Number,
        default: 1
    }
})

const puzzlePieces = ref(puzzleData)

const onImageLoad = (event: any, index: number) => {
    const { width, height } = event.detail
    puzzlePieces.value[index].width = width
    puzzlePieces.value[index].height = height
}
</script>

<style lang="scss">
.puzzle-container {
    padding: 20rpx;
    width: 100%;

    .puzzle-section {
        max-width: 600rpx;
        margin: 0 auto;

        .puzzle-title {
            font-size: 32rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
            text-align: center;
        }

        .puzzle-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
            width: 100%;
            margin: 0 auto;
            background-color: #f0f0f0;
            padding: 0;
            border-radius: 8rpx;
        }

        .puzzle-piece {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1rpx solid #fff;
        }
    }
}
</style>