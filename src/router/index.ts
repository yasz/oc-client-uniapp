import { createRouter, __dynamicImportComponent__ } from "@/uni-simple-router";

const platform: any = process.env.VUE_APP_PLATFORM ?? "h5";
const router = createRouter({
  platform: platform,
  routes: [
    {
      path: `/`,
      component: __dynamicImportComponent__(`@/pages/index/index.vue`, {
        pageType: `top`,
        style: {
          navigationBarTitleText: `uni-simple-router`,
          navigationBarBackgroundColor: `#42b883`,
          navigationBarTextStyle: `white`,
          name: "index",
        },
      }),
    },
    {
      path: `/courses`,
      component: __dynamicImportComponent__(`@/pages/courses/index.vue`, {
        pageType: `top`,
        style: {
          navigationBarTitleText: `uni-simple-router`,
          navigationBarBackgroundColor: `#42b883`,
          navigationBarTextStyle: `white`,
          name: "courses",
        },
      }),
    },
    {
      path: `/sign-in`,
      component: __dynamicImportComponent__(`@/pages/sign-in.vue`, {
        pageType: `top`,
        style: {
          navigationBarTitleText: `sign-in`,
          navigationBarBackgroundColor: `#42b883`,
          navigationBarTextStyle: `white`,
          name: "sign-in",
        },
      }),
    },
    {
      path: `/my`,
      component: __dynamicImportComponent__(`@/pages/my/index.vue`, {
        pageType: `top`,
        style: {
          navigationBarTitleText: `my`,
          navigationBarBackgroundColor: `#42b883`,
          navigationBarTextStyle: `white`,
          name: "my",
        },
      }),
    },
  ],
});
router.beforeEach((to, from) => {
  if (!checkAuth(to.path)) {
    //如果目表页未通过验证，则跳向登录页

    return { path: "/sign-in" };
  }
  // 用户已经登录，继续导航
});
export default router;
function checkAuth(url: string) {
  // 白名单页面，不需要校验
  console.log("【调试】:【to", url, "】");
  if (["/", "/sign-in", "/my"].includes(url)) {
    return true;
  }

  const token = JSON.parse(uni.getStorageSync("authStore") || "{}").token;

  // 如果没有 token，跳转到登录页
  if (!token || token === "") {
    return false;
  }

  return true;
}
