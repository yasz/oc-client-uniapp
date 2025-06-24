<template>
    <view v-if="isDataLoaded" class="flex flex-col w-[100vw]">
        <u-image mode="aspectFit" width="100%" :src="coverURL" />

        <view class=" flex-1 flex flex-col pt-4 px-4 py-8 bg-gray-100">

            <view class="bg-white mt-4 p-3 rounded-lg shadow ">
                <view class="flex flex-col">
                    <text class="text-gray-600 text-sm">{{ courseData.name }}</text>
                    <text class="text-gray-800 text-lg font-bold mt-1">{{ courseData.name_en }}</text>
                </view>
            </view>

            <!-- Tabs 部分 -->
            <view class="mt-4">
                <up-sticky bgColor="#f5f5f5">
                    <up-tabs :list="tabItems" @change="handleTabChange" :scrollable="false" lineWidth="30"></up-tabs>
                </up-sticky>
            </view>
            <view class="mt-4 flex justify-center flex-1 overflow-y-auto">
                <view class="w-[95%]">
                    <SyllabusComponent :content="courseData.cos_xml"
                        v-if="currentTabIndex === 0 && courseData.cos_xml" />
                    <view v-if="currentTabIndex === 1" class="prose bg-white p-4 rounded-lg shadow">
                        <div v-if="courseData.content" v-html="courseData.content"></div>
                        <text v-else>暂无内容</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
    <view v-else class="flex items-center justify-center h-screen bg-white">
        <text>加载中...</text>
    </view>
</template>

<script setup lang="ts">
import { getCourseById } from '@/utils/api';
import { onLoad } from '@dcloudio/uni-app';
import { computed, reactive, ref } from 'vue';
import SyllabusComponent from './components/syllabus.vue';

// 定义响应式变量
const courseData = ref<any>({});
const isDataLoaded = ref(false);

const currentTabIndex = ref(0);

const tabItems = [{ name: 'Syllabus' }, { name: 'Introduction' }];

const coverURL = computed(() => {
    if (courseData.value?.cover?.[0]?.url) {
        return import.meta.env.VITE_BUCKET_ENDPOINT + courseData.value.cover[0].url;
    }
    return ''; // 或者一个默认图片的 URL
});

function handleTabChange(event: any) {
    currentTabIndex.value = event.index;
}

onLoad(async (e: any) => {
    if (e.id) {
        try {
            const response: any = await getCourseById(e.id);
            if (response.data) {
                courseData.value = response.data;
                isDataLoaded.value = true;
            } else {
                console.error('未能获取课程数据');
            }
        } catch (error) {
            console.error('数据加载失败', error);
        }
    }
});
</script>

<style scoped>
/* 使用Tailwind类替代自定义CSS */
</style>
