<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useAuthStore } from "./stores/authStore";
import axios from "axios";
onLaunch(async () => {
  const authStore = useAuthStore();
  if (authStore.userId) {
    // 获取用户头像
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/users:get?appends[]=avatar&filterByTk=${authStore.userId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SPECIAL_TOKEN}`,
          },
        }
      );
      const res = response.data;
      if (res?.data?.avatar?.[0]?.url) {
        authStore.avatar =
          import.meta.env.VITE_BUCKET_ENDPOINT + res.data.avatar[0].url;
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
    }
  }
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";

@font-face {
  font-family: "DIN-Regular";
  src: local("DIN-Regular"), local("DIN"),
    url("/src/static/fonts/din-regular.ttf") format("truetype");
}

@font-face {
  font-family: "SourceHanSansSC";
  src: local("思源黑体"), local("SourceHanSansSC-Regular"),
    url("/src/static/fonts/SourceHanSansSC-Regular.otf") format("opentype");
}

body,
html,
view {
  // 默认字体样式
  font-family: "DIN-Regular", "SourceHanSansSC", sans-serif;
}
</style>
