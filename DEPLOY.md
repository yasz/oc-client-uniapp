# 部署说明

本项目提供了自动化部署功能，可以一键将构建后的文件部署到远程服务器。

## 🚀 快速部署

### 方法一：构建并部署（推荐）

```bash
npm run build:deploy
```

这个命令会：

1. 先运行 `npm run build:h5` 构建项目
2. 然后自动部署到服务器

### 方法二：仅部署

如果你已经构建过了，可以直接部署：

```bash
npm run deploy
```

## ⚙️ 配置修改

部署配置在 `deploy.config.js` 文件中，你可以根据需要修改：

```javascript
export const deployConfig = {
  // 服务器配置
  host: "112.124.70.72",
  username: "root", // 修改为你的用户名

  // 远端路径
  remotePath: "/www/wwwroot/lifefunchinese.cc",

  // 本地构建路径
  localBuildPath: "./dist/build/h5",

  // 网站地址
  websiteUrl: "http://lifefunchinese.cc",
};
```

## 📋 部署流程

部署脚本会执行以下步骤：

1. **检查本地构建文件** - 确保 `dist/build/h5` 目录存在且包含必要文件
2. **删除远端旧文件** - 通过 SSH 删除服务器上的 `assets` 目录和 `index.html`
3. **上传新文件** - 使用 SCP 上传本地构建的文件到服务器
4. **验证部署结果** - 检查远端文件是否正确上传

## 🔧 前置要求

在使用部署功能之前，请确保：

1. **SSH 访问权限** - 确保可以通过 SSH 连接到目标服务器
2. **免密登录配置**（推荐）- 配置 SSH 公钥认证，避免每次输入密码

### 配置 SSH 免密登录

1. 生成 SSH 密钥对（如果还没有）：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

2. 将公钥复制到服务器：

```bash
ssh-copy-id root@112.124.70.72
```

3. 测试连接：

```bash
ssh root@112.124.70.72
```

## 🐛 故障排除

### 常见问题

1. **构建文件不存在**

   - 解决方案：先运行 `npm run build:h5` 或使用 `npm run build:deploy`

2. **SSH 连接失败**

   - 检查服务器地址和用户名是否正确
   - 确保网络连接正常
   - 验证 SSH 密钥配置

3. **权限问题**

   - 确保目标用户对远程目录有写权限
   - 检查 SCP 上传权限

4. **文件上传失败**
   - 检查远程目录是否存在
   - 确保磁盘空间充足

### 手动测试命令

你可以手动测试各个步骤：

```bash
# 测试 SSH 连接
ssh root@112.124.70.72 "ls -la /www/wwwroot/lifefunchinese.cc"

# 测试文件删除
ssh root@112.124.70.72 "rm -rf /www/wwwroot/lifefunchinese.cc/assets /www/wwwroot/lifefunchinese.cc/index.html"

# 测试文件上传
scp ./dist/build/h5/index.html root@112.124.70.72:/www/wwwroot/lifefunchinese.cc/
scp -r ./dist/build/h5/assets root@112.124.70.72:/www/wwwroot/lifefunchinese.cc/
```

## 📝 日志说明

部署过程中会显示彩色日志：

- 🔍 蓝色：检查和验证步骤
- 🗑️ 黄色：删除操作
- 📤 蓝色：上传操作
- ✅ 绿色：成功完成
- ❌ 红色：错误信息
- ⚠️ 黄色：警告信息

## 🔒 安全建议

1. 不要在配置文件中硬编码敏感信息
2. 使用 SSH 密钥而不是密码认证
3. 考虑使用专门的部署用户而不是 root
4. 定期更新服务器和本地系统
