# 部署说明

本项目支持两个独立的部署环境，每个环境都有自己的配置文件和部署脚本。

## 生产环境部署

### 配置文件

- `deploy.config.js` - 生产环境配置
- 使用 SSH 密钥认证
- 目标服务器: `112.124.70.72`

### 部署命令

```bash
# 仅部署（需要先构建）
npm run deploy

# 构建并部署
npm run build:deploy
```

## 测试环境部署

### 配置文件

- `deploy-test.config.js` - 测试环境配置
- 使用密码认证（需要安装 sshpass）
- 目标服务器: `10.0.0.62`
- 部署路径: `/www/wwwroot/10.0.0.62`

### 部署命令

```bash
# 仅部署（需要先构建）
npm run deploy:test

# 构建并部署
npm run build:deploy:test
```

### 依赖要求

测试环境部署需要安装 `sshpass` 工具：

**macOS:**

```bash
brew install sshpass
```

**Ubuntu/Debian:**

```bash
sudo apt-get install sshpass
```

## 部署流程

1. **检查本地构建文件**
2. **删除远端旧文件**
3. **上传新文件**
4. **验证部署结果**

## 注意事项

- 部署前确保已经运行 `npm run build:h5` 构建项目
- 生产环境需要 SSH 私钥文件：`scripts/112.124.70.72_epyc1.pem`
- 测试环境需要安装 sshpass 工具
- 部署过程中会显示详细的进度信息和结果验证

## 安全提醒

- 生产环境使用 SSH 密钥认证，更安全
- 测试环境的密码配置仅用于内网环境
- 请妥善保管 SSH 私钥和密码信息
