<template>
    <view class="pd-14">
        <!-- 遍历课程数据，生成卡片列表 -->
        <view v-for="(course, index) in courses" :key="index" class="course-card">
            <!-- 左侧课程封面 -->
            <view class="course-cover bg-gray2">
                <u-image height="120" :src="course.cover" mode="aspectFit" />
            </view>
            <!-- 右侧课程信息 -->
            <view class="course-info">
                <!-- 课程名称 -->
                <view class="text-bold t-14">{{ course.name }}</view>
                <view class="pt-4 t-12 text-gray">{{ course.subject }}</view>
                <view class="pt-6 text-12 text-primary">¥ {{ course.price }}.00</view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

// 课程数据
const courses = reactive([
    {
        cover: '/static/cover/1a.jpg',
        name: '人教',
        subject: '中文',
        teacher: '张老师',
        price: 199,
    },
    {
        cover: '/static/cover/2a.jpg',
        name: '英语语法课程',
        subject: '英语',
        teacher: '李老师',
        price: 299,
    },
    {
        cover: '/static/cover/piano.jpg',
        name: '钢琴入门课程',
        subject: '音乐',
        teacher: '王老师',
        price: 399,
    },
    {
        cover: '/static/course-history.jpg',
        name: '历史入门课程',
        subject: '历史',
        teacher: '赵老师',
        price: 249,
    },
    {
        cover: '/static/course-science.jpg',
        name: '科学实验课程',
        subject: '科学',
        teacher: '钱老师',
        price: 349,
    },
]);
</script>

<style lang="scss" scoped>
/* 外部容器样式 */

/* 单个课程卡片样式 */
.course-card {
    display: flex;
    flex-direction: row;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 左侧课程封面 */
.course-cover {
    width: 600rpx;
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
