<template>
    <view class="flex items-start p-3 bg-white rounded-xl shadow-md mb-4" @click="handleCourseClick">

        <!-- 左侧课程封面 -->
        <view class="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden flex justify-center items-center bg-gray-50">
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
            <view class="flex justify-between items-center">
                <view class="text-sm text-gray-500" v-if="showSubject">
                    <text>{{ course.subject }}</text>
                </view>
                <view class="flex items-center gap-3">
                    <!-- 同步网盘按钮 - 仅admin可见 -->
                    <view v-if="authStore.roles.includes('admin')" class="flex items-center text-blue-500"
                        @click="handleSyncClick">
                        <u-icon name="reload" color="rgb(59 130 246)" size="18"></u-icon>
                        <text class="text-xs text-blue-500 ml-1">同步网盘</text>
                    </view>

                    <!-- 收藏按钮 -->
                    <view class="flex items-center text-yellow-500" @click="handleFavoriteClick">
                        <u-icon :name="isCurrentlyFavorited ? 'star-fill' : 'star'" color="rgb(245 158 11)"
                            size="20"></u-icon>
                        <text class="text-sm text-gray-500 ml-1">{{ favoriteText }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { createCourseFavorite, deleteCourseFavorite, syncCourseFromCDN } from '@/utils/api';
import { go } from '@/utils/common';

interface Course {
    id: number;
    name: string;
    teacher: string;
    subject: string;
    cover: string;
    price: number;
    name_en: string;
    path?: string;
}

const props = withDefaults(defineProps<{
    course: Course;
    isFavorited?: boolean;
    showSubject?: boolean;
}>(), {
    isFavorited: false,
    showSubject: true
});

const authStore = useAuthStore();
const isCurrentlyFavorited = ref(props.isFavorited);

const favoriteText = computed(() => {
    return isCurrentlyFavorited.value ? '取消收藏' : '收藏';
});

// 处理课程点击
const handleCourseClick = () => {
    go(`/courses/details?id=${props.course.id}`);
};

// 处理同步网盘点击
const handleSyncClick = async (event: Event) => {
    event.stopPropagation(); // 阻止事件冒泡

    if (!props.course.path) {
        uni.showToast({ title: '课程路径不存在', icon: 'none' });
        return;
    }

    uni.showModal({
        title: '确认同步',
        content: `确定要同步"${props.course.name}"的网盘内容吗？`,
        success: async (res) => {
            if (res.confirm) {
                uni.showLoading({ title: '正在同步...' });
                try {
                    await syncCourseFromCDN(props.course.id, props.course.path!);
                    uni.hideLoading();
                    uni.showToast({ title: '同步成功', icon: 'success' });
                } catch (error) {
                    uni.hideLoading();
                    console.error('同步失败:', error);
                    uni.showToast({ title: '同步失败，请重试', icon: 'none' });
                }
            }
        }
    });
};

// 处理收藏点击
const handleFavoriteClick = async (event: Event) => {
    event.stopPropagation(); // 阻止事件冒泡

    if (!authStore.userId) {
        uni.showToast({ title: '请先登录', icon: 'none' });
        return;
    }

    try {
        if (isCurrentlyFavorited.value) {
            // 取消收藏
            await deleteCourseFavorite(Number(authStore.userId), props.course.id);
            isCurrentlyFavorited.value = false;
            uni.showToast({ title: '已取消收藏', icon: 'success' });
        } else {
            // 添加收藏
            await createCourseFavorite(Number(authStore.userId), props.course.id);
            isCurrentlyFavorited.value = true;
            uni.showToast({ title: '收藏成功', icon: 'success' });
        }
    } catch (error) {
        console.error('收藏操作失败:', error);
        uni.showToast({ title: '操作失败，请重试', icon: 'none' });
    }
};
</script>

<style lang="scss" scoped>
// 可以添加特定的样式</style>