import { PiniaPluginContext } from "pinia";

export function deepClone<T>(obj: T, cache: Map<any, any> = new Map()): T {
  // 如果对象为 null 或者不是对象类型，则直接返回该对象
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // 处理特殊对象类型：日期、正则表达式、错误对象
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as any;
  }
  if (obj instanceof Error) {
    const errorCopy = new Error(obj.message) as any;
    errorCopy.stack = obj.stack;
    return errorCopy;
  }

  // 检查缓存中是否已存在该对象的复制
  if (cache.has(obj)) {
    return cache.get(obj);
  }

  // 根据原始对象的类型创建对应的空对象或数组
  const copy: any = Array.isArray(obj) ? [] : {};

  // 将当前对象添加到缓存中
  cache.set(obj, copy);

  // 递归地深拷贝对象的每个属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key], cache);
    }
  }

  return copy as T;
}
export function persist({ store }: PiniaPluginContext) {
  // 暂存State

  let persistState = deepClone(store.$state);
  // 从缓存中读取

  const storageState = uni.getStorageSync(store.$id);
  if (storageState) {
    persistState = storageState;
  }
  store.$state = persistState;
  store.$subscribe(() => {
    // 在存储变化的时候将store缓存

    // console.log("localstorage发生变化");
    uni.setStorageSync(store.$id, deepClone(store.$state));
  });
}
