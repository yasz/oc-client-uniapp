<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { checkAuth } from "./router/interceptor";
onLaunch(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage?.route ? `/${currentPage.route}` : "/";

  // 执行校验逻辑
  checkAuth({ url });
  console.log("App Launch");
});
onShow(() => {

});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";
</style>