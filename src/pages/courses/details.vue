<template>
    <view v-if="isDataLoaded">
        <u-image mode="aspectFit" width="100%" :src="coverURL" />
        <view class="container pd-20">

            <view class="section">
                <view class="flex-col">
                    <text class="text-gray text-8">{{ courseData.syllabus[0].name }}</text>
                    <text class="text-gray text-8 pt-10">{{ courseData.syllabus[0].children[0].name }}</text>
                </view>
            </view>

            <!-- Tabs 部分 -->
            <view class="container">
                <up-sticky bgColor="#fff" class="f-b-c ur-10" offset-top="-30">
                    <up-tabs v-model:current="currentTabIndex" @change="handleTabChange" :list="tabItems"
                        itemStyle="height:55px;width:130rpx" lineWidth="50">
                        <template v-slot:tab="{ item }">
                            <text>{{ item.name }}</text>
                        </template>
                    </up-tabs>
                </up-sticky>
            </view>



            <view class="tab-content">

                <component :is="tabItems[currentTabIndex].component" :content="tabContent"
                    v-if="currentTabIndex !== null" />
            </view>
        </view>
    </view>
    <view v-else class="loading-container">
        <text>加载中...</text>
    </view>
</template>

<script setup lang="ts">
import { listCourseById } from '@/utils/api';
import { onLoad } from '@dcloudio/uni-app';
import { computed, reactive, ref } from 'vue';
import SyllabusComponent from './components/syllabus.vue';

// 定义响应式变量
const courseData: any = reactive({});
const isDataLoaded = ref(false); // 数据加载完成标志

// 计算属性
const currentTabIndex = ref(0);

// 合并后的 Tab 选项和组件
const tabItems = [
    {
        name: 'Syllabus',
        component: SyllabusComponent,

    },
    // {
    //     name: 'Assignments',
    //     component: AssignmentsComponent,

    // },
];
const tabContent = computed(() => {
    return courseData[tabItems[currentTabIndex.value].name.toLowerCase()];
});
const coverURL = computed(() => {
    return import.meta.env.VITE_BUCKET_ENDPOINT + courseData.syllabus[0].children[0].cover[0].url;
})
// Tab 切换处理函数
function handleTabChange(event: any) {
    currentTabIndex.value = event.index;
}

// 页面加载时获取数据
const id = ref(0);
onLoad(async (e: any) => {
    id.value = +e.id;

    try {
        let response: any = await listCourseById(id.value);
        courseData.syllabus = response.data;
        courseData.assignments = response.data;

        isDataLoaded.value = true;
    } catch (error) {
        console.error('数据加载失败', error);
    }
});
</script>

<style scoped>
.f-b-c {
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background-color: #f5f5f5;
}

.section {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
}

.title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.progress-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.progress-text {
    margin-left: 10px;
    color: #333;
}

.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #fff;
}
</style>
