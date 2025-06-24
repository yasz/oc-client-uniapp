# 同步网盘功能测试文档

## 功能概述

为拥有 `admin` 角色的用户在课程卡片中添加"同步网盘"按钮，点击后从 CDN 同步课程内容到数据库的 `cos_xml` 字段。

## 实现的功能

### 1. 权限控制

- 只有拥有 `admin` 角色的用户才能看到"同步网盘"按钮
- 使用 `authStore.roles.includes('admin')` 进行权限判断

### 2. 同步流程

1. 点击"同步网盘"按钮
2. 显示确认对话框
3. 从 `VITE_CDN_URL` 根节点获取完整的 XML 内容
4. 解析 XML 并筛选出指定 `course.path` 目录及其子目录的内容
5. 生成新的 XML 结构，只包含该目录的文件
6. 调用 `courses:update` API 更新数据库中的 `cos_xml` 字段
7. 显示成功或失败提示

### 3. 新增的文件和函数

#### API 函数 (`src/utils/api.ts`)

```typescript
export async function syncCourseFromCDN(courseId: number, coursePath: string);
```

#### 组件修改 (`src/components/CourseCard.vue`)

- 添加了同步网盘按钮 UI
- 添加了 `handleSyncClick` 事件处理函数
- 更新了 `Course` 接口，添加 `path?` 字段

## 测试步骤

### 1. 权限测试

- 以非 admin 用户登录：不应该看到"同步网盘"按钮
- 以 admin 用户登录：应该看到蓝色的"同步网盘"按钮

### 2. 同步功能测试

- 点击"同步网盘"按钮
- 确认对话框应该显示课程名称
- 点击确认后应该显示"正在同步..."加载状态
- 成功后显示"同步成功"提示
- 失败时显示"同步失败，请重试"提示

### 3. 错误处理测试

- 测试课程没有 `path` 字段的情况
- 测试 CDN 请求失败的情况
- 测试 API 更新失败的情况

## 依赖的环境变量

- `VITE_CDN_URL`: CDN 服务器地址
- `VITE_API_ENDPOINT`: API 服务器地址

## API 调用示例

### 请求

```
POST /api/courses:update?filterByTk={courseId}
Content-Type: application/json
Authorization: Bearer {token}

{
  "cos_xml": "<ListBucketResult>...</ListBucketResult>"
}
```

### 响应

```json
{
  "data": { ... }
}
```

## 注意事项

1. 只更新 `cos_xml` 字段，不修改其他课程信息
2. 需要有效的认证 token
3. 需要 admin 权限
4. CDN 路径必须正确配置
5. 同步过程中会阻止用户重复点击（通过 loading 状态）
