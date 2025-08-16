<template>
  <view class="min-h-screen bg-white pb-[100rpx]">
    <!-- <view class="bg-[#f8ae3d] p-[20rpx]">
      <u-search v-model="searchKeyword" placeholder="SEARCH" />
    </view> -->

    <view class="relative flex items-center gap-[10rpx] h-[280rpx]"
      style="background: linear-gradient(180deg, #ffb800 0%, #ff9d00 100%)">
      <view class="pl-30" style="position: relative; z-index: 1">
        <image src="/static/index/logo.png" mode="aspectFit" class="w-[280rpx] h-[280rpx] flex-shrink-0" />
      </view>
      <view class="flex-1 text-right pt-60" style="margin-left: -100rpx; position: relative; z-index: 2">
        <text class="block text-[56rpx] font-black text-[#9b6310] leading-tight tracking-[2rpx] pr-6"
          style="-webkit-text-stroke: 0.3px #523201">WELCOME</text>
        <text class="block text-[28rpx] font-medium text-[#8b4513] leading-snug tracking-[1rpx] mt-[8rpx]"
          style="-webkit-text-stroke: 0.7px #523201">欢迎来到Lifefunner乐凡中文！</text>
      </view>
      <view style="
          z-index: 3;
          text-shadow: 0 0 10rpx rgba(255, 184, 0, 0.3);
          box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
        "
        class="absolute top-[40rpx] right-[40rpx] bg-white py-[16rpx] px-[32rpx] rounded-[40rpx] text-[28rpx] flex items-center gap-[10rpx] text-[#523201] font-black"
        @click="showDonatePopup">
        <text>支持/DONATE</text>
      </view>
    </view>

    <view class="flex justify-between p-[30rpx]">
      <view v-for="(course, index) in courses" :key="index"
        class="flex-1 mx-[10rpx] bg-white rounded-[20rpx] p-[15rpx] flex flex-col items-center shadow-sm first:ml-0 last:mr-0"
        @click="showDetail('course', index)">
        <image :src="course.image" mode="aspectFit" class="w-[90rpx] h-[90rpx] mb-[12rpx]" />
        <view class="flex flex-col prose items-center">
          <text class="text-[24rpx] font-bold text-gray-800 leading-tight text-center">{{
            course.line1
          }}</text>
          <text class="text-[20rpx] text-gray-500 mt-[4rpx] leading-tight text-center">{{ course.line2 }}</text>
        </view>
      </view>
    </view>

    <!-- 课程详情弹窗 -->
    <uni-popup ref="popup" :is-mask-click="true" type="center">
      <view class="w-[600rpx] p-[40rpx] bg-white rounded-[20rpx] max-h-[80vh] overflow-y-auto">
        <image :src="currentDetail?.icon" mode="aspectFit" class="block w-[120rpx] h-[120rpx] mx-auto mb-[20rpx]" />
        <view class="text-[32rpx] font-bold text-gray-800 text-center mb-[20rpx]">{{
          currentDetail?.title
        }}</view>
        <view class="h-[4rpx] bg-[#ffb800] w-[60rpx] mx-auto mb-[30rpx]"></view>
        <view class="text-[28rpx] text-gray-500 leading-[1.8] text-justify" style="text-indent: 2em;"
          v-html="currentDetail?.description"></view>
      </view>
    </uni-popup>

    <!-- 通告说明 -->
    <view class="p-[30rpx]">
      <text class="text-[36rpx] font-bold mb-[30rpx] text-gray-800">通告说明</text>
      <view class="grid grid-cols-2 gap-[20rpx]">
        <view v-for="(moment, index) in announcements" :key="index" class="bg-white rounded-[10rpx] overflow-hidden"
          @click="showDetail('moment', index)">
          <image :src="moment.image" mode="aspectFill" class="w-full h-[200rpx] object-cover" />
          <text class="block text-[24rpx] text-gray-500 p-[10rpx] text-center">{{
            moment.description
          }}</text>
        </view>
      </view>
    </view>

    <!-- 精彩时刻 -->
    <view class="p-[30rpx] pt-0">
      <text class="text-[36rpx] font-bold mb-[30rpx] text-gray-800">精彩时刻</text>
      <view class="grid grid-cols-2 gap-[20rpx]">
        <view v-for="(moment, index) in highlights" :key="index" class="bg-white rounded-[10rpx] overflow-hidden"
          @click="showDetail('moment', index + 2)">
          <image :src="moment.image" mode="aspectFill" class="w-full h-[200rpx] object-cover" />
          <text class="block text-[24rpx] text-gray-500 p-[10rpx] text-center">{{
            moment.description
          }}</text>
        </view>
      </view>
    </view>

    <!-- 捐赠弹窗 -->
    <uni-popup ref="donatePopup" :is-mask-click="true" type="center">
      <view class="w-[600rpx] p-[40rpx] bg-white rounded-[20rpx] max-h-[80vh] overflow-y-auto">
        <view class="text-[32rpx] font-bold text-gray-800 text-center mb-[20rpx]">支持/Donate</view>
        <view class="h-[4rpx] bg-[#ffb800] w-[60rpx] mx-auto mb-[30rpx]"></view>
        <view class="flex justify-center gap-[10px] my-[30rpx]">
          <image src="/static/index/wechat.png" style="width: 480rpx; height: 360rpx" />
          <image src="/static/index/alipay.png" style="width: 480rpx; height: 360rpx" />
        </view>
        <view class="text-xs text-gray-500 text-center">验证提示：马*乐</view>
        <view class="my-[30rpx] text-center">
          <!-- <view class="text-center text-gray-600 text-sm mb-2">海外银行捐赠 / Overseas Bank Donation</view> -->
          <view class="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 text-left">
            <view class="flex justify-between items-center">
              <view class="truncate">
                <text class="font-semibold">IBAN: </text>
                <text>IE08AIBK93113695034032</text>
              </view>
              <button @click="copyText('IE08AIBK93113695034032')"
                class="text-xs bg-gray-200 px-2 py-1 rounded ml-2 whitespace-nowrap">
                复制
              </button>
            </view>
            <view class="mt-1">
              <text class="font-semibold">Name: </text>
              <text>Ma Yile</text>
            </view>
          </view>
        </view>

        <view class="flex flex-col items-center">

          <view class="text-sm pt-5 font-semibold">感谢您的赠予！</view>
          <text class="text-sm">投我以木桃，报之以琼瑶。</text>
          <text class="text-sm">我们将以热忱的工作和教学回馈您的</text>
          <text class="text-sm">信任和支持。</text>
        </view>
      </view>
    </uni-popup>

    <Layout />
  </view>
