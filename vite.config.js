import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@views": path.resolve(__dirname, "src/views"),
      "@comp": path.resolve(__dirname, "src/components"),
      "@router": path.resolve(__dirname, "src/router"),
      "@api": path.resolve(__dirname, "src/api"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 引入全局 SCSS 变量文件
        additionalData: `
        @import "@/assets/css/color.scss";
        `,
      },
    },
  },
  server: {
    hmr: true,
    proxy: {
      "/api": {
        target: "http://agent.hebeirongshi.com",
        changeOrigin: true,
      },
      "/coze": {
        target: "https://api.coze.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/coze/, ""),
      }
    },
  },
});
