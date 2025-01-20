import i18n from "@/lang";
import { createRouter, __dynamicImportComponent__ } from "@/uni-simple-router";
const { t }: any = i18n.global;
console.log("【调试】:【", t("courses"), "】");
const platform: any = process.env.VUE_APP_PLATFORM ?? "h5";
const soliRoutes = [
  {
    path: `/index`,
    component: __dynamicImportComponent__(`@/pages/index/index.vue`, {
      pageType: `top`,
      style: {
        navigationBarTitleText: `index`,
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
        // navigationBarTitleText: i18n.global.t("courses"),
        navigationBarTitleText: "courses",
        navigationBarBackgroundColor: `#42b883`,
        navigationBarTextStyle: `white`,
        name: "courses",
      },
    }),
  },
  {
    path: `/courses/details`,
    component: __dynamicImportComponent__(`@/pages/courses/details.vue`, {
      pageType: `top`,
      style: {
        // navigationBarTitleText: i18n.global.t("courses"),
        navigationBarTitleText: "coursesDetails",
        navigationBarBackgroundColor: `#42b883`,
        navigationBarTextStyle: `white`,
        name: "coursesDetails",
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
        navigationBarTitleText: `%my%`,
        navigationBarBackgroundColor: `#42b883`,
        navigationBarTextStyle: `white`,
        name: "my",
      },
    }),
  },
];

const router = createRouter({
  platform: platform,
  routes: [
    ...soliRoutes,
    {
      path: "/",
      redirect: "/index",
      component: __dynamicImportComponent__(`@/pages/layout.vue`, {
        pageType: `top`,
      }),
      children: [
        {
          path: "index",
          component: __dynamicImportComponent__(`@/pages/index/index.vue`),
        },
        {
          path: "my",
          component: __dynamicImportComponent__(`@/pages/my/index.vue`),
        },
        {
          path: "courses",
          component: __dynamicImportComponent__(`@/pages/courses/index.vue`),
        },
      ],
    },
  ],
  routeNotFound: (to) => {
    console.log(to);
    return {
      path: `/index`,
    };
  },
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
  if (["/index", "/sign-in", "/my"].includes(url)) {
    return true;
  }

  const token = uni.getStorageSync("authToken");

  // 如果没有 token，跳转到登录页
  if (!token || token === "") {
    return false;
  }

  return true;
}
