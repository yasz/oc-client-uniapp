import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import vitePluginUniRouter from "./src/uni-simple-router/compiler";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
  },
  css: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  plugins: [
    vitePluginUniRouter({
      pluginPath: `./uni-simple-router`,

    }),
    uni(),
  ],
});
