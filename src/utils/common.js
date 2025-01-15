/**
 * 页面跳转
 * @param { String } url 跳转地址
 */
export const go = (url) => {

    uni.navigateTo({ url })
        .then(() => {

        })
        .catch((err) => {
            uni.switchTab({ url });
        });
};


export const openMap = (lat, lot, name, address) => {
    uni.openLocation({
        latitude: lat,
        longitude: lot,
        name: name,
        address: address,
    })
}

/**
 * 关闭当前页面，跳转
 * @param { String } url 跳转地址
 */
export const go2 = (url) => {
    uni.redirectTo({ url })
}

/**
 * 底部导航栏跳转
 * @param { String } url 跳转地址
 */
export const tabGo = (url) => {
    uni.switchTab({ url })
}


export const random2 = () => {
    const letter1 = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // 97 是字母 'a' 的 ASCII 码
    const letter2 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    return letter1 + letter2;
}
export const str2Params = (str) => {
    return Object.fromEntries(new MySearchParams(str));
}

export const params2Str = (params) => {
    return Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');

}
export const query2Params = (query) => {
    const originalQueryString = Object.keys(query)[0]
    return Object.fromEntries(new MySearchParams(originalQueryString));
}

export const getParams = () => {
    let routes = getCurrentPages()
    let query = routes[routes.length - 1].$page.options
    const originalQueryString = Object.keys(query)[0]
    return Object.fromEntries(new MySearchParams(originalQueryString));
}

/**
 * 返回上一页
 * @param { String } delta 返回层级
 */
export const back = (delta = 1) => {


    uni.navigateBack({ delta })
}
/**
 * 显示消息提示框
 * @param { String } title 提示的内容，长度与 icon 取值有关。
 * @param { Number } duration 提示的延迟时间，单位毫秒，默认：1500
 * @param { Boolean } mask 防止触摸穿透
 * @param { String } position 纯文本轻提示显示位置 top | center | bottom
 * @param { String } icon 图标，有效值详见uniapp官方说明。
 */
export const toast = (title, mask = false, duration = 1500, position = 'top', icon = 'none') => {
    uni.showToast({
        title,
        position,
        icon,
        duration,
        mask,
    })
}
/**
 * 显示 loading 提示框, 需主动调用
 * @param { String } title 提示的文字内容，显示在loading的下方
 * @param { Boolean } mask 是否显示透明蒙层，防止触摸穿透默认 true
 * 调用 uni.hideLoading() 来关闭提示框
 */



let loadingTimer
export const loading = (title = '正在加载...', mask = true) => {
    uni.showLoading({
        title,
        mask,
    })

    // 10s自动关闭
    loadingTimer = setTimeout(() => {
        uni.hideLoading()
    }, 10000)
}
import { useSettingsStore } from "@/stores/useSettingsStore";
import dayjs from "dayjs";

function http(method, url, data) {

    return new Promise((resolve, reject) => {

        const token = useSettingsStore().token || uni.getStorageSync('settings').token
        uni.request({
            url: url,
            data,
            header: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            method,
            timeout: 5000,
            success: (res) => {

                if (res.data.code === 401) {
                    debugger
                    uni.redirectTo({ url: '/pages/login' });
                }
                resolve(res.data);
            },
            fail: (e) => {
                reject(e)
            },
            complete: () => { },
        })
    })
}
function getSystemInfoAsync() {
    return new Promise((resolve, reject) => {
        uni.getSystemInfo({
            success: resolve,
            fail: reject
        });
    });
}
export const getViewportWidth = async () => {
    let res = await getSystemInfoAsync();
    return res.screenWidth;
    // return 800
};
export const getViewport = async () => {
    let res = await getSystemInfoAsync();

    return {
        width: res.screenWidth,
        height: res.screenHeight,
    }
    // return 800
};
export const getParams2 = () => {
    let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
    return routes[routes.length - 1].$page.options;
    // const route = useRoute()
    // return Object.fromEntries(new MySearchParams(route.query))
};

export function getWeekdayByDate(dateString) {
    const weekday = dayjs(dateString).format('ddd');
    return weekday;
}
export function get(url, data) {
    return http('GET', url, data)
}
export function getLocation() {
    return new Promise((resolve, reject) => {
        uni.getLocation({
            enableHighAccuracy: true,
            geocode: true,
            type: 'gcj02',
            success: function (res) {
                resolve(res)
            },
            fail: function (e) {
                reject(e)
            },
        })
    })
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371 // 地球平均半径（单位：千米）

    // 将经纬度从度数转换为弧度
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = earthRadius * c // 计算距离

    return distance
}
export function chooseLocation() {
    return new Promise((resolve, reject) => {
        uni.chooseLocation({
            success: function (res) {
                resolve(res)
            },
            fail: function (error) {
                reject(error)
            },
        })
    })
}


