<template>
    <view>
        <DotSwiper :imgUrls="[{ image: '/static/cover/ct.jpg', title: '圣约神学历史' }
            , { image: '/static/cover/piano.jpg', title: '现代和声编配——实战' }
            , { image: '/static/cover/dt.jpg', title: '《多特信条》领读' }
        ]"></DotSwiper>
        <view class="pd-14 bg-gray2">
            <!-- 遍历课程数据，生成卡片列表 -->
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
                        <view class="pt-4 t-12 text-gray">{{ course.subject }}</view>
                        <view v-if="course.price && course.price != 0" class="pt-6 text-12 text-primary">¥ {{
                            course.price
                        }}.00</view>
                        <view v-else class="pt-6 text-12  text-green">{{ $t('free') }}</view>

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
import { listCourseSessions } from '@/utils/api';
import { go } from '@/utils/common';
import { onMounted, reactive } from 'vue';
import Layout from '../layout.vue';
interface Course {
    id: number;
    name: string;
    teacher: string;
    subject: string;
    cover: string;
    price: number;
}
const courses = reactive<Course[]>([]);

onMounted(async () => {
    const response: any = await listCourseSessions();

    if (response.data) {
        // 转换数据格式
        courses.push(
            ...response.data.map((item: any) => {
                const res = {
                    id: item.id,
                    name: item.name,
                    teacher: item.teacher_id.nickname,
                    subject: item.subject_id.name,
                    cover: import.meta.env.VITE_BUCKET_ENDPOINT + item.cover?.[0]?.url || '/static/images/default-cover.jpg',
                    price: item.price || 0 // 假设有价格字段
                }

                return res

            })
        );
    }
});
// 课程数据

</script>

<style lang="scss" scoped>
/* 外部容器样式 */

/* 单个课程卡片容器（包含卡片本身和左上角教师标签） */
.card-wrapper {
    position: relative;
    margin-bottom: 20rpx;
}

/* 左上角教师标签 */


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
</style>
