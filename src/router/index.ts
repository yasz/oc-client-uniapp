import { createRouter, __dynamicImportComponent__ } from "@/uni-simple-router";

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
        navigationBarTitleText: "CourseDetailPage",
        navigationBarBackgroundColor: `#42b883`,
        navigationBarTextStyle: `white`,
        name: "CourseDetailPage",
      },
    }),
  },
  {
    path: `/courses/sessionDetails`,
    component: __dynamicImportComponent__(
      `@/pages/courses/sessionDetails.vue`,
      {
        pageType: `top`,
        style: {
          // navigationBarTitleText: i18n.global.t("courses"),
          navigationBarTitleText: "CourseSessionDetailPage",
          navigationBarBackgroundColor: `#42b883`,
          navigationBarTextStyle: `white`,
          name: "CourseSessionDetailPage",
        },
      }
    ),
  },
  {
    path: `/courses/assignmentDetails`,
    component: __dynamicImportComponent__(
      `@/pages/courses/assignmentDetails.vue`,
      {
        pageType: `top`,
        style: {
          // navigationBarTitleText: i18n.global.t("courses"),
          navigationBarTitleText: "assignmentDetails",
          navigationBarBackgroundColor: `#42b883`,
          navigationBarTextStyle: `white`,
          name: "assignmentDetails",
        },
      }
    ),
  },
  {
    path: `/courses/discussionDetails`,
    component: __dynamicImportComponent__(
      `@/pages/courses/discussionDetails.vue`,
      {
        pageType: `top`,
        style: {
          // navigationBarTitleText: i18n.global.t("courses"),
          navigationBarTitleText: "discussionDetails",
          navigationBarBackgroundColor: `#42b883`,
          navigationBarTextStyle: `white`,
          name: "discussionDetails",
        },
      }
    ),
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
    path: `/sign-up`,
    component: __dynamicImportComponent__(`@/pages/sign-up.vue`, {
      pageType: `top`,
      style: {
        navigationBarTitleText: `sign-up`,
        navigationBarBackgroundColor: `#42b883`,
        navigationBarTextStyle: `white`,
        name: "sign-up",
      },
    }),
  },
  {
    path: `/student-sign-up`,
    component: __dynamicImportComponent__(`@/pages/student-sign-up.vue`, {
      pageType: `top`,
      style: {
        navigationBarTitleText: `sign-up`,
        navigationBarBackgroundColor: `#42b883`,
        navigationBarTextStyle: `white`,
        name: "sign-up",
      },
    }),
  },
  {
    path: `/teacher-sign-up`,
    component: __dynamicImportComponent__(`@/pages/teacher-sign-up.vue`, {
      pageType: `top`,
      style: {
        navigationBarTitleText: `sign-up`,
        navigationBarBackgroundColor: `#42b883`,
        navigationBarTextStyle: `white`,
        name: "sign-up",
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
  {
    path: `/my/profile`,
    component: __dynamicImportComponent__(`@/pages/my/profile.vue`, {
      pageType: `top`,
      style: {
        navigationStyle: "default",
        navigationBarBackgroundColor: `#F8AE3D`,
        navigationBarTextStyle: `white`,
        name: "contact",
        // navigationBarTitleText: ``,
      },
    }),
  },
  {
    path: `/my/contact`,
    component: __dynamicImportComponent__(`@/pages/my/contact.vue`, {
      pageType: `top`,
      style: {
        navigationStyle: "default",
        navigationBarBackgroundColor: `#F8AE3D`,
        navigationBarTextStyle: `white`,
        name: "contact",
        navigationBarTitleText: `联系我们`,
      },
    }),
  },
  {
    path: `/my/messages`,
    component: __dynamicImportComponent__(`@/pages/my/messages.vue`, {
      pageType: `top`,
      style: {
        navigationStyle: "default",
        navigationBarBackgroundColor: `#F8AE3D`,
        navigationBarTextStyle: `white`,
        name: "messages",
        navigationBarTitleText: `系统提醒`,
      },
    }),
  },
  {
    path: `/my/puzzle-list`,
    component: __dynamicImportComponent__(`@/pages/puzzles/list.vue`, {
      pageType: `top`,
      style: {
        navigationStyle: "default",
        // navigationBarTitleText: `Puzzle Game`,
        navigationBarBackgroundColor: `#F8AE3D`,
        navigationBarTextStyle: `white`,
        name: "puzzle",
      },
    }),
  },
  {
    path: `/my/puzzles`,
    component: __dynamicImportComponent__(`@/pages/puzzles/index.vue`, {
      pageType: `top`,
      style: {
        navigationStyle: "default",
        // navigationBarTitleText: `Puzzle Game`,
        navigationBarBackgroundColor: `#F8AE3D`,
        navigationBarTextStyle: `white`,
        name: "puzzle",
        h5: {
          bounce: "none",
        },
      },
    }),
  },
  {
    path: `/my/calendar-list`,
    component: __dynamicImportComponent__(`@/pages/calendars/list.vue`, {
      pageType: `top`,
      style: {
        navigationStyle: "default",
        navigationBarBackgroundColor: `#F8AE3D`,
        navigationBarTextStyle: `white`,
        name: "list",
      },
    }),
  },
  {
    path: `/my/calendars`,
    component: __dynamicImportComponent__(`@/pages/calendars/index.vue`, {
      pageType: `top`,
      style: {
        navigationStyle: "default",
        navigationBarBackgroundColor: `#F8AE3D`,
        navigationBarTextStyle: `white`,
        name: "calendars",
      },
    }),
  },
  {
    path: `/my/calendars/create`,
    component: __dynamicImportComponent__(`@/pages/calendars/create.vue`, {
      pageType: `top`,
      style: {
        navigationStyle: "default",
        navigationBarBackgroundColor: `#F8AE3D`,
        navigationBarTextStyle: `white`,
        name: "create-calendar",
      },
    }),
  },
  {
    path: `/my/assignment-list`,
    component: __dynamicImportComponent__(`@/pages/assignments/list.vue`, {
      pageType: `top`,
      style: {
        navigationStyle: "default",
        navigationBarBackgroundColor: `#F8AE3D`,
        navigationBarTextStyle: `white`,
        name: "list",
      },
    }),
  },
  {
    path: `/my/assignments`,
    component: __dynamicImportComponent__(`@/pages/assignments/index.vue`, {
      pageType: `top`,
      style: {
        navigationStyle: "default",
        navigationBarBackgroundColor: `#F8AE3D`,
        navigationBarTextStyle: `white`,
        name: "assignment",
      },
    }),
  },
];

const router = createRouter({
  platform: platform,
  routes: [...soliRoutes],
  routeNotFound: (to) => {
    console.log(to);
    return {
      path: `/index`,
    };
  },
});
router.beforeEach((to, from) => {
  // console.log("【调试】:【", "路由拦截进入", "】");

  if (!checkAuth(to.path)) {
    //如果目表页未通过验证，则跳向登录页
    return { path: "/sign-in" };
  }
  // 用户已经登录，继续导航
});

function checkAuth(url: string) {
  if (
    [
      "/sign-in",
      "/sign-in",
      "/my",
      "/sign-up",
      "/teacher-sign-up",
      "/student-sign-up",
    ].includes(url)
  ) {
    // 白名单页面，不需要校验token
    return true;
  }

  //对于其他页面
  const token = uni.getStorageSync("authToken");
  // 如果没有 token，跳转到登录页
  if (!token || token === "") {
    console.log("【调试】:【", "token没了", "】");
    return false;
  } else {
    // console.log("【调试】:【", "token还在", "】");
  }

  return true;
}
console.log("【调试】:【", "路由初始化", "】");
export default router;