export async function question(title) {
    let confirmText = uni.getStorageSync('lang') === 'zh-CN' ? '确认' : 'confirm';
    let cancelText = uni.getStorageSync('lang') === 'zh-CN' ? '取消' : 'cancel';

    return new Promise((resolve) => {
        uni.showModal({
            title: title,
            confirmText,
            cancelText,
            editable: true,
            success: function (res) {

                if (res.confirm) {
                    resolve(res.content); // 用户点击了确认
                } else {
                    resolve(false); // 用户点击了取消
                }
            },

        });
    });
}

export async function confirm(title) {
    let confirmText = uni.getStorageSync('lang') === 'zh-CN' ? '确认' : 'confirm';
    let cancelText = uni.getStorageSync('lang') === 'zh-CN' ? '取消' : 'cancel';

    return new Promise((resolve) => {
        uni.showModal({
            title: title,
            confirmText,
            cancelText,
            success: function (res) {
                if (res.confirm) {
                    resolve(true); // 用户点击了确认
                } else {
                    resolve(false); // 用户点击了取消
                }
            },
            fail: function () {
                resolve(false); // 弹窗失败时也返回 false
            }
        });
    });
}
export const sleep = (delay = 300) =>
    new Promise(resolve => setTimeout(resolve, delay));

export const apiURL = "https://a.praise.site:3001/api";
export const bucketURL = "https://a.praise.site:3003/ps13";

export function post(url, data) {
    return http('POST', url, data)
}
export function postAPI(url, data) {
    return http('POST', `${apiURL}/${url}`, data)
}
export function getAPI(url, data) {
    const queryParams = data ? "?" + new MySearchParams(data).toString() : "";
    return http('GET', `${apiURL}/${url}${queryParams}`, queryParams)
}
class MySearchParams {
    constructor(input = '') {
        this.params = new Map();

        if (typeof input === 'string') {
            // 处理查询字符串，移除前导 '?'
            if (input.startsWith('?')) {
                input = input.substring(1);
            }
            this.parse(input);
        } else if (typeof input === 'object' && input !== null) {
            // 处理对象输入
            this.parseObject(input);
        } else {
            throw new TypeError('Input must be a string or an object');
        }
    }

    parse(queryString) {
        // 分割参数
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=').map(decodeURIComponent);
            if (key) {
                this.params.set(key, value || '');
            }
        });
    }

    parseObject(obj) {
        // 处理对象参数
        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                throw new TypeError('Object values must be primitives');
            }
            this.params.set(key, value === undefined ? '' : value.toString());
        });
    }

    toString() {
        return Array.from(this.params.entries())
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    }

    get(key) {
        return this.params.get(key) || null;
    }

    set(key, value) {
        this.params.set(key, value);
    }

    delete(key) {
        this.params.delete(key);
    }

    has(key) {
        return this.params.has(key);
    }
}

export function uploadFile(filePath) {
    const token = useSettingsStore().token || uni.getStorageSync('settings').token
    return new Promise(async (resolve, reject) => {

        uni.uploadFile({
            url: `${apiURL}/minio`,
            name: 'file',
            filePath,
            header: {
                // Accept: 'application/json', // 需要注释，解决h5文件上传问题
                // 'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },

            timeout: 5000,
            success: (res) => {

                const data = JSON.parse(res.data)
                if (data.code === 401) {

                    uni.redirectTo({ url: '/pages/login' });
                }
                resolve(data);
            },
            fail: (e) => {
                reject(e);
            },
            complete: () => { },
        });

    });

}
export function base64ToFile(base64, name) {
    if (typeof base64 != 'string') { alert(1); return; }
    var arr = base64.split(',')
    var type = arr[0].match(/:(.*?);/)[1]
    var fileExt = type.split('/')[1]

    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${name}.` + fileExt, {
        type: type
    })
}
export function fetchBlobAsDataURL(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.open('GET', url);

        xhr.onload = () => {
            if (xhr.status === 200) {
                const blobData = xhr.response;
                const reader = new FileReader();
                reader.onload = () => {
                    const dataURL = reader.result;
                    resolve(dataURL);
                };
                reader.readAsDataURL(blobData);
            } else {
                reject(new Error('Failed to load the blob.'));
            }
        };

        xhr.onerror = () => {
            reject(new Error('XHR request error.'));
        };

        xhr.send();
    })
}

export const b2b64 = (blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
export function debounce(fn, delay) {
    let timer; // 定时器
    return function (...args) { // 形成闭包     
        // args 为函数调用时传的参数。
        let context = this;
        timer && clearTimeout(timer); // 当函数再次执行时，清除定时器，重新开始计时
        // 利用定时器，让指定函数延迟执行。
        timer = setTimeout(function () {
            // 执行传入的指定函数，利用apply更改this绑定和传参
            fn.apply(context, args);
        }, delay)
    }
}
export function throttle(fn, delay) {
    let timer;    // 定时器

    return function (...args) {
        let context = this;
        // 如果timer存在，说明函数还未该执行
        if (timer) return;
        timer = setTimeout(function () {
            // 当函数执行时，让timer为null。
            timer = null;
            fn.apply(context, args);
        }, delay);
    }
}

export default {
    loading,
    toast,
    go,
    go2,
    tabGo,
    back,
    debounce,
    throttle
}
