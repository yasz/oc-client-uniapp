import axios from 'axios';
import fs from 'fs';  // 导入文件系统模块
import dotenv from "dotenv";
const result = dotenv.config();

for (const key in result.parsed) {
  if (result.parsed.hasOwnProperty(key)) {
    process.env[key] = result.parsed[key];
  }
}

// 模拟登录的函数
export async function signIn(email, password) {
  try {
    const response = await axios.post(`${process.env.VITE_API_ENDPOINT}/auth:signIn`, {
      email,     // 将用户名改为 email
      password,  // 密码字段
    }, {
      headers: {
        'Content-Type': 'application/json',  // 确保内容类型是 JSON
        'x-authenticator': 'basic',          // 根据之前的请求，可能需要的认证器头
      }
    });

    const token = response.data.data.token;
    // 存储 token，以供后续使用
    console.log('登录成功，获取的 Token:', token);
    return token;
  } catch (error) {
    console.error('登录失败:', error);
  }
}

// 获取 Swagger 文档的函数
async function getSwaggerDocs(token) {
  try {
    const response = await axios.get(`${process.env.VITE_API_ENDPOINT}/swagger:get?ns=collections`, {
      headers: {
        'Authorization': `Bearer ${token}`,  // 将 token 添加到请求头
      },
    });

    const swaggerData = response.data;
    console.log('Swagger 文档:', swaggerData);

    // 将 Swagger 文档保存到本地文件
    fs.writeFileSync('swagger-docs.json', JSON.stringify(swaggerData, null, 2));  // 格式化为 JSON 并保存
    console.log('Swagger 文档已保存到 swagger-docs.json');
  } catch (error) {
    console.error('获取 Swagger 文档失败:', error);
  }
}

// 调用示例
async function main() {
  const token = await signIn('admin@nocobase.com', 'admin123');  // 实际的用户名和密码
  if (token) {
    await getSwaggerDocs(token);
  }
}

main();
