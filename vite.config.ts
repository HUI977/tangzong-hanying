import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 部署在子目录（如 https://archmap.cn/TZHY/）：资源用相对路径引用
  base: './',
  plugins: [vue()],
})
