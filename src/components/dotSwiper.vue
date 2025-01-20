<template>
  <div class="numeric-indicator fixed">
    {{ currentSwiperPage + 1 }}/{{ imgUrls.length }}
  </div>

  <view class="aswiper">
    <u-swiper @click="invokeClick" keyName="image" showTitle :interval="5000" :list="imgUrls"
      @change="(e: any) => (currentSwiperPage = e.current)" indicator circular :duration="500"
      indicatorStyle="bottom: 20px" indicatorMode="line" indicatorActiveColor="gray" :width="`${viewportWidth * 2}rpx`"
      :height="`${viewportWidth}rpx`" imgMode="aspectFit"></u-swiper>
  </view>
</template>

<script setup lang="ts">
import { getViewportWidth } from "@/utils/common";
import { ref } from "vue";

// 图片点击预览
const invokeClick = (e: any) => {
  e = e ? e : 0;
  console.log("【调试】:【", e, imgUrls.value[e], "】");
  uni.previewImage({ urls: imgUrls.value.map((item: any) => item.image), current: e });
};

// 当前轮播图页码
const currentSwiperPage = ref(0);

// 视口宽度
const viewportWidth = ref();

// 接收外部传入的属性
const props: any = defineProps({
  imgUrls: Array, // 外部传入的轮播图数组，包含图片和标题
  eclick: Function, // 其他可能需要的属性
});

// 图片列表
const imgUrls: any = ref([]);

// 初始化方法
const init = async () => {
  let unitUrls: any = props.imgUrls;
  imgUrls.value = unitUrls;
  viewportWidth.value = await getViewportWidth();
};
init();
</script>

<style>
.numeric-indicator {
  right: 30rpx;
  top: 60rpx;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 24rpx;
  padding: 8rpx 12rpx;
  border-radius: 16rpx;
  text-align: center;
  z-index: 10;
}
</style>
