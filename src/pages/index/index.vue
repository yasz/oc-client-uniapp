<template>
  <view class="container">
    <view class="search-bar">
      <u-search v-model="searchKeyword" placeholder="SEARCH" />
    </view>
    <view class="welcome-section">
      <text class="welcome-title">WELCOME</text>
      <text class="welcome-subtitle">欢迎来到Lifefun"乐凡中文"！</text>
      <view class="donate-btn">支持/DONATE</view>
    </view>

    <view class="course-grid">
      <view v-for="(course, index) in courses" :key="index" class="course-card">
        <image :src="course.image" mode="aspectFit" class="course-icon" />
        <text class="course-name">{{ course.name }}</text>
        <text class="course-desc">{{ course.description }}</text>
      </view>
    </view>

    <view class="moments-section">
      <text class="section-title">精彩时刻</text>
      <view class="moments-grid">
        <view v-for="(moment, index) in moments" :key="index" class="moment-card">
          <image :src="moment.image" mode="aspectFill" class="moment-image" />
          <text class="moment-desc">{{ moment.description }}</text>
        </view>
      </view>
    </view>

    <Layout />
  </view>
</template>

<script setup lang="ts">
import {
  go
} from "@/utils/common";

import { useI18n } from 'vue-i18n';
import Layout from "../layout.vue";
import { ref } from 'vue';

const { t, locale } = useI18n();
const searchKeyword = ref('');
const currentTab = ref('home');

const courses = ref([
  {
    name: '小学语文',
    description: '(部编版)',
    image: './src/static/index/图层 2.png'
  },
  {
    name: 'YCT',
    description: '标准课程',
    image: './src/static/index/图层 3.png'
  },
  {
    name: 'HSK',
    description: '标准课程',
    image: './src/static/index/图层 4.png'
  },
  {
    name: '教师',
    description: '课程',
    image: './src/static/index/图层 5.png'
  }
]);

const moments = ref([
  {
    image: '/static/moments/moment1.jpg',
    description: '老师们的线下活动'
  },
  {
    image: '/static/moments/moment2.jpg',
    description: '老师们的线下活动'
  },
  {
    image: '/static/moments/moment3.jpg',
    description: '在录制课程的老师'
  },
  {
    image: '/static/moments/moment4.jpg',
    description: '欧洲孔子学院培训的老师'
  }
]);

const switchTab = (tab: string) => {
  currentTab.value = tab;
};
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 100rpx;
}

.search-bar {
  background-color: #FF7F50;
  padding: 20rpx;
}

.welcome-section {
  background-color: #FFB800;
  padding: 30rpx;
  position: relative;
}

.welcome-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #875304;
  display: block;
}

.welcome-subtitle {
  font-size: 32rpx;
  color: #875304;
  margin-top: 10rpx;
  display: block;
}

.donate-btn {
  background-color: #fff;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  position: absolute;
  right: 30rpx;
  top: 30rpx;
}

.course-grid {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
}

.course-card {
  flex: 1;
  margin: 0 10rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 15rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
}

.course-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.course-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.course-desc {
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}

.moments-section {
  padding: 30rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  color: #333;
}

.moments-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.moment-card {
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
}

.moment-image {
  width: 100%;
  height: 200rpx;
  object-fit: cover;
}

.moment-desc {
  font-size: 24rpx;
  color: #666;
  padding: 10rpx;
  display: block;
  text-align: center;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1rpx solid #eee;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #999;
}

.tab-item.active {
  color: #FF7F50;
}

.tab-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 6rpx;
}
</style>
