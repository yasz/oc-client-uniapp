/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{html,js,ts,jsx,tsx,vue}',
  ],
  corePlugins: {
    preflight: false // 小程序端建议关闭 preflight
  }
}