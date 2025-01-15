import zhCN from "./zh-CN";

const generateENUS = (zhDict: Record<string, any>): Record<string, any> => {
  const traverse = (obj: Record<string, any>): Record<string, any> => {
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        // 如果是嵌套对象，递归处理
        result[key] = traverse(obj[key]);
      } else {
        // 如果是字符串，直接使用键名作为值
        result[key] = key;
      }
    }
    return result;
  };

  return traverse(zhDict);
};

const enUS = generateENUS(zhCN);
export default enUS;
