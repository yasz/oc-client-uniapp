/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{html,js,ts,jsx,tsx,vue}',
  ],
  corePlugins: {
    preflight: false // 小程序端建议关闭 preflight
  },
  theme: {
    extend: {

      backgroundImage: {
        'gradient-yellow': 'linear-gradient(180deg, #F9B33B 0%, #F59743 100%)',
      },
    },
  },
}