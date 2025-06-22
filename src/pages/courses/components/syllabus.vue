<template>
  <view class="bg-white p-3 rounded-lg shadow">
    <template v-if="tree.length > 0">
      <uni-collapse>
        <TreeNode v-for="item in tree" :key="item.path" :node="item" @open-attachment="openAttachment" />
      </uni-collapse>
    </template>
    <view v-else class="text-center py-4 text-gray-500">
      <text>暂无目录结构</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TreeNode from '@/components/TreeNode.vue';
import { parseContentToTree, type TreeNode as TreeNodeType } from '@/utils/xmlTreeParser';

// --- Props ---
const props = defineProps<{
  content: string;
}>();

// --- 计算属性：使用独立的解析工具 ---
const tree = computed((): TreeNodeType[] => {
  return parseContentToTree(props.content);
});

// --- 文件处理逻辑 ---
const openAttachment = (path: string) => {
  const fullUrl = `${import.meta.env.VITE_CDN_URL}/${path}`;
  uni.showLoading({ title: '正在准备...' });
  uni.downloadFile({
    url: fullUrl,
    success: res => {
      if (res.statusCode === 200) uni.openDocument({ filePath: res.tempFilePath, showMenu: true });
      else uni.showToast({ title: '文件获取失败', icon: 'none' });
    },
    fail: () => uni.showToast({ title: '下载失败', icon: 'none' }),
    complete: () => uni.hideLoading(),
  });
};

const getIconByType = (url: string): string => {
  const ext = url.split('.').pop()?.toLowerCase() || '';
  if (['mp3', 'wav'].includes(ext)) return 'volume';
  if (['mp4', 'mov'].includes(ext)) return 'play-circle';
  if (['pdf', 'doc', 'docx'].includes(ext)) return 'file-text';
  return 'download';
};
</script>

<style>
.children-item {
  color: #9298a5;
  font-size: 14px;
  line-height: 20px;
}
</style>
