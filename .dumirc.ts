import { defineConfig } from 'dumi';
import * as path from 'node:path';

export default defineConfig({
  alias: {
    '@builtins': path.resolve(__dirname, '.dumi/theme/builtins'),
  },
  base: '/antd-form-schema-docs/',
  publicPath: '/antd-form-schema-docs/',
  logo: '/antd-form-schema-docs/logo.png',
  locales: [{ id: 'zh-CN', name: '中文' }],
  resolve: {
    codeBlockMode: 'passive',
  },
  themeConfig: {
    name: 'antd-form-schema 文档',
    description: 'Ant Design 表单 schema 渲染器文档。',
    nav: [
      {
        title: '指南',
        link: '/guide/getting-started',
      },
      {
        title: '组件',
        link: '/components',
      },
      {
        title: '演练场',
        link: '/playground',
      },
    ],
    nprogress: true,
    socialLinks: {
      github: 'https://github.com/afeiship/antd-form-schema',
    },
  },
  plugins: ['@umijs/plugins/dist/tailwindcss'],
  tailwindcss: {},
});
