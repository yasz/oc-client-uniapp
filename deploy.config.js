// 部署配置文件
export const deployConfig = {
    // 服务器配置
    host: '129.226.175.66',
    username: 'ubuntu', // 服务器用户名
    password: 'PQ)g!bC6{4-}*', // 服务器密码

    // 远端路径
    remotePath: '/www/wwwroot/origin-www.lifefunchinese.cc',

    // 本地构建路径
    localBuildPath: './dist/build/h5',

    // 网站地址
    websiteUrl: 'https://lifefunchinese.cc',

    // SSH 连接配置
    sshConfig: {
        port: 22,
        connectTimeout: 30000,
        privateKey: '', // 使用密码认证，不需要私钥
    }
};

export default deployConfig; 