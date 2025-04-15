<template>
    <view class="puzzle-container">
        <view class="puzzle-section">
            <view class="puzzle-grid" :style="puzzleGridStyle">
                <view v-for="(piece, index) in puzzlePieces" :key="index" class="puzzle-piece"
                    :style="pieceStyles[index]">
                    <image :src="piece.src" mode="scaleToFill" :style="{ width: '100%', height: '100%' }"
                        @load="onImageLoad($event, index)"></image>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { puzzleBackgroundPieces as puzzleData, type PuzzlePiece } from './puzzle-data'

const props = defineProps({
    scale: {
        type: Number,
        default: 1
    }
})

const puzzlePieces = ref<PuzzlePiece[]>(puzzleData.map(p => ({ ...p })))

const imagesLoaded = ref<boolean[]>(Array(puzzlePieces.value.length).fill(false))
const allImagesLoaded = computed(() => imagesLoaded.value.every(loaded => loaded))

const onImageLoad = (event: any, index: number) => {
    const { width, height } = event.detail
    const pieceRef = puzzlePieces.value[index];
    if (pieceRef) {
        pieceRef.originalWidth = width
        pieceRef.originalHeight = height
        imagesLoaded.value[index] = true
    }
}

const puzzleGridStyle = computed(() => {
    let maxWidth = 0
    let maxHeight = 0

    if (!allImagesLoaded.value || !puzzlePieces.value || puzzlePieces.value.length === 0) {
        return { position: 'relative' as const, width: '0px', height: '0px', overflow: 'hidden' as const };
    }

    puzzlePieces.value.forEach(piece => {
        if (!piece.originalWidth || piece.originalWidth <= 0 || !piece.originalHeight || piece.originalHeight <= 0) {
            console.warn(`Piece with src ${piece.src} has invalid dimensions even after loading.`);
            return;
        }
        const rightEdge = (piece.x + piece.originalWidth) * props.scale
        const bottomEdge = (piece.y + piece.originalHeight) * props.scale
        if (rightEdge > maxWidth) maxWidth = rightEdge
        if (bottomEdge > maxHeight) maxHeight = bottomEdge
    });

    return {
        position: 'relative' as const,
        width: `${maxWidth}px`,
        height: `${maxHeight}px`,
        overflow: 'hidden' as const,
    }
})

const pieceStyles = computed(() => {
    return puzzlePieces.value.map((piece, index) => {
        const currentOriginalWidth = piece.originalWidth > 0 ? piece.originalWidth : 0;
        const currentOriginalHeight = piece.originalHeight > 0 ? piece.originalHeight : 0;

        const scaledWidth = currentOriginalWidth * props.scale
        const scaledHeight = currentOriginalHeight * props.scale
        const scaledX = piece.x * props.scale
        const scaledY = piece.y * props.scale

        return {
            position: 'absolute' as const,
            top: `${scaledY}px`,
            left: `${scaledX}px`,
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            opacity: imagesLoaded.value[index] ? 1 : 0,
            transition: 'opacity 0.3s ease',
            boxSizing: 'border-box' as const
        }
    })
})

</script>

<style lang="scss">
.puzzle-container {
    padding: 20rpx;
    width: 100%;
    box-sizing: border-box;

    .puzzle-section {
        max-width: 100%;
        margin: 0 auto;

        .puzzle-title {
            font-size: 32rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
            text-align: center;
        }

        .puzzle-grid {
            margin: 0 auto;
            background-color: #fff;
            padding: 0;
            border-radius: 8rpx;
            transition: width 0.3s ease, height 0.3s ease;
        }

        .puzzle-piece {
            box-sizing: border-box;

            image {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>