# 同步网盘功能测试文档

## 功能描述

为拥有 `admin` 角色的用户在课程卡片中添加"同步网盘"按钮，点击后通过后端 API 获取腾讯云 COS 数据并同步到数据库的 `cos_xml` 字段。

## 功能流程

1. 检查用户权限（必须是 admin 角色）
2. 显示同步确认对话框
3. 调用后端 API `https://praise.site/api/oa-cos?path={coursePath}` 获取指定路径的 COS 数据
4. 将 API 返回的 JSON 数据转换为 XML 格式
5. 调用 `courses:update` API 更新数据库中的 `cos_xml` 字段
6. 显示同步结果

## API 接口

### 后端 COS API

- **URL**: `https://praise.site/api/oa-cos?path={path}`
- **方法**: GET
- **参数**:
  - `path`: 要获取的 COS 路径，如 "HSK1"
- **响应格式**:

```json
{
  "success": true,
  "data": {
    "Name": "bucket-name",
    "Prefix": "HSK1/",
    "Marker": "",
    "MaxKeys": "1000",
    "IsTruncated": "false",
    "Contents": [
      {
        "Key": "HSK1/file.pdf",
        "LastModified": "2025-06-18T14:36:48.000Z",
        "ETag": "\"hash\"",
        "Size": "1024",
        "Owner": {
          "ID": "owner-id",
          "DisplayName": "owner-name"
        },
        "StorageClass": "STANDARD"
      }
    ]
  }
}
```

## 测试步骤

### 前置条件

1. 用户必须具有 `admin` 角色
2. 课程必须有有效的 `path` 字段
3. 后端 API `https://praise.site/api/oa-cos` 可正常访问

### 测试用例

#### 1. 权限测试

- **测试场景**：非 admin 用户
- **期望结果**：不显示"同步网盘"按钮

#### 2. 正常同步测试

- **测试场景**：admin 用户点击"同步网盘"按钮
- **操作步骤**：
  1. 以 admin 用户身份登录
  2. 找到有 `path` 字段的课程卡片（如 path="HSK1"）
  3. 点击"同步网盘"按钮
  4. 在确认对话框中点击"确定"
- **期望结果**：
  - 显示加载状态
  - 调用 `https://praise.site/api/oa-cos?path=HSK1`
  - 数据库更新成功
  - 显示成功提示

#### 3. API 错误测试

- **测试场景**：后端 API 返回错误
- **期望结果**：显示错误提示，如"API 请求失败: 404"

#### 4. 无路径测试

- **测试场景**：课程没有 `path` 字段
- **期望结果**：显示错误提示，如"课程路径为空"

#### 5. 数据格式错误测试

- **测试场景**：API 返回的数据格式不正确
- **期望结果**：显示错误提示，如"API 返回数据格式错误"

## 数据库更新 API

### 课程更新接口

- **URL**: `courses:update?filterByTk={courseId}`
- **方法**: POST
- **请求体**:

```json
{
  "cos_xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<ListBucketResult>...</ListBucketResult>"
}
```

### 成功响应

```json
{
  "data": {
    "id": 1,
    "name": "课程名称",
    "cos_xml": "<ListBucketResult>...</ListBucketResult>"
  }
}
```

### 错误响应

```json
{
  "error": {
    "message": "API请求失败: 403 Forbidden"
  }
}
```

## 注意事项

1. 只更新 `cos_xml` 字段，不修改其他课程信息
2. 同步过程中显示加载状态，防止重复点击
3. 错误处理要详细，帮助定位问题
4. 使用后端 API 避免了客户端直接访问 COS 的安全风险
5. API 返回的数据已经是指定路径的内容，无需客户端过滤

## 故障排除

### 常见错误

1. **404 Not Found**: 检查后端 API 是否正常运行
2. **400 Bad Request**: 检查传入的 path 参数是否正确
3. **500 Internal Server Error**: 后端服务器错误，联系后端开发者
4. **网络超时**: 检查网络连接

### 调试建议

1. 检查浏览器控制台的网络请求
2. 验证课程的 path 字段是否正确
3. 测试后端 API 是否可以直接访问
4. 检查用户权限和课程数据

## 示例测试

可以直接访问以下 URL 测试后端 API：

- `https://praise.site/api/oa-cos?path=HSK1`
- `https://praise.site/api/oa-cos?path=YCT1`

这些 URL 应该返回对应路径的 COS 文件列表。
