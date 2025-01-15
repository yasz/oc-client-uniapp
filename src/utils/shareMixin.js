export default {
    data() {

        return {
            share: {
                title: '活动小组' + getCurrentPages(),

                imageUrl: '分享显示的图片链接',
                desc: '简介',
            },
        }
    },
    // 分享到微信好友功能
    onShareAppMessage(res) {
        console.log('【分享链接】:【', getCurrentPages(), this.$mp?.page, '】');
        return {
            title: this.share.title,
            path: this.$mp?.page?.route,
            desc: this.share.desc,
            imageUrl: this.share.imageUrl,
            success(res) {
                uni.showToast({
                    title: '分享成功',
                })
            },
            fail(res) {
                uni.showToast({
                    title: '分享失败',
                    icon: 'none',
                })
            },
        }
    },
    // 分享到朋友圈功能
    onShareTimeline(res) {
        return {
            title: this.share.title,
            path: this.$mp?.page?.route,
            desc: this.share.desc,
            imageUrl: this.share.imageUrl,
            success(res) {
                uni.showToast({
                    title: '分享成功',
                })
            },
            fail(res) {
                uni.showToast({
                    title: '分享失败',
                    icon: 'none',
                })
            },
        }
    },
}
