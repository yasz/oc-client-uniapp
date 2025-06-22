// 部署配置文件
export const deployConfig = {
    // 服务器配置
    host: '112.124.70.72',
    username: 'root', // 根据实际情况修改用户名

    // 远端路径
    remotePath: '/www/wwwroot/lifefunchinese.cc',

    // 本地构建路径
    localBuildPath: './dist/build/h5',

    // 网站地址
    websiteUrl: 'http://lifefunchinese.cc',

    // SSH 连接配置
    sshConfig: {
        port: 22,
        privateKey: './scripts/112.124.70.72_epyc1.pem', // SSH 私钥路径
        connectTimeout: 30000,
    }
};

export default deployConfig; 