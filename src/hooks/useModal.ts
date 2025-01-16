import { ref, onMounted, onUnmounted } from "vue";

// 定义函数参数和返回值类型
interface ModalResult {
  content?: string;
  confirm?: boolean;
}

function useModal() {
  // 定义 modal2 函数，带自定义确认和取消文本
  async function modal2(
    title: string,
    confirmText: string,
    cancelText: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      uni.showModal({
        title,
        confirmText,
        cancelText,
        success: function (res: ModalResult) {
          resolve(!!res.confirm);
        },
      });
    });
  }

  // 定义 modal1 提示框
  function modal(title: string): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmText =
        uni.getStorageSync("lang") === "zh-CN" ? "确认" : "confirm";

      uni.showModal({
        title,
        confirmText,
        showCancel: false,
        editable: false,
        success: function (res: ModalResult) {
          resolve(!!res.confirm);
        },
      });
    });
  }
  // 定义 modal3 函数，支持输入框
  async function modal3(title: string): Promise<string | undefined> {
    const confirmText =
      uni.getStorageSync("lang") === "zh-CN" ? "确认" : "confirm";
    const cancelText =
      uni.getStorageSync("lang") === "zh-CN" ? "取消" : "cancel";

    return new Promise((resolve) => {
      uni.showModal({
        title,
        confirmText,
        cancelText,
        editable: true,
        success: function (res: ModalResult) {
          resolve(res.content);
        },
      });
    });
  }

  return {
    modal,
    modal2,
    modal3,
  };
}

export default useModal;
