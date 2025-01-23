<template>
  <up-parse :content="content"></up-parse>
</template>

<script setup lang="ts">
// 接收父组件传入的内容
defineProps<{ content: string }>();
</script>