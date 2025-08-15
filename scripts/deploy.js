#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { deployConfig } from '../deploy.config.js';

const execAsync = promisify(exec);

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

// 删除远端文件
async function removeRemoteFiles() {
    log('🗑️  删除远端旧文件...', 'yellow');

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

// 上传文件到远端
async function uploadFiles() {
    log('📤 上传新文件到远端...', 'blue');

    // 首先在远程创建临时目录
    const createTempDirCommand = `/opt/homebrew/bin/sshpass -p "${DEPLOY_CONFIG.password}" ssh -o StrictHostKeyChecking=no ${DEPLOY_CONFIG.username}@${DEPLOY_CONFIG.host} "mkdir -p ~/temp_deploy"`;
    await execAsync(createTempDirCommand);

    // 上传到临时目录
    // 上传 index.html
    const uploadIndexCommand = `/opt/homebrew/bin/sshpass -p "${DEPLOY_CONFIG.password}" scp -o StrictHostKeyChecking=no ${DEPLOY_CONFIG.localBuildPath}/index.html ${DEPLOY_CONFIG.username}@${DEPLOY_CONFIG.host}:~/temp_deploy/`;

    // 上传 assets 目录
    const uploadAssetsCommand = `/opt/homebrew/bin/sshpass -p "${DEPLOY_CONFIG.password}" scp -o StrictHostKeyChecking=no -r ${DEPLOY_CONFIG.localBuildPath}/assets ${DEPLOY_CONFIG.username}@${DEPLOY_CONFIG.host}:~/temp_deploy/`;

    // 移动文件到目标目录的命令（使用sudo）
    const moveFilesCommand = `/opt/homebrew/bin/sshpass -p "${DEPLOY_CONFIG.password}" ssh -o StrictHostKeyChecking=no ${DEPLOY_CONFIG.username}@${DEPLOY_CONFIG.host} "sudo mv ~/temp_deploy/* ${DEPLOY_CONFIG.remotePath}/ && rm -rf ~/temp_deploy"`;    try {
        // 上传 index.html
        log('📄 上传 index.html...', 'blue');
        await execAsync(uploadIndexCommand);
        log('✅ index.html 上传到临时目录成功', 'green');

        // 上传 assets 目录
        log('📁 上传 assets 目录...', 'blue');
        await execAsync(uploadAssetsCommand);
        log('✅ assets 目录上传到临时目录成功', 'green');

        // 移动文件到目标目录
        log('📦 移动文件到目标目录...', 'blue');
        await execAsync(moveFilesCommand);
        log('✅ 文件移动成功', 'green');

    } catch (error) {
        log(`❌ 文件上传失败: ${error.message}`, 'red');
        throw error;
    }
}

// 验证部署结果
async function verifyDeployment() {
    log('🔍 验证部署结果...', 'blue');

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

// 主部署函数
async function deploy() {
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
if (import.meta.url === `file://${process.argv[1]}`) {
    deploy();
}

export { deploy }; 