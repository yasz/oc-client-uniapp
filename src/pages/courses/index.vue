<template>
    <view>
        <!-- <DotSwiper :imgUrls="swiperData" :eclick="(item) => go(`/courses/details?id=${item.id}`)"></DotSwiper> -->


        <div class="justify-evenly baseline">
            <div v-for="(item, index) in menuItems" :key="item.id" @click="toggleSelection(item.id)"
                class="flex-col menu-item" :class="{ selected: selectedItem === item.id }">
                <div>{{ item.line1 }}</div>
                <div>{{ item.line2 }}</div>
            </div>
        </div>

        <view class="pd-14 bg-gray2">
            <!-- 遍历课程数据，生成卡片列表 -->
            <!-- {{ courses }} -->

            <view v-for="(course, index) in courses" :key="index" class="card-wrapper">

                <!-- 卡片内容 -->
                <view class="course-card" @click="go(`/courses/details?id=${course.id}`)">
                    <!-- 左侧课程封面 -->

                    <view class="course-cover ">
                        <u-image height="120" :src="course.cover" mode="aspectFit" />
                    </view>
                    <!-- 右侧课程信息 -->
                    <view class="course-info">
                        <!-- 课程名称 -->
                        <view class="text-bold t-14">{{ course.name }}</view>
                        <view class="pt-4 t-12 text-gray">{{ course.teacher }}</view>
                        <!-- <view class="pt-4 t-12 text-gray">{{ course.subject }}</view> -->
                        <!-- <view v-if="course.price && course.price != 0" class="pt-6 text-12 text-primary">¥ {{
                            course.price
                            }}.00</view>
                        <view v-else class="pt-6 text-12  text-green">{{ $t('free') }}</view> -->

                    </view>
                </view>
            </view>
        </view>
        <view class="bg-gray2" style="height:300rpx;" />
        <Layout />
    </view>
</template>

<script lang="ts" setup>
import DotSwiper from '@/components/dotSwiper.vue';
import { listRecommendedCourseSessions, listCourseById, listCourseSessions, listCourses } from '@/utils/api';
import { go } from '@/utils/common';
import { onMounted, reactive, ref } from 'vue';
import Layout from '../layout.vue';
interface MenuItem {
    id: number;
    line1: string;
    line2: string;
}

const toggleSelection = async (id: number) => {
    selectedItem.value = selectedItem.value === id ? undefined : id;
    await fetchCoursesByMenuId(selectedItem.value);
};
const selectedItem = ref<number | undefined>(undefined); // 当前选中的菜单项
const menuItems = ref<MenuItem[]>([
    { id: 12, line1: '小学语文', line2: '（部编版）' },
    { id: 11, line1: 'YCT', line2: '标准课程' },
    { id: 13, line1: 'HSK', line2: '标准课程' },
    { id: 14, line1: '教师', line2: '课程' }
]);

interface Course {
    id: number;
    name: string;
    teacher: string;
    subject: string;
    cover: string;
    price: number;
}
const courses = reactive<Course[]>([]);
const swiperData = reactive<{ image: string; title: string, id: number }[]>([]);

const fetchCoursesByMenuId = async (id: number | undefined) => {
    let response: any;
    if (id) {
        // Call listCourseById if a menu item is selected
        response = await listCourseById(id);
    } else {
        // Call listCourses if no specific menu item is selected
        response = await listCourses();
    }

    if (response.data) {
        const temp = response.data.filter((e: any) => e.children).flatMap((e: any) => {
            return e.children.map((child: any) => {
                return {
                    subject: e.name, ...child,
                    cover: import.meta.env.VITE_BUCKET_ENDPOINT + child.cover?.[0]?.url
                };
            });
        }).flat();

        console.log('【调试~~】:【', temp, '】');
        courses.splice(0, courses.length, ...temp); // Use splice to reset the courses array
    }
};
onMounted(async () => {


    const recommandSessionsResponse: any = await listRecommendedCourseSessions()
    if (recommandSessionsResponse.data) {
        swiperData.push(
            ...recommandSessionsResponse.data.map((item: any) => ({
                image: import.meta.env.VITE_BUCKET_ENDPOINT + item.course_session_id.cover?.[0]?.url || '/static/images/default-cover.jpg',
                title: item.course_session_id.name,
                id: item.course_session_id.id,
            }))
        );
    }
    await fetchCoursesByMenuId(0);
});


</script>

<style lang="scss" scoped>
.selected {
    background-color: #f9c74f;
    border-radius: 20px 2px 20px 2px;

    /* 确保背景色宽度为100% */
    height: 40%;
    /* 确保背景色占据整个高度 */
    // padding: 5px;
    /* 可以调整内边距以确保空间 */
}

/* 外部容器样式 */
.menu-container {
    background-color: #f9c74f;
    /* 可替换为您需要的颜色 */
    padding: 20px;
    /* 填充以增加空间 */
    border-radius: 20px;
    /* 圆角 */
    position: relative;
    /* 为了定位 */
}



/* 单个课程卡片容器（包含卡片本身和左上角教师标签） */
.card-wrapper {
    position: relative;
    margin-bottom: 20rpx;
}



/* 单个课程卡片样式 */
.course-card {
    display: flex;
    flex-direction: row;
    border-radius: 16rpx;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 左侧课程封面 */
.course-cover {
    width: 580rpx;
    height: 200rpx;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 右侧课程信息 */
.course-info {
    padding: 16rpx;
    width: 60vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.menu-item {
    flex: 1;
    /* Ensures each item takes up an equal amount of width */
    text-align: center;
    /* Centers the text inside each item */
    display: flex;
    /* 使用 Flexbox 布局 */
    flex-direction: column;
    justify-content: center;
    /* 垂直居中 */
    align-items: center;
    /* 水平居中 */
    height: 80px;
    /* 或其他固定高度 */
}
</style>
