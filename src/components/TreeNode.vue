<template>
    <view>
        <uni-collapse-item v-if="node.children && node.children.length > 0" :title="node.name" :open="false"
            :style="{ paddingLeft: indentStyle }">
            <TreeNode v-for="child in node.children" :key="child.path" :node="child" :level="level + 1"
                @download="$emit('download', $event)" @preview="$emit('preview', $event)" />
        </uni-collapse-item>
        <view v-else-if="node.isFile" class="flex items-center" :style="{ paddingLeft: indentStyle }">
            <text class="children-item py-2 pl-2 flex-1">{{ node.name }}</text>
            <up-icon name="download" size="22" color="#9298a5" class="ml-auto pr-3"
                @click="$emit('download', node.path)" />
            <up-icon v-if="showPreviewIcon(node.path)" name="eye" size="22" class="pr-3"
                @click="$emit('preview', node.path)" />
        </view>
        <view v-else class="flex items-center" :style="{ paddingLeft: indentStyle }">
            <text class="children-item py-2 pl-2 flex-1">{{ node.name }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
import { withDefaults, computed } from 'vue';
import type { TreeNode } from '@/utils/xmlTreeParser';

const props = withDefaults(defineProps<{
    node: TreeNode;
    level?: number;
}>(), {
    level: 1
});

defineEmits<{
    'download': [path: string];
    'preview': [path: string];
}>();

// 计算缩进样式，每个层级增加微妙的视觉差异
const indentStyle = computed(() => {
    const baseIndent = 12; // 基础缩进 (px)
    const levelIndent = (props.level - 1) * 16; // 每级增加16px (约1个字符)
    return `${baseIndent + levelIndent}px`;
});

// 判断是否显示预览图标
const showPreviewIcon = (url: string): boolean => {
    const ext = url.split('.').pop()?.toLowerCase() || '';
    return ['mp3', 'mp4', 'pdf'].includes(ext);
};
</script>

<style>
.children-item {
    color: #9298a5;
    font-size: 14px;
    line-height: 20px;
}
</style>