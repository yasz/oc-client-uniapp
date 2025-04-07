<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {

});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";

@font-face {
  font-family: 'DIN-Regular';
  src: local('DIN-Regular'), local('DIN'),
    url('/src/static/fonts/din-regular.ttf') format('truetype');
}

@font-face {
  font-family: 'SourceHanSansSC';
  src: local('思源黑体'), local('SourceHanSansSC-Regular'),
    url('/src/static/fonts/SourceHanSansSC-Regular.otf') format('opentype');
}

body,
html,
view {
  // 默认字体样式
  font-family: 'DIN-Regular', 'SourceHanSansSC', sans-serif;

}
</style>