<template>
    <view>
        <uni-collapse-item v-if="node.children && node.children.length > 0" :title="node.name" :open="false"
            :style="{ paddingLeft: indentStyle }">
            <TreeNode v-for="child in node.children" :key="child.path" :node="child" :level="level + 1"
                @open-attachment="$emit('open-attachment', $event)" />
        </uni-collapse-item>
        <view v-else-if="node.isFile" class="flex items-center" :style="{ paddingLeft: indentStyle }">
            <text class="children-item py-2 pl-2 flex-1">{{ node.name }}</text>
            <up-icon :name="getIconByType(node.path)" size="22" color="#9298a5" class="ml-auto pr-3"
                @click="$emit('open-attachment', node.path)" />
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
    'open-attachment': [path: string];
}>();

// 计算缩进样式，每个层级增加2个字符的缩进
const indentStyle = computed(() => {
    const baseIndent = 20; // 基础缩进 (px)
    const levelIndent = (props.level - 1) * 32; // 每级增加32px (约2个字符)
    return `${baseIndent + levelIndent}px`;
});

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