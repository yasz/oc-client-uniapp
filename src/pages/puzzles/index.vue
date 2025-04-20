<template>
  <view style="position: relative; width: 100vw; height: 100vh; transform: translateY(-10%);">
    <PuzzleGrid :scale="0.2" :completed="completedPieces" @pieceClick="handlePieceClick"
      @puzzleComplete="handlePuzzleComplete" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PuzzleGrid from '@/components/PuzzleGrid.vue'
//接下来是要做一个互动提示，点击灰色false块拼图会提示，是否赠送确认发放一块拼图给XX同学；

const completedPieces = ref(Array(9).fill(false))

const handlePieceClick = (index: number) => {
  uni.showModal({
    title: '赠送确认',
    content: '是否赠送一块拼图给XX同学？',
    success: (res) => {
      if (res.confirm) {
        completedPieces.value[index] = true
      }
    }
  })
}

const handlePuzzleComplete = () => {
  uni.showModal({
    title: '拼图完成',
    content: 'XX同学已经收集完一副拼图！',
    showCancel: false,
    success: () => {
      // 重置所有拼图块
      completedPieces.value = Array(9).fill(false)
    }
  })
}
</script>

<style lang="scss"></style>
