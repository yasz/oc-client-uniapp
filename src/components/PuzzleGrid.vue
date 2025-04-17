<template>
    <view class="puzzle-container" :style="containerStyle">
        <view v-for="(piece, index) in puzzlePieces" :key="index" class="puzzle-piece" :style="pieceStyles[index]">
            <image :src="piece.src" mode="scaleToFill" :style="{ width: '100%', height: '100%' }"
                @load="onImageLoad($event, index)"></image>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { adjustedBackgroundPieces as puzzleData, type PuzzlePiece } from './puzzle-data'

const props = defineProps({
    scale: {
        type: Number,
        default: 1
    }
})

const puzzlePieces = ref<PuzzlePiece[]>(puzzleData.map(p => ({ ...p })))
const imagesLoaded = ref<boolean[]>(Array(puzzlePieces.value.length).fill(false))
const containerSize = ref({ width: 0, height: 0 })
const screenSize = ref({ width: 0, height: 0 })

onMounted(() => {
    // 获取屏幕尺寸
    const systemInfo = uni.getSystemInfoSync()
    screenSize.value = {
        width: systemInfo.windowWidth,
        height: systemInfo.windowHeight
    }
})

const onImageLoad = (event: any, index: number) => {
    const { width, height } = event.detail
    const pieceRef = puzzlePieces.value[index];
    if (pieceRef) {
        pieceRef.originalWidth = width
        pieceRef.originalHeight = height
        imagesLoaded.value[index] = true

        // 当所有图片都加载完成后，计算容器尺寸
        if (imagesLoaded.value.every(loaded => loaded)) {
            calculateContainerSize()
        }
    }
}

const calculateContainerSize = () => {
    let maxX = 0
    let maxY = 0

    puzzlePieces.value.forEach(piece => {
        const right = piece.x + piece.originalWidth
        const bottom = piece.y + piece.originalHeight
        maxX = Math.max(maxX, right)
        maxY = Math.max(maxY, bottom)
    })

    containerSize.value = {
        width: maxX * props.scale,
        height: maxY * props.scale
    }
}

const containerStyle = computed(() => {
    if (containerSize.value.width === 0 || containerSize.value.height === 0) {
        return {}
    }

    const translateX = (screenSize.value.width - containerSize.value.width) / 2
    const translateY = (screenSize.value.height - containerSize.value.height) / 2

    return {
        transform: `translate(${translateX}px, ${translateY}px)`,
        width: `${containerSize.value.width}px`,
        height: `${containerSize.value.height}px`
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
    position: absolute;
    top: 0;
    left: 0;
}
</style>