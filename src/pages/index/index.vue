<template>
  <view class="container">
    <!-- <view class="search-bar">
      <u-search v-model="searchKeyword" placeholder="SEARCH" />
    </view> -->

    <view class="welcome-section">
      <view class="pl-30" style="position: relative; z-index: 1;">
        <image src="/static/index/logo.png" mode="aspectFit" class="welcome-logo" />
      </view>
      <view class="welcome-text pt-60" style="margin-left: -100rpx; position: relative; z-index: 2;">
        <text class="welcome-title pr-6">WELCOME</text>
        <text class="welcome-subtitle">欢迎来到Lifefunner"乐凡中文"！</text>
      </view>
      <view class="donate-btn" @click="showDonatePopup">
        <text>支持/DONATE</text>
      </view>
    </view>

    <view class="course-grid">
      <view v-for="(course, index) in courses" :key="index" class="course-card" @click="showDetail('course', index)">
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
        <image :src="currentDetail?.icon" mode="aspectFit" class="popup-icon" />
        <view class="popup-title">{{ currentDetail?.title }}</view>
        <view class="popup-divider"></view>
        <view class="popup-desc" v-html="currentDetail?.description"></view>
      </view>
    </uni-popup>

    <view class="moments-section">
      <text class="section-title">精彩时刻</text>
      <view class="moments-grid pt-20">
        <view v-for="(moment, index) in moments" :key="index" class="moment-card" @click="showDetail('moment', index)">
          <image :src="moment.image" mode="aspectFill" class="moment-image" />
          <text class="moment-desc">{{ moment.description }}</text>
        </view>
      </view>
    </view>

    <!-- 捐赠弹窗 -->
    <uni-popup ref="donatePopup" :is-mask-click="true" type="center">
      <view class="donate-popup">
        <view class="donate-popup-header">
          <text class="donate-popup-title">支持/Donate</text>
          <text class="donate-popup-close" @click="donatePopup.close()">×</text>
        </view>
        <view class="donate-popup-divider"></view>
        <view class="donate-qr-container">
          <view class="donate-qr-item">

            <view class="donate-qr-wrapper wechat">
              <image src="/static/index/wechat.png" mode="aspectFit" class="donate-qr" />
            </view>
          </view>
          <view class="donate-qr-item">

            <view class="donate-qr-wrapper alipay">
              <image src="/static/index/alipay.png" mode="aspectFit" class="donate-qr" />
            </view>
          </view>
        </view>
        <view>验证提示：马*乐</view>
        <view class="donate-message">

          感谢您的赠予！
          <text class="donate-poem">投我以木桃，报之以琼瑶。</text>
          我们将以热忱的工作和教学回馈您的
          信任和支持。
        </view>
      </view>
    </uni-popup>

    <Layout />
  </view>
</template>

<script setup lang="ts">
import {
  go
} from "@/utils/common";
import { listCMSByIds } from "@/utils/api";

import { useI18n } from 'vue-i18n';
import Layout from "../layout.vue";
import { ref, onMounted } from 'vue';

const { t, locale } = useI18n();
const searchKeyword = ref('');
const currentTab = ref('home');

interface Course {
  line1: string;
  line2: string;
  image: string;
}

interface CMSItem {
  id: number;
  title: string;
  sub_title: string;
  content: string;
  cover: any[];
}

const courses = ref<Course[]>([]);
const cmsData = ref<CMSItem[]>([]);
const moments = ref<{ image: string; description: string; content: string }[]>([]);

// 获取所有课程信息
const fetchCourses = async () => {
  try {
    const response: any = await listCMSByIds([1, 2, 3, 4]);
    if (response?.data) {
      cmsData.value = response.data;
      // 转换数据格式
      courses.value = response.data.map((item: any) => ({
        line1: item.title,
        line2: item.sub_title,
        image: item.cover?.[0] ? `${import.meta.env.VITE_BUCKET_ENDPOINT}${item.cover[0].url}` : ''
      }));
    }
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  }
};

// 获取精彩时刻
const fetchMoments = async () => {
  try {
    const response: any = await listCMSByIds([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    if (response?.data) {
      moments.value = response.data.map((item: any) => ({
        image: item.cover?.[0] ? `${import.meta.env.VITE_BUCKET_ENDPOINT}${item.cover[0].url}` : '',
        description: item.title,
        content: item.content
      }));
    }
  } catch (error) {
    console.error('Failed to fetch moments:', error);
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchCourses();
  fetchMoments();
});


interface DetailItem {
  icon: string;
  title: string;
  description: string;
}

const currentDetail = ref<DetailItem | null>(null);
const popup: any = ref(null);
const donatePopup: any = ref(null);

const showDetail = async (type: 'course' | 'moment', index: number) => {
  try {
    if (type === 'course') {
      if (cmsData.value[index]) {
        const courseDetail = cmsData.value[index];
        currentDetail.value = {
          icon: courseDetail.cover?.[0] ? `${import.meta.env.VITE_BUCKET_ENDPOINT}${courseDetail.cover[0]?.url}` : '',
          title: courseDetail.title + courseDetail.sub_title,
          description: courseDetail.content
        };
      }
    } else {
      if (moments.value[index]) {
        const momentDetail = moments.value[index];
        currentDetail.value = {
          icon: momentDetail.image,
          title: momentDetail.description,
          description: momentDetail.content
        };
      }
    }
    popup.value?.open();
  } catch (error) {
    console.error('Failed to show detail:', error);
  }
};

const showDonatePopup = () => {
  donatePopup.value?.open();
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
  background: linear-gradient(180deg, #FFB800 0%, #ff9d00 100%);

  position: relative;
  display: flex;
  align-items: center;
  gap: 10rpx;
  height: 280rpx;
}

.welcome-logo {
  width: 280rpx;
  height: 280rpx;
  flex-shrink: 0;
}

.welcome-text {
  flex: 1;
  text-align: right;
}

.welcome-title {
  font-size: 56rpx;
  font-weight: 900;
  color: #9b6310;
  display: block;
  line-height: 1.2;
  letter-spacing: 2rpx;
  -webkit-text-stroke: 0.3px #523201;
}

.welcome-subtitle {
  font-size: 28rpx;
  font-weight: 500;
  color: #8B4513;
  line-height: 1.4;
  letter-spacing: 1rpx;
  display: block;
  margin-top: 8rpx;
  -webkit-text-stroke: 0.7px #523201;
}

.donate-btn {
  background-color: #fff;
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  position: absolute;
  right: 40rpx;
  top: 40rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  color: #523201;
  text-shadow: 0 0 10rpx rgba(255, 184, 0, 0.3);
  font-weight: 900;
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
