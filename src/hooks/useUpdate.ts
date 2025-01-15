import { useI18n } from "vue-i18n";

export function useUpdateVersion() {
  const { t } = useI18n();

  const updateVersion = () => {
    const updateManager = uni.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("hasUpdate:" + res.hasUpdate);
    });

    updateManager.onUpdateReady(function () {
      uni.showModal({
        title: t("Update Prompt"),
        content: t(
          "The new version is ready. Do you want to restart the application?"
        ),
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      console.error("New version download failed.");
    });
  };

  return {
    updateVersion,
  };
}
