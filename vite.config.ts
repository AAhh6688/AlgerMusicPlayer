import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import VueDevTools from 'vite-plugin-vue-devtools';
// 预先获取根目录绝对路径
const rootPath = resolve(__dirname);
export default defineConfig({
base: './',
// 保持 root 指向 src/renderer
root: resolve(rootPath, 'src/renderer'),
resolve: {
alias: {
// 使用绝对路径明确指向，避免 ../ 导致的解析错误
'@': resolve(rootPath, 'src/renderer'),
'@renderer': resolve(rootPath, 'src/renderer'),
'@i18n': resolve(rootPath, 'src/i18n')
}
},
build: {
// 强制输出到项目根目录下的 dist 文件夹
outDir: resolve(rootPath, 'dist'),
emptyOutDir: true,
target: 'esnext' // 解决之前提到的 top-level await 报错
},
plugins: [
vue(),
viteCompression(),
VueDevTools(),
AutoImport({
imports: [
'vue',
{
'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
}
]
}),
Components({
resolvers: [NaiveUiResolver()]
})
],
// 修正资源目录指向
publicDir: resolve(rootPath, 'resources'),
server: {
host: '0.0.0.0',
proxy: {}
}
});
