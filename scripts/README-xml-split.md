# XML 分离工具使用说明

## 概述

这个工具用于将 CDN 的 XML 清单文件按一级目录分离成独立的 XML 文件，每个文件都保持完整的 `<ListBucketResult>` 结构。

## 文件结构

- `scripts/cos.xml` - 原始的 CDN XML 清单文件
- `scripts/split-xml-by-directory.js` - XML 分离脚本
- `scripts/split-xml/` - 生成的分离后的 XML 文件目录

## 使用方法

### 1. 运行脚本

```bash
# 使用 npm 脚本
npm run split-xml

# 或直接运行
node scripts/split-xml-by-directory.js
```

### 2. 生成的文件

脚本会在 `scripts/split-xml/` 目录下生成以下文件：

- `HSK1.xml` - HSK1 目录下的所有文件 (315 项)
- `YCT1.xml` - YCT1 目录下的所有文件 (186 项)
- `一年级上册.xml` - 一年级上册目录下的所有文件 (497 项)
- `root.xml` - 根目录下的文件 (1 项)

### 3. XML 文件结构

每个生成的 XML 文件都包含完整的 `<ListBucketResult>` 结构：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult>
  <Name>bucket-name</Name>
  <Prefix/>
  <Marker/>
  <MaxKeys>1000</MaxKeys>
  <IsTruncated>false</IsTruncated>
  <NextMarker/>
  <Contents>
    <Key>文件路径</Key>
    <LastModified>时间戳</LastModified>
    <ETag>"文件哈希"</ETag>
    <Size>文件大小</Size>
    <Owner>
      <ID>所有者ID</ID>
      <DisplayName>显示名称</DisplayName>
    </Owner>
    <StorageClass>存储类型</StorageClass>
  </Contents>
  <!-- 更多 Contents 项... -->
</ListBucketResult>
```

## 技术说明

### 依赖包

脚本使用项目中已安装的 `fast-xml-parser` 包进行 XML 解析和生成。

### 文件命名规则

- 一级目录名称中的特殊字符会被替换为下划线 `_`
- 支持中文目录名
- 根目录文件归类到 `root.xml`

### 统计信息

运行完成后会显示：

- 总文件数量
- 发现的目录列表
- 每个目录的文件统计
- 生成的 XML 文件路径

## 自定义配置

如需修改脚本行为，可编辑 `scripts/split-xml-by-directory.js`：

- 修改输出目录路径
- 调整文件命名规则
- 更改 XML 格式选项

## 错误处理

脚本包含以下错误处理：

- 跳过没有有效 Key 的内容项
- 检查必需依赖包的存在
- 创建输出目录（如不存在）
- 显示处理过程中的详细信息
