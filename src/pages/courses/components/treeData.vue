<template>
    <template v-for="(item, index) in items" :key="item.id">
        <template v-if="item.children && item.children.length">
            <!-- 存在子节点 -->
            <uni-collapse-item class="children-item" :title="item.name" :open="true">
                <treeData :items="item.children" />
            </uni-collapse-item>
        </template>
        <template v-else>
            <!-- 叶子节点 -->
            <view class="flex baseline pl-20">
                <!-- <uni-icons type="checkbox" size="22" color="#9298a5"></uni-icons> -->
                <uni-icons type="circle" size="22" color="#9298a5"></uni-icons>
                <text class="children-item py-10 pl-10">{{ item.name }}</text>
                <up-icon :name="getIconByType(item.file_id?.url)" size="22" color="#9298a5" class="ml pr-40"></up-icon>
            </view>
        </template>
    </template>
</template>

<script lang="ts">
export default {
    name: "treeData",
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
    methods: {
        /**
         * 根据文件后缀获取对应图标名称
         * @param {string} url 文件 URL
         * @returns {string} 图标名称
         */
        getIconByType(url: string): string {
            if (!url) return "download";

            const extension = url.split(".").pop()?.toLowerCase(); // 获取文件后缀

            // 判断后缀类型
            switch (extension) {
                case "mp3":
                case "wav":
                case "aac":
                    return "volume"; // 音频
                case "mp4":
                case "mov":
                case "avi":
                    return "play-circle"; // 视频
                case "pdf":
                case "doc":
                case "docx":
                    return "file-text"; // 文档
                default:
                    return "download"; // 其他类型
            }
        },
    },
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
