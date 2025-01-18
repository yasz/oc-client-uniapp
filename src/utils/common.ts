import { useAuthStore } from "@/stores/authStore";

export const bucketURL = "https://a.praise.site:3003/ps13";

export function uploadFile(filePath: string) {
  const token =
    useSettingsStore().token || uni.getStorageSync("settings").token;
  return new Promise(async (resolve, reject) => {
    uni.uploadFile({
      url: `${apiURL}/minio`,
      name: "file",
      filePath,
      header: {
        // Accept: 'application/json', // 需要注释，解决h5文件上传问题
        // 'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },

      timeout: 5000,
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 401) {
          uni.redirectTo({ url: "/pages/login" });
        }
        resolve(data);
      },
      fail: (e) => {
        reject(e);
      },
      complete: () => {},
    });
  });
}

/**
 * 解析页面参数
 * @param { String } url 待解析地址，可为空（默认解析当前url)
 *
 */

export function getQueryParams(
  url: string = window.location.href
): Record<string, string | number | boolean | null> {
  const paddingUrl =
    url.indexOf("http") >= 0 ? url : "https://localhost/?" + url;
  console.log("【调试】:【", paddingUrl, "】");
  const parsedUrl = new URL(paddingUrl);
  const data: Record<string, string | number | boolean | null> = {};
  const queryParams = new URLSearchParams(parsedUrl.search);

  queryParams.forEach((value, key) => {
    // 尝试将值转换为布尔值
    if (value.toLowerCase() === "true") {
      data[key] = true;
    } else if (value.toLowerCase() === "false") {
      data[key] = false;
    } else {
      // 尝试将值转换为整数
      const parsedValue = parseInt(value, 10);
      data[key] = isNaN(parsedValue) ? value : parsedValue;
    }
  });
  console.log("【调试】:【", data, "】");
  return data;
}
export const back = (delta = 1) => {
  uni.navigateBack({ delta });
};
export const formatDate = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
export const go = (url: string) => {
  uni
    .navigateTo({ url })
    .then(() => {})
    .catch((err) => {
      console.log("【调试】:【", err, "】");
      // uni.switchTab({ url });
    });
};

export const random = () => {
  const letter1 = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // 97 是字母 'a' 的 ASCII 码
  const letter2 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return letter1 + letter2;
};

export const toast = (
  title: string,
  mask: boolean = false,
  duration: number = 1500,
  position: "top" | "center" | "bottom" = "top",
  icon: "none" | "success" | "loading" = "none"
) => {
  uni.showToast({
    title,
    position,
    icon,
    duration,
    mask,
  });
};
export const go2 = (url: string) => {
  uni
    .switchTab({ url })
    .then(() => {})
    .catch((err) => {
      console.log("【调试】:【", err, "】");
      // uni.switchTab({ url });
    });
};
export function getAPI(url: any, data: any) {
  const queryParams = data ? "?" + new MySearchParams(data).toString() : "";
  return http("GET", `${apiURL}/${url}${queryParams}`, queryParams);
}

class MySearchParams {
  private params: Map<string, string>;

  constructor(input: string | Record<string, any> = "") {
    this.params = new Map();

    if (typeof input === "string") {
      // 处理查询字符串，移除前导 '?'
      if (input.startsWith("?")) {
        input = input.substring(1);
      }
      this.parse(input);
    } else if (typeof input === "object" && input !== null) {
      // 处理对象输入
      this.parseObject(input);
    } else {
      throw new TypeError("Input must be a string or an object");
    }
  }

  private parse(queryString: string): void {
    // 分割参数
    queryString.split("&").forEach((param) => {
      const [key, value] = param.split("=").map(decodeURIComponent);
      if (key) {
        this.params.set(key, value || "");
      }
    });
  }

  private parseObject(obj: Record<string, any>): void {
    // 处理对象参数
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        throw new TypeError("Object values must be primitives");
      }
      this.params.set(key, value === undefined ? "" : value.toString());
    });
  }

  toString(): string {
    return Array.from(this.params.entries())
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
  }

  get(key: string): string | null {
    return this.params.get(key) || null;
  }

  set(key: string, value: string): void {
    this.params.set(key, value);
  }

  delete(key: string): void {
    this.params.delete(key);
  }

  has(key: string): boolean {
    return this.params.has(key);
  }
}

export function post(url: string, data: any) {
  return http("POST", url, data);
}
export function patch(url: string, data: any) {
  return http("PATCH", url, data);
}

export function postAPI(url: string, data: any) {
  return http("POST", `${import.meta.env.VITE_API_ENDPOINT}/${url}`, data);
}

function http(method: any, url: string, data: any) {
  return new Promise((resolve, reject) => {
    const token = useAuthStore().token || uni.getStorageSync("authToken");
    uni.request({
      url: url,
      data,
      // header: {
      //   Accept: "application/json",
      //   "Content-Type": "application/json",
      //   ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // },
      method,
      timeout: 5000,
      success: (res: any) => {
        if (res.data.code === 401) {
          uni.redirectTo({ url: "/pages/sign-in" });
        }
        resolve(res.data);
      },
      fail: (e) => {
        reject(e);
      },
      complete: () => {},
    });
  });
}
export function getCurrentPageUrl() {
  const pages = getCurrentPages(); // 获取页面栈
  const currentPage = pages[pages.length - 1]; // 获取当前页面
  return currentPage.route; // 返回当前页面的路径
}
