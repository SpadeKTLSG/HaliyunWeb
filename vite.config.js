import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig(() => {
  return {
    // 插件配置
    plugins: [
      vue(),
      // 自动引入内容
      AutoImport({
        imports: ['vue', 'vue-router'],
        dirs: ['src/utils/**'],
        resolvers: [ElementPlusResolver()],
        dts: 'imports.d.ts',
        eslintrc: {
          enabled: false
        }
      }),
      // 自动引入组件
      Components({
        dirs: ['src/compo/**'],
        resolvers: [ElementPlusResolver()],
        dts: 'compo.d.ts'
      }),
      // eslint
      eslintPlugin({
        include: ['src/**/*.js', 'src/!**/!*.vue', 'src/!*.js', 'src/!*.vue']
      }),
      viteCompression({
        threshold: 10240 // 对大于 10KB 的文件进行压缩
      })
    ],
    // 服务配置
    server: {
      host: true,
      port: 10000,
      open: true
    },
    // 解析配置
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 设置 @ 指向 src
      }
    },
    // 构建配置
    build: {
      // Base
      base: './',
      //
      rollupOptions: {
        // 静态资源分类打包
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          // 静态资源分拆打包
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      },
      sourcemap: false,
      target: 'es2015',
      reportCompressedSize: false
    }
  }
})
