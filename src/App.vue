<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useAuthStore } from "./stores/authStore";
import { getUserInfoWithSpecialToken } from "./utils/api";

onLaunch(async () => {
  const authStore = useAuthStore();

  // 先加载并验证token
  await authStore.loadTokenFromStorage();

  // 如果有有效的userId，再获取额外的用户信息
  if (authStore.userId) {
    try {
      const response = await getUserInfoWithSpecialToken(
        Number(authStore.userId)
      );
      const res = response.data;
      if (res?.data?.avatar?.[0]?.url) {
        authStore.avatar =
          import.meta.env.VITE_BUCKET_ENDPOINT + res.data.avatar[0].url;
      }
      // 存储用户创建时间
      if (res?.data?.createdAt) {
        authStore.createdAt = res.data.createdAt;
      }
      // 存储二次注册状态
      if (res?.data?.re_registered !== undefined) {
        authStore.nickname = res.data.nickname;
        authStore.re_registered = res.data.re_registered;
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
    }
  }
});

onShow(() => {
  // console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
// @import "./static/styles/iphone-frame.css";
@import "uview-plus/index.scss";

@font-face {
  font-family: "DIN-Regular";
  src: local("DIN-Regular"), local("DIN"),
    url("/static/fonts/din-regular.ttf") format("truetype");
}

@font-face {
  font-family: "SourceHanSansSC";
  src: local("思源黑体"), local("SourceHanSansSC-Regular"),
    url("/static/fonts/SourceHanSansSC-Regular.otf") format("opentype");
}

body,
html,
view {
  // 默认字体样式
  font-family: "DIN-Regular", "SourceHanSansSC", sans-serif;
}
</style>
