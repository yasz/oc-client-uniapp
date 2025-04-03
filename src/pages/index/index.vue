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
      <view v-for="(course, index) in courses" :key="index" class="course-card" @click="showCourseDetail(index)">
        <image :src="course.image" mode="aspectFit" class="course-icon" />
        <view class="course-text">
          <text class="course-name">{{ course.line1 }}</text>
          <text class="course-desc">{{ course.line2 }}</text>
        </view>
      </view>
    </view>

    <!-- 课程详情弹窗 -->
    <uni-popup ref="popup" :is-mask-click="true" type="center">
      <view class="popup-content">
        <image :src="currentCourse?.icon" mode="aspectFit" class="popup-icon" />
        <view class="popup-title">{{ currentCourse?.title }}</view>
        <view class="popup-divider"></view>
        <view class="popup-desc" v-html="currentCourse?.description"></view>
      </view>
    </uni-popup>

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
    line1: '小学语文',
    line2: '(部编版)',
    image: './src/static/index/图层 2.png'
  },
  {
    line1: 'YCT',
    line2: '标准课程',
    image: './src/static/index/图层 3.png'
  },
  {
    line1: 'HSK',
    line2: '标准课程',
    image: './src/static/index/图层 4.png'
  },
  {
    line1: '教师',
    line2: '课程',
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

interface CourseDetail {
  icon: string;
  title: string;
  description: string;
}


const currentCourse = ref<CourseDetail | null>(null);

const courseDetails: CourseDetail[] = [
  {
    icon: './src/static/index/图层 2.png',
    title: '小学语文（部编版）',
    description: `本课程提供中国现行的义务教育教科书，
即教育部编写的小学语文1-12册的相应学习和教学资源。

由于面向国际学习群体，在个别用词上进行"去国别化"处理。

私教课将安排富有小学教学经验的教师进行授课。

适合中文母语儿童进一步提高使用中文的能力，以及培养相应的文学修养。`
  },
  {
    icon: './src/static/index/图层 3.png',
    title: 'YCT标准课程',
    description: `本课程提供中国教育部中外语言合作中心发行，由高等教育出版社出版的YCT (Youth Chinese Test) 标准教程的学习和教学资源。

私教课老师均为中文母语者，且具备普通话水平二级乙等以上；高考语文高分者（卷面准确率在80%以上）。

适合中文零基础的儿童学习，帮助掌握初步掌握中文使用的能力。`
  },
  {
    icon: './src/static/index/图层 4.png',
    title: 'HSK标准课程',
    description: `本课程提供中国国家汉语办公室编写，北京语言大学出版社出版的HSK (汉语水平考试) 标准课程1-6级，共9册的相应学习和教学资源。

私教课老师均为中文母语者，且具备普通话水平二级乙等以上；高考语文高分者（卷面准确率在80%以上）。

适合非中文母语学习者，尤其是有汉语水平考试需求的成人及青少年，进行中文学习，以及备考汉语水平考试或相应国家的中文高考。`
  }
];

const popup: any = ref(null);

const showCourseDetail = (index: number) => {
  console.log(index)
  if (index < 3) { // 只处理前三个课程
    popup?.value?.open('center');
    currentCourse.value = courseDetails[index];

  }
};

const closePopup = () => {

  currentCourse.value = null;
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
  width: 90rpx;
  height: 90rpx;
  margin-bottom: 12rpx;
}

.course-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.course-name {
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
  text-align: center;
}

.course-desc {
  font-size: 20rpx;
  color: #666;
  margin-top: 4rpx;
  line-height: 1.2;
  text-align: center;
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

/* 添加弹窗样式 */
.popup-content {
  width: 600rpx;
  padding: 40rpx;
  background: #fff;
  border-radius: 20rpx;
}

.popup-icon {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto 20rpx;
  display: block;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20rpx;
}

.popup-divider {
  height: 4rpx;
  background: #FFB800;
  width: 60rpx;
  margin: 0 auto 30rpx;
}

.popup-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
  text-align: justify;
  white-space: pre-wrap;
}
</style>
