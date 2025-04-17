<template>
  <view style="position: relative; width: 100vw; height: 100vh; transform: translateY(-10%);">
    <PuzzleGrid :scale="0.2" :completed="[true, false, true, false, true, false, true, false, true]" />
  </view>
</template>

<script setup lang="ts">
import PuzzleGrid from '@/components/PuzzleGrid.vue'
</script>

<style lang="scss"></style>
