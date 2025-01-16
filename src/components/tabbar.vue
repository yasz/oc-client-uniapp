<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  initialIndex: Number, // 父组件传递的初始值
});
const urls = ["index", "courses", "my"];
const index = ref(props.initialIndex || 0);
const change = (e: number) => {
  if (index.value != e) {
    // nextTick(() => { index.value = e })
    uni.switchTab({ url: `/pages/${urls[e]}/index` });
  }
};
</script>
<template>
  <view>
    <view class="mytab">
      <u-tabbar :border="false" :value="index" @change="change" fixed :placeholder="false" safeAreaInsetBottom
        activeColor="#d81e06">
        <u-tabbar-item :text="$t('index')" icon="star"></u-tabbar-item>
        <u-tabbar-item :text="$t('courses')" icon="pushpin"></u-tabbar-item>
        <u-tabbar-item :text="$t('my')" icon="account"></u-tabbar-item>
      </u-tabbar>
    </view>
  </view>
</template>
<style lang="scss">
.mytab view,
.mytab uni-view {
  background-color: rgba(247, 247, 247, 0.7) !important;
  padding-top: 2px;
}
</style>
