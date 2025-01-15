["navigateTo", "redirectTo", "reLaunch", "switchTab"].forEach((item) => {
  uni.addInterceptor(item, {
    invoke(e) {
      let url = e.url.replace(/\?.*$/, "");

      if (
        [
          "",
          "/pages/login",
          "/pages/index/index",
          "/pages/group/inviteGroup",
          "/pages/activity/preview",
          "/pages/my/index",
        ].includes(url)
      )
        return e;
      const token = uni.getStorageSync("settings").token;
      if (!token || token == "") {
        //无token需要跳转
        uni.navigateTo({
          url: "/pages/login",
        });
        return false;
      }
    },
  });
});