</template>

<script setup lang="ts">
import { listCMSByIds } from "@/utils/api";

import { useI18n } from "vue-i18n";
import Layout from "../layout.vue";
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
const { t, locale } = useI18n();
const searchKeyword = ref("");
const currentTab = ref("home");

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

const announcements = computed(() => moments.value.slice(0, 2));
const highlights = computed(() => moments.value.slice(2));

// 获取所有课程信息
const fetchCourses = async () => {
  try {
    // 向所有用户开放全部课程
    const ids = [1, 2, 3, 4];
    const response: any = await listCMSByIds(ids);

    if (response?.data) {
      cmsData.value = response.data;
      // 转换数据格式
      courses.value = response.data.map((item: any) => ({
        line1: item.title,
        line2: item.sub_title,
        image: item.cover?.[0]
          ? `${import.meta.env.VITE_BUCKET_ENDPOINT}${item.cover[0].url}`
          : "",
      }));
    }
  } catch (error) {
    console.error("Failed to fetch courses:", error);
  }
};

// 获取精彩时刻
const fetchMoments = async () => {
  try {
    const response: any = await listCMSByIds([
      6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    ]);
    if (response?.data) {
      moments.value = response.data.map((item: any) => ({
        image: item.cover?.[0]
          ? `${import.meta.env.VITE_BUCKET_ENDPOINT}${item.cover[0].url}`
          : "",
        description: item.title,
        content: item.content,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch moments:", error);
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

const showDetail = async (type: "course" | "moment", index: number) => {
  try {
    if (type === "course") {
      if (cmsData.value[index]) {
        const courseDetail = cmsData.value[index];
        currentDetail.value = {
          icon: courseDetail.cover?.[0]
            ? `${import.meta.env.VITE_BUCKET_ENDPOINT}${courseDetail.cover[0]?.url
            }`
            : "",
          title: courseDetail.title + courseDetail.sub_title,
          description: courseDetail.content,
        };
        popup.value?.open();
      }
    } else {
      if (moments.value[index]) {
        const momentDetail = moments.value[index];
        // 只有当文章有内容时才显示弹窗
        if (momentDetail.content?.trim()) {
          currentDetail.value = {
            icon: momentDetail.image,
            title: momentDetail.description,
            description: momentDetail.content,
          };
          popup.value?.open();
        }
      }
    }
  } catch (error) {
    console.error("Failed to show detail:", error);
  }
};

const showDonatePopup = () => {
  donatePopup.value?.open();
  console.log(donatePopup.value);
};

const copyText = (text: string) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({
        title: "已复制",
        icon: "success",
      });
    },
  });
};
</script>

<style>
.prose p {
  text-indent: 2em;
}
</style>