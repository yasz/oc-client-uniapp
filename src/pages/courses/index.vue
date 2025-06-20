<template>
    <view>
        <view style="background: linear-gradient(180deg, #FCCF29 0%, #ff9d00 100%)">
            <!-- 搜索栏容器 -->
            <view class="bg-primary px-4 pt-2 pb-3 rounded-bl-3xl rounded-br-3xl">
                <view class="flex w-[80%] mx-auto items-center bg-white rounded-full py-2 px-4 gap-3 shadow-sm">
                    <u-icon name="search" size="22" color="#999"></u-icon>
                    <input class="flex-1 text-sm text-gray-800 bg-transparent outline-none border-none"
                        v-model="searchKeyword" :placeholder="$t('searchCourses') || '搜索课程...'" />
                    <u-icon v-if="searchKeyword" name="close" size="22" color="#999" @click="clearSearch"></u-icon>
                </view>
            </view>
            <!-- 宣传内容容器 -->
            <view class="p-4">
                <view class="flex justify-between items-center text-white">
                    <view class="flex-1">
                        <view class="inline-block bg-white text-[#9b6310] py-3 px-5 rounded-full text-sm font-bold mb-4"
                            style="-webkit-text-stroke: 0.1px #523201">
                            成为本平台教师</view>

                        <view class="text-xl font-bold text-[#9b6310]" style="-webkit-text-stroke: 0.2px #523201">
                            中国语文海外学
                        </view>
                        <view style="-webkit-text-stroke: 0.1px #523201"
                            class="block text-[14px] font-black text-[#9b6310] leading-tight tracking-[2rpx] pr-6">
                            MERRY MANDARIN:<br />HAPPY AS A HIPPO</view>
                    </view>
                    <view class="w-32">
                        <image src="/static/courses/hippo_hi.png" mode="widthFix" class="w-full" />
                    </view>
                </view>
            </view>
        </view>

        <!-- <DotSwiper :imgUrls="swiperData" :eclick="(item) => go(`/courses/details?id=${item.id}`)"></DotSwiper> -->

        <div class="justify-evenly baseline">
            <div v-for="(item, index) in menuItems" :key="item.id" @click="toggleSelection(item.id)"
                class="flex-1 text-center flex flex-col justify-center items-center h-[80px]"
                :class="{ 'bg-[#f9c74f] rounded-[20px_2px_20px_2px] h-[40%]': selectedItem === item.id }">
                <div>{{ item.line1 }}</div>
                <div>{{ item.line2 }}</div>
            </div>
        </div>

        <view class="p-4 bg-gray-100">
            <!-- 遍历课程数据，生成卡片列表 -->
            <view v-for="(course, index) in filteredCourses" :key="index"
                class="flex items-start p-3 bg-white rounded-xl shadow-md mb-4"
                @click="go(`/courses/details?id=${course.id}`)">

                <!-- 左侧课程封面 -->
                <view
                    class="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden flex justify-center items-center bg-gray-50">
                    <u-image height="120" :src="course.cover" mode="aspectFit" />
                </view>

                <!-- 右侧课程信息 -->
                <view class="flex-1 ml-3 flex flex-col justify-between self-stretch">
                    <!-- Top part of right side -->
                    <view>
                        <!-- Title Row -->
                        <view class="flex justify-between items-start">
                            <text class="text-base font-bold text-gray-800 leading-tight">{{ course.name }}</text>
                            <view class="flex items-center flex-shrink-0 ml-2">
                                <view class="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">FREE
                                </view>
                                <u-icon name="arrow-right" color="#cccccc" class="ml-1"></u-icon>
                            </view>
                        </view>

                        <!-- English Name Tag -->
                        <view class="mt-1">
                            <text class="uppercase"
                                style="display: inline-block; border: 1px solid #f97316; color: #f97316; font-size: 0.75rem; font-weight: 600; padding: 1px 6px; border-radius: 6px;">
                                {{ course.name_en }}
                            </text>
                        </view>
                    </view>

                    <!-- Bottom part of right side -->
                    <view class="flex justify-end items-center">
                        <view class="flex items-center text-yellow-500">
                            <u-icon name="star-fill" color="rgb(245 158 11)" size="20"></u-icon>
                            <text class="text-sm text-gray-500 ml-1">收藏</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="bg-gray-100" style="height:300rpx;" />
        <Layout />
    </view>
</template>

<script lang="ts" setup>
import DotSwiper from '@/components/dotSwiper.vue';
import { listRecommendedCourseSessions, listCourseById, listCourseSessions, listCourses } from '@/utils/api';
import { go } from '@/utils/common';
import { onMounted, reactive, ref, computed } from 'vue';
import Layout from '../layout.vue';
import { useAuthStore } from '@/stores/authStore';

interface MenuItem {
    id: number;
    line1: string;
    line2: string;
}

// 搜索相关
const searchKeyword = ref('');

const clearSearch = () => {
    searchKeyword.value = '';
};

// 根据搜索关键词过滤课程 - 实时响应
const filteredCourses = computed(() => {
    if (!searchKeyword.value.trim()) {
        return courses;
    }

    const keyword = searchKeyword.value.toLowerCase().trim();
    return courses.filter(course => {
        const name = (course.name || '').toLowerCase();
        const name_en = (course.name_en || '').toLowerCase();
        const teacher = (course.teacher || '').toLowerCase();
        const subject = (course.subject || '').toLowerCase();

        return name.includes(keyword) ||
            name_en.includes(keyword) ||
            teacher.includes(keyword) ||
            subject.includes(keyword);
    });
});

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
    name_en: string;
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
        const authStore = useAuthStore();
        let courseData = response.data;
        if (!authStore.roles.includes('teacher')) {
            // Filter out teacher courses (category id 14)
            courseData = courseData.filter((e: any) => e.id !== 14);
        }

        const temp = courseData.filter((e: any) => e.children).flatMap((e: any) => {
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
    const authStore = useAuthStore();
    if (!authStore.roles.includes('teacher')) {
        menuItems.value = menuItems.value.filter(item => item.id !== 14);
    }

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

<style lang="scss" scoped></style>
