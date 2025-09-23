#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { deployConfig } from '../deploy.config.js';
import os from 'os';

let execAsync;
let spawn, exec;
if (os.platform() !== 'win32') {
    ({ spawn, exec } = await import('child_process'));
    const { promisify } = await import('util');
    execAsync = promisify(exec);
}
let NodeSSH;
if (os.platform() === 'win32') {
    NodeSSH = (await import('node-ssh')).NodeSSH;
}

// 使用外部配置文件
const DEPLOY_CONFIG = deployConfig;

// 颜色输出函数
const colors = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    blue: '\x1b[34m%s\x1b[0m',
    magenta: '\x1b[35m%s\x1b[0m',
    cyan: '\x1b[36m%s\x1b[0m',
};

function log(message, color = 'cyan') {
    console.log(colors[color], message);
}

// 检查本地构建文件是否存在
function checkLocalBuild() {
    log('🔍 检查本地构建文件...', 'blue');

    if (!fs.existsSync(DEPLOY_CONFIG.localBuildPath)) {
        log('❌ 构建文件不存在，请先运行 npm run build:h5', 'red');
        process.exit(1);
    }

    const indexHtml = path.join(DEPLOY_CONFIG.localBuildPath, 'index.html');
    const assetsDir = path.join(DEPLOY_CONFIG.localBuildPath, 'assets');

    if (!fs.existsSync(indexHtml)) {
        log('❌ index.html 不存在', 'red');
        process.exit(1);
    }

    if (!fs.existsSync(assetsDir)) {
        log('❌ assets 目录不存在', 'red');
        process.exit(1);
    }

    log('✅ 本地构建文件检查通过', 'green');
}

// 删除远端文件（跨平台）
async function removeRemoteFiles() {
    log('🗑️  删除远端旧文件...', 'yellow');
    if (os.platform() === 'win32') {
        // Windows: 用 node-ssh
        const ssh = new NodeSSH();
        await ssh.connect({
            host: DEPLOY_CONFIG.host,
            username: DEPLOY_CONFIG.username,
            password: DEPLOY_CONFIG.password,
        });
        await ssh.execCommand(`rm -rf ${DEPLOY_CONFIG.remotePath}/assets ${DEPLOY_CONFIG.remotePath}/index.html`, { options: { pty: true } });
        ssh.dispose();
        log('✅ 远端文件删除成功', 'green');
    } else {
        // macOS/Linux: 用 sshpass
        const sshCommand = `/opt/homebrew/bin/sshpass -p "${DEPLOY_CONFIG.password}" ssh -o StrictHostKeyChecking=no ${DEPLOY_CONFIG.username}@${DEPLOY_CONFIG.host} "sudo rm -rf ${DEPLOY_CONFIG.remotePath}/assets ${DEPLOY_CONFIG.remotePath}/index.html"`;
        try {
            const { stdout, stderr } = await execAsync(sshCommand);
            if (stderr && !stderr.includes('No such file or directory')) {
                throw new Error(stderr);
            }
            log('✅ 远端文件删除成功', 'green');
        } catch (error) {
            log(`❌ 删除远端文件失败: ${error.message}`, 'red');
            throw error;
        }
    }
}

