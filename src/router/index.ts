import { createRouter, __dynamicImportComponent__ } from "@/uni-simple-router";

const platform: any = process.env.VUE_APP_PLATFORM ?? "h5";
const router = createRouter({
  platform: platform,
  routes: [
    {
      path: `/`,
      component: __dynamicImportComponent__(`@/pages/index.vue`, {
        pageType: `top`,
        style: {
          navigationBarTitleText: `uni-simple-router`,
          navigationBarBackgroundColor: `#42b883`,
          navigationBarTextStyle: `white`,
        },
      }),
    },
  ],
});
export default router;
export function checkAuth(e: any) {
  let url = e.url.replace(/\?.*$/, "");

  // 白名单页面，不需要校验
  if (
    [
      "",
      "/pages/sign-in",
      "/pages/group/inviteGroup",
      "/pages/activity/preview",
      "/pages/my/index",
    ].includes(url)
  ) {
    return e;
  }

  // 获取 token
  const token = JSON.parse(uni.getStorageSync("authStore") || "{}").token;
  console.log("【调试】:【", uni.getStorageSync("authStore"), "】");

  // 如果没有 token，跳转到登录页
  if (!token || token === "") {
    uni.navigateTo({
      url: "/pages/sign-in",
    });
    return false;
  }

  return e;
}
