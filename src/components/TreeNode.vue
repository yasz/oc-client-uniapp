<template>
    <view>
        <uni-collapse-item v-if="node.children && node.children.length > 0" :title="node.name" :open="level <= 2">
            <TreeNode v-for="child in node.children" :key="child.path" :node="child" :level="level + 1"
                @open-attachment="$emit('open-attachment', $event)" />
        </uni-collapse-item>
        <view v-else-if="node.isFile" class="flex items-center pl-5">
            <text class="children-item py-2 pl-2 flex-1">{{ node.name }}</text>
            <up-icon :name="getIconByType(node.path)" size="22" color="#9298a5" class="ml-auto pr-3"
                @click="$emit('open-attachment', node.path)" />
        </view>
        <view v-else class="flex items-center pl-5">
            <text class="children-item py-2 pl-2 flex-1">{{ node.name }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
import { withDefaults } from 'vue';
import type { TreeNode } from '@/utils/xmlTreeParser';

withDefaults(defineProps<{
    node: TreeNode;
    level?: number;
}>(), {
    level: 1
});

defineEmits<{
    'open-attachment': [path: string];
}>();

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