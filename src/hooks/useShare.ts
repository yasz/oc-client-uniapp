import { ref } from "vue";

export function useShare() {
  const share = ref({
    title: "活动小组",
    imageUrl: "分享显示的图片链接",
    desc: "简介",
  });

  const onShareAppMessage = (res: any) => {
    console.log("【分享链接】:【", getCurrentPages(), "】");
    return {
      title: share.value.title,
      path: res.path, // Adjust according to how you get the route
      desc: share.value.desc,
      imageUrl: share.value.imageUrl,
      success() {
        uni.showToast({
          title: "分享成功",
        });
      },
      fail() {
        uni.showToast({
          title: "分享失败",
          icon: "none",
        });
      },
    };
  };

  const onShareTimeline = (res: any) => {
    return {
      title: share.value.title,
      path: res.path, // Adjust according to how you get the route
      desc: share.value.desc,
      imageUrl: share.value.imageUrl,
      success() {
        uni.showToast({
          title: "分享成功",
        });
      },
      fail() {
        uni.showToast({
          title: "分享失败",
          icon: "none",
        });
      },
    };
  };

  return {
    share,
    onShareAppMessage,
    onShareTimeline,
  };
}