// 上传文件到远端（跨平台）
async function uploadFiles() {
    log('📤 上传新文件到远端...', 'blue');
    if (os.platform() === 'win32') {
        // Windows: 用 node-ssh
        const ssh = new NodeSSH();
        await ssh.connect({
            host: DEPLOY_CONFIG.host,
            username: DEPLOY_CONFIG.username,
            password: DEPLOY_CONFIG.password,
        });
        // 创建临时目录
        await ssh.execCommand('mkdir -p ~/temp_deploy');
        // 上传 index.html
        log('📄 上传 index.html...', 'blue');
        await ssh.putFile(path.join(DEPLOY_CONFIG.localBuildPath, 'index.html'), 'temp_deploy/index.html');
        log('✅ index.html 上传到临时目录成功', 'green');
        // 上传 assets 目录
        log('📁 上传 assets 目录...', 'blue');
        await ssh.putDirectory(path.join(DEPLOY_CONFIG.localBuildPath, 'assets'), 'temp_deploy/assets');
        log('✅ assets 目录上传到临时目录成功', 'green');
        // 移动到目标目录
        log('📦 移动文件到目标目录...', 'blue');
        await ssh.execCommand(`sudo mv ~/temp_deploy/* ${DEPLOY_CONFIG.remotePath}/ && rm -rf ~/temp_deploy`);
        log('✅ 文件移动成功', 'green');
        ssh.dispose();
    } else {
        // macOS/Linux: 用 sshpass+scp
        const createTempDirCommand = `/opt/homebrew/bin/sshpass -p "${DEPLOY_CONFIG.password}" ssh -o StrictHostKeyChecking=no ${DEPLOY_CONFIG.username}@${DEPLOY_CONFIG.host} "mkdir -p ~/temp_deploy"`;
        await execAsync(createTempDirCommand);
        const uploadIndexCommand = `/opt/homebrew/bin/sshpass -p "${DEPLOY_CONFIG.password}" scp -o StrictHostKeyChecking=no ${DEPLOY_CONFIG.localBuildPath}/index.html ${DEPLOY_CONFIG.username}@${DEPLOY_CONFIG.host}:~/temp_deploy/`;
        const uploadAssetsCommand = `/opt/homebrew/bin/sshpass -p "${DEPLOY_CONFIG.password}" scp -o StrictHostKeyChecking=no -r ${DEPLOY_CONFIG.localBuildPath}/assets ${DEPLOY_CONFIG.username}@${DEPLOY_CONFIG.host}:~/temp_deploy/`;
        const moveFilesCommand = `/opt/homebrew/bin/sshpass -p "${DEPLOY_CONFIG.password}" ssh -o StrictHostKeyChecking=no ${DEPLOY_CONFIG.username}@${DEPLOY_CONFIG.host} "sudo mv ~/temp_deploy/* ${DEPLOY_CONFIG.remotePath}/ && rm -rf ~/temp_deploy"`;
        try {
            log('📄 上传 index.html...', 'blue');
            await execAsync(uploadIndexCommand);
            log('✅ index.html 上传到临时目录成功', 'green');
            log('📁 上传 assets 目录...', 'blue');
            await execAsync(uploadAssetsCommand);
            log('✅ assets 目录上传到临时目录成功', 'green');
            log('📦 移动文件到目标目录...', 'blue');
            await execAsync(moveFilesCommand);
            log('✅ 文件移动成功', 'green');
        } catch (error) {
            log(`❌ 文件上传失败: ${error.message}`, 'red');
            throw error;
        }
    }
}

// 验证部署结果（跨平台）
async function verifyDeployment() {
    log('🔍 验证部署结果...', 'blue');
    if (os.platform() === 'win32') {
        const ssh = new NodeSSH();
        await ssh.connect({
            host: DEPLOY_CONFIG.host,
            username: DEPLOY_CONFIG.username,
            password: DEPLOY_CONFIG.password,
        });
        const result = await ssh.execCommand(`ls -la ${DEPLOY_CONFIG.remotePath}/ | grep -E '(index.html|assets)'`);
        log('📋 远端文件列表:', 'cyan');
        console.log(result.stdout);
        log('✅ 部署验证完成', 'green');
        ssh.dispose();
    } else {
        const verifyCommand = `/opt/homebrew/bin/sshpass -p "${DEPLOY_CONFIG.password}" ssh -o StrictHostKeyChecking=no ${DEPLOY_CONFIG.username}@${DEPLOY_CONFIG.host} "sudo ls -la ${DEPLOY_CONFIG.remotePath}/ | grep -E '(index.html|assets)'"`;
        try {
            const { stdout } = await execAsync(verifyCommand);
            log('📋 远端文件列表:', 'cyan');
            console.log(stdout);
            log('✅ 部署验证完成', 'green');
        } catch (error) {
            log(`⚠️  验证部署结果时出现问题: ${error.message}`, 'yellow');
        }
    }
}

// 主部署函数
async function deploy() {
    console.log('=== 部署脚本已启动 ===');
    try {
        log('🚀 开始部署流程...', 'magenta');
        log(`📍 部署目标: ${DEPLOY_CONFIG.username}@${DEPLOY_CONFIG.host}:${DEPLOY_CONFIG.remotePath}`, 'cyan');

        // 1. 检查本地构建文件
        checkLocalBuild();

        // 2. 删除远端旧文件
        await removeRemoteFiles();

        // 3. 上传新文件
        await uploadFiles();

        // 4. 验证部署结果
        await verifyDeployment();

        log('🎉 部署完成！', 'green');
        log(`🌍 网站地址: ${DEPLOY_CONFIG.websiteUrl}`, 'cyan');

    } catch (error) {
        log(`❌ 部署失败: ${error.message}`, 'red');
        process.exit(1);
    }
}

// 如果直接运行此脚本
// 兼容 Windows 路径分隔符和 node 18+ import.meta.url 判断
import { fileURLToPath } from 'url';
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
    deploy();
}

export { deploy }; 