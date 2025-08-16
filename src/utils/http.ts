import axios from "axios";

/**
 * 基础HTTP工具函数 - 不依赖authStore，避免循环依赖
 */

export async function getAPIAxios(url: string, data: any) {
  const token = uni.getStorageSync("authToken");
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/${url}`,
      {
        params: data, // GET 请求应使用 params 传递参数
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        timeout: 5000,
      }
    );
    const res = response.data;
    if (res.code === 401) {
      uni.redirectTo({ url: "/pages/sign-in" });
    }
    return res;
  } catch (error) {
    return await Promise.reject(error);
  }
}

export async function getPulicAPIAxios(url: string, data: any) {
  const token = import.meta.env.VITE_SPECIAL_TOKEN;
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/${url}`,
      {
        params: data,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        timeout: 5000,
      }
    );
    const res = response.data;
    if (res.code === 401) {
      uni.redirectTo({ url: "/pages/sign-in" });
    }
    return res;
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
}

export async function postPulicAPIAxios(url: string, data: any) {
  const token = import.meta.env.VITE_SPECIAL_TOKEN;
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_ENDPOINT}/${url}`,
      data, // POST 请求的参数应放在请求体中
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        timeout: 5000,
      }
    );
    const res = response.data;
    if (res.code === 401) {
      uni.redirectTo({ url: "/pages/sign-in" });
    }
    return res;
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
}

export async function postAPIAxios(url: string, data: any) {
  const token = uni.getStorageSync("authToken");
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_ENDPOINT}/${url}`,
      data, // POST 请求的参数应放在请求体中
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        timeout: 5000,
      }
    );
    const res = response.data;
    if (res.code === 401) {
      uni.redirectTo({ url: "/pages/sign-in" });
    }
    return res;
  } catch (error) {
    return await Promise.reject(error);
  }
}

// 基础 HTTP 函数（不依赖 authStore）
function httpBase(method: any, url: string, data: any) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync("authToken");
    uni.request({
      url: url,
      data,
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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

export function postAPI(url: string, data: any) {
  return httpBase("POST", `${import.meta.env.VITE_API_ENDPOINT}/${url}`, data);
}

export function getAPI(url: string, data: any) {
  return httpBase("GET", `${import.meta.env.VITE_API_ENDPOINT}/${url}`, data);
}
