// 测试环境部署配置文件
export const deployConfig = {
    // 服务器配置
    host: '10.0.0.62',
    username: 'root',
    password: 'ruianVA123',

    // 远端路径
    remotePath: '/www/wwwroot/10.0.0.62',

    // 本地构建路径
    localBuildPath: './dist/build/h5',

    // 网站地址
    websiteUrl: 'http://10.0.0.62',

    // SSH 连接配置
    sshConfig: {
        port: 22,
        connectTimeout: 30000,
    }
};

export default deployConfig; 