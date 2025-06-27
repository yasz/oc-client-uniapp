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

                        <view v-if="!authStore.re_registered"
                            class="inline-block bg-white text-[#9b6310] py-3 px-5 rounded-full text-sm font-bold mb-4"
                            style="-webkit-text-stroke: 0.1px #523201" @click="handleReregisterClick">

                            {{ authStore.roles.includes('teacher') ? '成为本平台教师' : '我需要直播课' }}
                        </view>

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
            <!-- 课程列表 -->
            <template v-if="filteredCourses.length > 0">
                <CourseCard v-for="(course, index) in filteredCourses" :key="index" :course="course"
                    :is-favorited="isCourseFavorited(course.id)" :show-subject="false" />
            </template>

            <!-- 空状态提示 -->
            <template v-else>
                <view class="flex flex-col items-center justify-center py-2 px-2">
                    <view class="bg-white rounded-2xl p-4 shadow-sm max-w-md mx-auto">
                        <view class="text-center mb-6">
                            <text class="text-xl font-bold text-[#f9b33b] mb-2 block">欢迎来到Lifefun乐凡中文！</text>
                        </view>

                        <view class="space-y-4 text-gray-700 leading-relaxed">
                            <text class="block text-base">
                                我们致力于打造快乐的中文学习平台，使中文学习更有效、更轻松。
                            </text>

                            <text class="block text-base">
                                本平台的学生资源，面向对中文学习有兴趣/有需求的成人、青少年及孩童。欢迎使用免费资源，并咨询私教课的相关讯息。
                            </text>

                            <text class="block text-base">
                                同时，诚邀优秀的国际中文教师加入授课，本平台将提供免费的教师学习课程和教学资源。（👆 点击上方按钮）
                            </text>
                        </view>
                    </view>
                </view>
            </template>
        </view>
        <view class="bg-gray-100" style="height:300rpx;" />
        <Layout />

    </view>
</template>

<script lang="ts" setup>

import CourseCard from '@/components/CourseCard.vue';
import { listRecommendedCourseSessions, listCourseById, listCourseSessions, listCourses, listCourseFavorites, createCourseFavorite, deleteCourseFavorite } from '@/utils/api';
import { go } from '@/utils/common';
import { onMounted, reactive, ref, computed } from 'vue';
import Layout from '../layout.vue';
import { useAuthStore } from '@/stores/authStore';
interface MenuItem {
    id: number;
    line1: string;
    line2: string;
}

interface Course {
    id: number;
    name: string;
    teacher: string;
    subject: string;
    cover: string;
    price: number;
    name_en: string;
}

// 搜索相关
const searchKeyword = ref('');

const clearSearch = () => {
    searchKeyword.value = '';
};

// 收藏相关
const userFavorites = ref<number[]>([]); // 存储用户收藏的课程ID
const authStore = useAuthStore();

// 加载用户收藏列表
const loadUserFavorites = async () => {
    if (!authStore.userId) return;

    try {
        const response: any = await listCourseFavorites(Number(authStore.userId));
        if (response.data) {
            userFavorites.value = response.data.map((item: any) => Number(item.course_id.id));
        }
    } catch (error) {
        console.error('加载收藏列表失败:', error);
    }
};

// 处理课程点击
const handleCourseClick = (course: Course) => {
    go(`/courses/details?id=${course.id}`);
};

// 切换收藏状态
const toggleFavorite = async (courseId: number, event: Event) => {
    if (!authStore.userId) {
        uni.showToast({ title: '请先登录', icon: 'none' });
        return;
    }

    try {
        const isFavorited = userFavorites.value.includes(courseId);

        if (isFavorited) {
            // 取消收藏
            await deleteCourseFavorite(Number(authStore.userId), courseId);
            userFavorites.value = userFavorites.value.filter(id => id !== courseId);
            uni.showToast({ title: '已取消收藏', icon: 'success' });
        } else {
            // 添加收藏
            await createCourseFavorite(Number(authStore.userId), courseId);
            userFavorites.value.push(courseId);
            uni.showToast({ title: '收藏成功', icon: 'success' });
        }
    } catch (error) {
        console.error('收藏操作失败:', error);
        uni.showToast({ title: '操作失败，请重试', icon: 'none' });
    }
};

// 检查课程是否已收藏
const isCourseFavorited = (courseId: number) => {
    return userFavorites.value.includes(courseId);
};

// 根据搜索关键词过滤课程 - 实时响应
const filteredCourses = computed(() => {
    // 如果没有选中任何tab，返回空数组
    if (selectedItem.value === undefined) {
        return [];
    }

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


        const temp = courseData.filter((e: any) => e.children).flatMap((e: any) => {
            return e.children.map((child: any) => {
                return {
                    subject: e.name,
                    ...child,
                    cover: child.cover?.[0]?.url ?
                        `${import.meta.env.VITE_BUCKET_ENDPOINT}${child.cover[0].url}` :
                        '/static/images/default-cover.jpg'
                };
            });
        }).flat();

        console.log('【调试~~】:【', temp, '】');
        courses.splice(0, courses.length, ...temp); // Use splice to reset the courses array
    }
};
onMounted(async () => {
    const authStore = useAuthStore();
    if (!authStore.roles.includes('teacher') || (authStore.roles.includes('teacher') && !authStore.re_registered)) { //学生隐藏，老师隐藏未注册的
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

    // 加载用户收藏列表
    await loadUserFavorites();

    await fetchCoursesByMenuId(0);
});

const handleReregisterClick = () => {
    if (authStore.roles.includes('teacher')) {
        // 跳转到教师注册页面，传递参数表示这是重新注册
        go('/teacher-sign-up?from=reregister');
    } else {
        // 跳转到学生注册页面，传递参数表示这是重新注册
        go('/student-sign-up?from=reregister');
    }
};

</script>

<style lang="scss" scoped></style>
