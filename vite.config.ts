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

// ===== 音乐 API 配置 =====
const MUSIC_APIS = {
  // 网易云音乐 API（3 个备选）
  netease: [
    'https://netease-cloud-music-api-ruby.vercel.app',
    'https://music-api.leanapp.cn',
    'https://netease-api.vercel.app'
  ],
  // QQ 音乐 API（3 个备选）
  qq: [
    'https://u.y.qq.com',
    'https://qq-music-api.vercel.app',
    'https://qqmusic-api.vercel.app'
  ],
  // 酷狗音乐 API（3 个备选）
  kugou: [
    'https://kugoumusicapi.4everland.app',
    'https://kugou-music-api.vercel.app',
    'https://api.kugou.com'
  ],
  // 酷我音乐 API（3 个备选）
  kuwo: [
    'https://www.kuwo.cn/api',
    'https://kuwo-music-api.vercel.app',
    'https://api.kuwo.cn'
  ]
};

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
    // ===== API 代理配置 =====
    proxy: {
      // 网易云音乐代理
      '/api/netease': {
        target: MUSIC_APIS.netease[0],
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/netease/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      // QQ 音乐代理
      '/api/qq': {
        target: MUSIC_APIS.qq[0],
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/qq/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      // 酷狗音乐代理
      '/api/kugou': {
        target: MUSIC_APIS.kugou[0],
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kugou/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      // 酷我音乐代理
      '/api/kuwo': {
        target: MUSIC_APIS.kuwo[0],
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kuwo/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    }
  }
});
