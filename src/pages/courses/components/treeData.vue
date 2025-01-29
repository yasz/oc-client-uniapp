<template>
    <template v-for="(item, index) in items" :key="item.id">
        <template v-if="item.children && item.children.length">
            <!-- 存在子节点 -->
            <uni-collapse-item class="children-item" :title="item.name" :open="true">
                <treeData v-if="item.children" :items="item.children" />
            </uni-collapse-item>
        </template>
        <template v-else>
            <!-- 叶子节点 -->
            <view class="flex baseline pl-20">
                <!-- <uni-icons type="checkbox" size="22" color="#9298a5"></uni-icons> -->
                <uni-icons type="circle" size="22" color="#9298a5"></uni-icons>
                <text class="children-item py-10 pl-10">{{ item.name }}</text>
                <up-icon @click="openAttachment(item.file_id?.url)" :name="getIconByType(item.file_id?.url)" size="22"
                    color="#9298a5" class="ml pr-40"></up-icon>
            </view>
        </template>
    </template>
</template>
<script lang="ts" setup>
import { ref } from "vue";

// Props
interface TreeDataItem {
    id: number;
    name: string;
    children?: TreeDataItem[];
    file_id?: { url: string };
}

const props = defineProps<{
    items: TreeDataItem[];
}>();

// 静态文件类型数组
const audioExtensions = ["mp3", "wav", "aac"];
const videoExtensions = ["mp4", "mov", "avi"];
const documentExtensions = ["pdf", "doc", "docx"];

/**
 * 打开附件
 * @param url 文件 URL
 */
const openAttachment = (url: string | undefined) => {
    if (!url) {
        console.warn("文件 URL 为空");
        return;
    }

    const extension = getFileExtension(url);

    if (audioExtensions.includes(extension)) {
        console.log("打开音频文件:", url);
        // 处理音频文件逻辑
    } else if (videoExtensions.includes(extension)) {
        console.log("打开视频文件:", url);
        uni.openDocument({
            filePath: import.meta.env.VITE_BUCKET_ENDPOINT + url,
            success: function (res) {
                console.log('打开文档成功');
            }
        });
        // 处理视频文件逻辑
    } else if (documentExtensions.includes(extension)) {
        console.log("打开文档文件:", url);
        uni.openDocument({
            filePath: import.meta.env.VITE_BUCKET_ENDPOINT + url,
            success: function (res) {
                console.log('打开文档成功');
            }
        });
        // 处理文档文件逻辑
    } else {
        console.log("下载文件:", url);
        // 默认处理逻辑
    }
};

/**
 * 根据文件后缀获取图标名称
 * @param url 文件 URL
 * @returns 图标名称
 */
const getIconByType = (url: string | undefined): string => {
    if (!url) return "download";

    const extension = getFileExtension(url);

    if (audioExtensions.includes(extension)) {
        return "volume"; // 音频图标
    } else if (videoExtensions.includes(extension)) {
        return "play-circle"; // 视频图标
    } else if (documentExtensions.includes(extension)) {
        return "file-text"; // 文档图标
    } else {
        return "download"; // 其他文件图标
    }
};

/**
 * 获取文件后缀
 * @param url 文件 URL
 * @returns 文件后缀
 */
const getFileExtension = (url: string): string => {
    return url.split(".").pop()?.toLowerCase() || "";
};
</script>


<style lang="scss">
::v-deep .is-open+.uni-collapse-item__wrap {
    height: auto !important;
}

.children-item {
    color: #9298a5;
    font-size: 24rpx;
    line-height: 20px;
}
</style>
