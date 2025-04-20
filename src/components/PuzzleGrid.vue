<template>
    <view class="puzzle-container" :style="containerStyle">
        <view v-for="(piece, index) in displayPieces" :key="index" class="puzzle-piece" :style="pieceStyles[index]"
            @click="onPieceClick(index)">
            <image :src="getPieceImage(index)" mode="scaleToFill" :style="{ width: '100%', height: '100%' }"
                @load="onImageLoad($event, index)"></image>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { puzzlePieces as completedPieces, puzzleBackgroundPieces as backgroundPieces, type PuzzlePiece } from './puzzle-data'

const props = defineProps({
    scale: {
        type: Number,
        default: 1
    },
    completed: {
        type: Array as () => boolean[],
        default: () => Array(9).fill(false)
    }
})

const emit = defineEmits(['pieceClick', 'puzzleComplete'])

// 使用 ref 来存储拼图块数据
const displayPieces = ref<PuzzlePiece[]>(backgroundPieces.map(p => ({ ...p })))
const imagesLoaded = ref<boolean[]>(Array(displayPieces.value.length).fill(false))
const containerSize = ref({ width: 0, height: 0 })
const screenSize = ref({ width: 0, height: 0 })

onMounted(() => {
    const systemInfo = uni.getSystemInfoSync()
    screenSize.value = {
        width: systemInfo.windowWidth,
        height: systemInfo.windowHeight
    }
})

const getPieceImage = (index: number) => {
    return props.completed[index] ? completedPieces[index].src : backgroundPieces[index].src
}

const onImageLoad = (event: any, index: number) => {
    const { width, height } = event.detail
    const pieceRef = displayPieces.value[index];
    if (pieceRef) {
        pieceRef.originalWidth = width
        pieceRef.originalHeight = height
        imagesLoaded.value[index] = true

        if (imagesLoaded.value.every(loaded => loaded)) {
            calculateContainerSize()
        }
    }
}

const calculateContainerSize = () => {
    let maxX = 0
    let maxY = 0

    displayPieces.value.forEach(piece => {
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

    // 获取第5块拼图（索引为4）的位置和尺寸
    const centerPiece = displayPieces.value[4]
    if (!centerPiece || !centerPiece.originalWidth || !centerPiece.originalHeight) {
        return {}
    }

    // 计算中心块的中心点位置
    const centerPieceCenterX = (centerPiece.x + centerPiece.originalWidth / 2) * props.scale
    const centerPieceCenterY = (centerPiece.y + centerPiece.originalHeight / 2) * props.scale

    // 计算需要移动的距离，使中心块居中
    const translateX = screenSize.value.width / 2 - centerPieceCenterX
    const translateY = screenSize.value.height / 2 - centerPieceCenterY

    return {
        transform: `translate(${translateX}px, ${translateY}px)`,
        width: `${containerSize.value.width}px`,
        height: `${containerSize.value.height}px`
    }
})

const pieceStyles = computed(() => {
    return displayPieces.value.map((piece, index) => {
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

const onPieceClick = (index: number) => {
    if (!props.completed[index]) {
        emit('pieceClick', index)
    }
}

// 监听 completed 变化，检查是否完成整幅拼图
watch(() => props.completed, (newCompleted) => {
    if (newCompleted.every(isCompleted => isCompleted)) {
        emit('puzzleComplete')
    }
}, { deep: true })
</script>

<style lang="scss">
.puzzle-container {
    position: absolute;
    top: 0;
    left: 0;
}

.puzzle-piece {
    cursor: pointer;
}
</style>