<template>
    <view class="favorites-page">
        <!-- 由于路由中已设置导航栏，这里可以去掉自定义header或者在需要时保留 -->

        <!-- Search Bar -->
        <view class="bg-white px-4 py-3 border-b border-gray-100">
            <view class="flex items-center bg-gray-100 rounded-full py-2 px-4 gap-3">
                <u-icon name="search" size="22" color="#999"></u-icon>
                <input class="flex-1 text-sm text-gray-800 bg-transparent outline-none border-none"
                    v-model="searchKeyword" placeholder="搜索收藏的课程..." />
                <u-icon v-if="searchKeyword" name="close" size="22" color="#999" @click="clearSearch"></u-icon>
            </view>
        </view>

        <!-- Loading State -->
        <view v-if="loading" class="flex justify-center items-center py-12">
            <u-loading-icon mode="spinner" color="#f97316" size="30"></u-loading-icon>
            <text class="text-gray-500 ml-2">加载中...</text>
        </view>

        <!-- Empty State -->
        <view v-else-if="favoriteList.length === 0" class="flex flex-col items-center justify-center py-20">
            <u-icon name="star" color="#d1d5db" size="60" class="mb-4"></u-icon>
            <text class="text-gray-500 text-lg mb-2">暂无收藏的课程</text>
            <text class="text-gray-400 text-sm">去课程页面收藏感兴趣的课程吧</text>
            <u-button type="primary" shape="circle" class="mt-4" @click="goToCourses">
                浏览课程
            </u-button>
        </view>

        <!-- Course List -->
        <view v-else class="p-4 bg-gray-100 min-h-screen">
            <CourseCard v-for="(course, index) in filteredCourses" :key="course.id" :course="course"
                :is-favorited="true" :show-subject="true" />
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { listCourseFavorites, deleteCourseFavorite } from '@/utils/api';
import { go } from '@/utils/common';
import CourseCard from '@/components/CourseCard.vue';
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
const loading = ref(true);
const favoriteList = ref<Course[]>([]);
const authStore = useAuthStore();

const clearSearch = () => {
    searchKeyword.value = '';
};

// 根据搜索关键词过滤课程
const filteredCourses = computed(() => {
    if (!searchKeyword.value.trim()) {
        return favoriteList.value;
    }

    const keyword = searchKeyword.value.toLowerCase().trim();
    return favoriteList.value.filter(course => {
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

// 加载用户收藏列表
const loadFavorites = async () => {
    if (!authStore.userId) {
        uni.showToast({ title: '请先登录', icon: 'none' });
        return;
    }

    try {
        loading.value = true;
        const response: any = await listCourseFavorites(Number(authStore.userId));

        if (response.data && response.data.length > 0) {
            // 转换数据格式，提取课程信息
            favoriteList.value = response.data.map((item: any) => {
                const course = item.course_id;
                console.log('收藏课程原始数据:', course); // 调试信息
                console.log('课程封面数据:', course.cover); // 封面调试信息

                // 修复封面处理，参考课程列表页面的逻辑
                let coverUrl = '/static/images/default-cover.jpg';
                console.log('封面处理前 - course.cover:', course.cover);
                console.log('封面处理前 - course.cover?.[0]?.url:', course.cover?.[0]?.url);

                // 使用和课程列表页面相同的逻辑
                if (course.cover?.[0]?.url) {
                    coverUrl = `${import.meta.env.VITE_BUCKET_ENDPOINT}${course.cover[0].url}`;
                    console.log('封面处理后 - coverUrl:', coverUrl);
                } else {
                    console.log('没有找到封面，使用默认封面');
                }

                const processedCourse = {
                    id: course.id,
                    name: course.name || '',
                    name_en: course.name_en || '',
                    teacher: course.teacher || '',
                    subject: course.subject || '',
                    cover: coverUrl,
                    price: course.price || 0
                };

                console.log('处理后的课程数据:', processedCourse); // 调试信息
                return processedCourse;
            });
        } else {
            favoriteList.value = [];
        }
    } catch (error) {
        console.error('加载收藏列表失败:', error);
        uni.showToast({ title: '加载失败，请重试', icon: 'none' });
    } finally {
        loading.value = false;
    }
};

// 处理课程点击
const handleCourseClick = (course: Course) => {
    go(`/courses/details?id=${course.id}`);
};

// 取消收藏
const removeFavorite = async (courseId: number, event: Event) => {
    try {
        await deleteCourseFavorite(Number(authStore.userId), courseId);
        favoriteList.value = favoriteList.value.filter(course => course.id !== courseId);
        uni.showToast({ title: '已取消收藏', icon: 'success' });
    } catch (error) {
        console.error('取消收藏失败:', error);
        uni.showToast({ title: '操作失败，请重试', icon: 'none' });
    }
};

// 导航方法
const goBack = () => {
    uni.navigateBack();
};

const goToCourses = () => {
    go('/courses');
};

onMounted(async () => {
    await loadFavorites();
});
</script>

<style lang="scss" scoped>
.favorites-page {
    background-color: #f5f5f5;
    min-height: 100vh;
}

.header {
    background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%);
}
</style>