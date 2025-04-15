<template>
    <view class="puzzle-container">

        <view v-for="(piece, index) in puzzlePieces" :key="index" class="puzzle-piece" :style="pieceStyles[index]">
            <image :src="piece.src" mode="scaleToFill" :style="{ width: '100%', height: '100%' }"
                @load="onImageLoad($event, index)"></image>
        </view>

    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { adjustedBackgroundPieces as puzzleData, type PuzzlePiece } from './puzzle-data'

const props = defineProps({
    scale: {
        type: Number,
        default: 1
    }
})

const puzzlePieces = ref<PuzzlePiece[]>(puzzleData.map(p => ({ ...p })))

const imagesLoaded = ref<boolean[]>(Array(puzzlePieces.value.length).fill(false))

const onImageLoad = (event: any, index: number) => {
    const { width, height } = event.detail
    const pieceRef = puzzlePieces.value[index];
    if (pieceRef) {
        pieceRef.originalWidth = width
        pieceRef.originalHeight = height
        imagesLoaded.value[index] = true
    }
}


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
    position: relative;
    width: 100%;
    height: 100%;
}
</style>