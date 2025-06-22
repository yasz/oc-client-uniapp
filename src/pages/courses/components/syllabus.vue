<template>
  <view class="bg-white p-3 rounded-lg shadow">
    <template v-if="tree.length > 0">
      <uni-collapse>
        <view v-for="item in tree" :key="item.path">
          <uni-collapse-item v-if="item.children" :title="item.name" :open="true">
            <view v-for="child in item.children" :key="child.path">
              <uni-collapse-item v-if="child.children" :title="child.name" :open="true">
                <view v-for="grandChild in child.children" :key="grandChild.path">
                  <uni-collapse-item v-if="grandChild.children" :title="grandChild.name" :open="true">
                    <view v-for="file in grandChild.children" :key="file.path" class="flex items-center pl-5">
                      <text class="children-item py-2 pl-2 flex-1">{{ file.name }}</text>
                      <up-icon :name="getIconByType(file.path)" size="22" color="#9298a5" class="ml-auto pr-3"
                        @click="openAttachment(file.path)" />
                    </view>
                  </uni-collapse-item>
                  <view v-else class="flex items-center pl-5">
                    <text class="children-item py-2 pl-2 flex-1">{{ grandChild.name }}</text>
                    <up-icon :name="getIconByType(grandChild.path)" size="22" color="#9298a5" class="ml-auto pr-3"
                      @click="openAttachment(grandChild.path)" />
                  </view>
                </view>
              </uni-collapse-item>
              <view v-else class="flex items-center pl-5">
                <text class="children-item py-2 pl-2 flex-1">{{ child.name }}</text>
                <up-icon :name="getIconByType(child.path)" size="22" color="#9298a5" class="ml-auto pr-3"
                  @click="openAttachment(child.path)" />
              </view>
            </view>
          </uni-collapse-item>
          <view v-else class="flex items-center pl-5">
            <text class="children-item py-2 pl-2 flex-1">{{ item.name }}</text>
            <up-icon :name="getIconByType(item.path)" size="22" color="#9298a5" class="ml-auto pr-3"
              @click="openAttachment(item.path)" />
          </view>
        </view>
      </uni-collapse>
    </template>
    <view v-else class="text-center py-4 text-gray-500">
      <text>暂无目录结构</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { XMLParser } from "fast-xml-parser";

// --- TypeScript 接口定义 ---
interface CosContent {
  Key: string;
  Size: string;
}

interface TreeNode {
  name: string;
  path: string;
  children?: TreeNode[];
}

// --- Props ---
const props = defineProps<{
  content: string;
}>();

// --- XML 解析和树构建逻辑 ---
const parser = new XMLParser();
const tree = computed((): TreeNode[] => {
  console.log('Syllabus content:', props.content); // 调试信息
  if (!props.content) return [];
  try {
    const parsedXml = parser.parse(props.content);
    console.log('Parsed XML:', parsedXml); // 调试信息
    const contentsInput = parsedXml?.ListBucketResult?.Contents;
    if (!contentsInput) return [];

    const contents: CosContent[] = Array.isArray(contentsInput) ? contentsInput : [contentsInput];
    console.log('Contents:', contents); // 调试信息

    // 找到根目录名称（第一个路径的第一部分）
    let rootName = '';
    if (contents.length > 0 && contents[0].Key) {
      const firstPath = contents[0].Key;
      const pathParts = firstPath.split('/').filter(p => p);
      if (pathParts.length > 0) {
        rootName = pathParts[0];
      }
    }

    const root: TreeNode = { name: rootName, path: rootName, children: [] };

    contents.forEach(item => {
      if (!item.Key || item.Key.includes('.DS_Store') || (item.Size === '0' && item.Key.endsWith('/'))) {
        return;
      }

      const pathParts = item.Key.split('/').filter(p => p);
      let currentNode = root;

      pathParts.forEach((part, index) => {
        let childNode = currentNode.children?.find(child => child.name === part);
        if (!childNode) {
          const isFolder = index < pathParts.length - 1;
          childNode = {
            name: part,
            path: pathParts.slice(0, index + 1).join('/'),
            children: isFolder ? [] : undefined,
          };
          if (!currentNode.children) currentNode.children = [];
          currentNode.children.push(childNode);
        }
        currentNode = childNode;
      });
    });
    console.log('Final tree:', root.children); // 调试信息
    return root.children || [];
  } catch (e) {
    console.error("XML parsing failed:", e);
    return [];
  }
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
