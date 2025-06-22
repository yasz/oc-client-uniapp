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
  // 对路径进行正确的编码处理
  let encodedPath = path;

  // 如果路径已经被编码过，先解码再重新编码
  try {
    const decodedPath = decodeURIComponent(path);
    // 对路径的每个部分分别编码，保留路径分隔符
    encodedPath = decodedPath.split('/').map(part => encodeURIComponent(part)).join('/');
  } catch (e) {
    // 如果解码失败，说明原路径可能没有编码，直接编码
    encodedPath = path.split('/').map(part => encodeURIComponent(part)).join('/');
  }

  const fullUrl = `${import.meta.env.VITE_CDN_URL}/${encodedPath}`;

  // console.log('原始路径:', path);
  // console.log('编码后路径:', encodedPath);
  // console.log('完整URL:', fullUrl);

  uni.showLoading({ title: '正在准备...' });
  uni.downloadFile({
    url: fullUrl,
    success: res => {
      if (res.statusCode === 200) {
        uni.openDocument({
          filePath: res.tempFilePath,
          showMenu: true,
          success: () => {
            console.log('文档打开成功');
          },
          fail: (err) => {
            console.error('文档打开失败:', err);
            uni.showToast({ title: '文件打开失败', icon: 'none' });
          }
        });
      } else {
        console.error('文件下载失败，状态码:', res.statusCode);
        uni.showToast({ title: `文件获取失败 (${res.statusCode})`, icon: 'none' });
      }
    },
    fail: (err) => {
      console.error('下载失败:', err);
      uni.showToast({ title: '下载失败', icon: 'none' });
    },
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
::v-deep .is-open+.uni-collapse-item__wrap {
  height: auto !important;
}

.children-item {
  color: #9298a5;
  font-size: 14px;
  line-height: 20px;
}
</style>
