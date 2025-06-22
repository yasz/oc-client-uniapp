// --- TypeScript 接口定义 ---
export interface CosContent {
  Key: string;
  Size: number | string;
  LastModified?: string;
  ETag?: string;
  Owner?: {
    ID: number;
    DisplayName: string;
  };
  StorageClass?: string;
}

export interface TreeNode {
  name: string;
  path: string;
  children?: TreeNode[];
  isFile?: boolean;
  size?: number;
  lastModified?: string;
}

export interface XMLBucketResult {
  ListBucketResult: {
    Name?: string;
    Prefix?: string;
    Contents?: CosContent | CosContent[];
  };
}

/**
 * 将XML数据转换为树形结构
 * @param xmlContent - XML字符串内容
 * @returns 树形结构数组
 */
export const parseXMLToTree = (xmlContent: string): TreeNode[] => {
  if (!xmlContent) return [];

  try {
    console.log("=== 开始解析XML数据 ===");

    // 使用DOMParser解析XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

    // 检查解析错误
    const parseError = xmlDoc.getElementsByTagName("parsererror");
    if (parseError.length > 0) {
      console.error("XML解析错误:", parseError[0].textContent);
      return [];
    }

    // 获取所有Contents节点
    const contentsNodes = xmlDoc.getElementsByTagName("Contents");
    const contents: CosContent[] = [];

    for (let i = 0; i < contentsNodes.length; i++) {
      const node = contentsNodes[i];
      const keyNode = node.getElementsByTagName("Key")[0];
      const sizeNode = node.getElementsByTagName("Size")[0];
      const lastModifiedNode = node.getElementsByTagName("LastModified")[0];
      const etagNode = node.getElementsByTagName("ETag")[0];

      if (keyNode) {
        const content: CosContent = {
          Key: keyNode.textContent || "",
          Size: sizeNode ? parseInt(sizeNode.textContent || "0") : 0,
          LastModified: lastModifiedNode?.textContent || undefined,
          ETag: etagNode?.textContent || undefined,
        };
        contents.push(content);
      }
    }

    console.log("=== 解析后的Contents数据 ===");

    return buildTreeFromXMLContents(contents);
  } catch (error) {
    console.error("XML解析失败:", error);
    return [];
  }
};

/**
 * 测试函数：验证XML解析功能
 * @param testData - 测试用的Contents数据
 * @returns 树形结构数组
 */
export const testXMLParsing = (testData: CosContent[]): TreeNode[] => {
  const result = buildTreeFromXMLContents(testData);

  return result;
};

/**
 * 从XML Contents数据构建树形结构（优化版本）
 * @param contents - Contents数组
 * @returns 树形结构数组
 */
export const buildTreeFromXMLContents = (
  contents: CosContent[]
): TreeNode[] => {
  const result: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();

  // 首先按路径排序，确保父目录在子目录之前处理
  contents.sort((a, b) => a.Key.localeCompare(b.Key));

  contents.forEach((item) => {
    if (!item.Key || item.Key.includes(".DS_Store")) {
      return;
    }

    const pathParts = item.Key.split("/").filter((p: string) => p);
    if (pathParts.length === 0) return;

    // 跳过第一层根目录，从第二层开始
    if (pathParts.length === 1) {
      // 如果只有一层，且是目录（Size为0），则跳过
      if (item.Size === 0 || item.Size === "0") {
        return;
      }
    }

    // 构建路径层级，从第二层开始
    let currentPath = "";
    let parentNode: TreeNode | null = null;
    let startIndex = 0;

    // 如果有多层，从第二层开始处理
    if (pathParts.length > 1) {
      startIndex = 1;
      currentPath = pathParts[0];
    }

    // 处理每一级路径
    for (let i = startIndex; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      // 检查是否已存在该节点
      let node = nodeMap.get(currentPath);

      if (!node) {
        const isLastPart = i === pathParts.length - 1;
        // 判断是否为文件：最后一级且Size不为0的才是文件
        const isFile = isLastPart && item.Size !== 0 && item.Size !== "0";

        node = {
          name: part,
          path: currentPath,
          children: isFile ? undefined : [],
          isFile: isFile,
          size: isFile ? Number(item.Size) : undefined,
          lastModified: item.LastModified,
        };

        nodeMap.set(currentPath, node);

        // 添加到父级或根级
        if (parentNode && parentNode.children) {
          parentNode.children.push(node);
        } else {
          result.push(node);
        }
      }

      parentNode = node;
    }
  });

  console.log("=== 最终XML树结构（跳过根目录） ===");
  //   console.log(result);
  return result;
};

/**
 * 从JSON数据构建树形结构
 * @param data - JSON数据数组
 * @returns 树形结构数组
 */
export const buildTreeFromJSON = (data: any[]): TreeNode[] => {
  console.log("=== 原始JSON数据 ===");
  console.log(JSON.stringify(data, null, 2));

  const result: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();

  // 首先按路径排序
  data.sort((a, b) => a.path.localeCompare(b.path));

  data.forEach((item) => {
    const originalPath = item.path;
    const pathParts = originalPath.split("/").filter((p: string) => p);
    if (pathParts.length === 0) return;

    let currentPath = "";
    let parentNode: TreeNode | null = null;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      let node = nodeMap.get(currentPath);

      if (!node) {
        const isLastPart = i === pathParts.length - 1;
        const isFile = !originalPath.endsWith("/");

        node = {
          name: part,
          path: currentPath,
          children: isFile ? undefined : [],
          isFile: isFile,
        };

        nodeMap.set(currentPath, node);

        if (parentNode && parentNode.children) {
          parentNode.children.push(node);
        } else {
          result.push(node);
        }
      }

      parentNode = node;
    }
  });

  return result;
};

/**
 * 直接处理JSON格式的Contents数据
 * @param jsonData - JSON格式的Contents数组
 * @returns 树形结构数组
 */
export const parseJSONContentsToTree = (jsonData: any[]): TreeNode[] => {
  // 将JSON数据转换为CosContent格式
  const contents: CosContent[] = jsonData.map((item) => ({
    Key: item.Key,
    Size: item.Size,
    LastModified: item.LastModified,
    ETag: item.ETag,
    Owner: item.Owner,
    StorageClass: item.StorageClass,
  }));

  return buildTreeFromXMLContents(contents);
};

/**
 * 通用数据解析函数，自动识别数据类型并转换为树形结构
 * @param content - 原始数据内容（XML字符串或JSON）
 * @returns 树形结构数组
 */
export const parseContentToTree = (content: string | object): TreeNode[] => {
  if (!content) return [];

  try {
    // 检查是否是JSON格式的数据
    if (
      typeof content === "object" ||
      (typeof content === "string" && content.trim().startsWith("["))
    ) {
      const jsonData =
        typeof content === "string" ? JSON.parse(content) : content;

      // 检查是否是Contents格式的JSON数据
      if (Array.isArray(jsonData) && jsonData.length > 0 && jsonData[0].Key) {
        return parseJSONContentsToTree(jsonData);
      }

      return buildTreeFromJSON(jsonData);
    }

    // 处理XML格式的数据
    return parseXMLToTree(content as string);
  } catch (e) {
    console.error("数据解析失败:", e);
    return [];
  }
};
