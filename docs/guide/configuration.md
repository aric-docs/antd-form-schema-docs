---
title: 文档站配置
order: 1
---

# 文档站配置

本站基于 dumi 2 构建，主配置文件是项目根目录下的 `.dumirc.ts`。

## 基础配置

```ts
import { defineConfig } from 'dumi';

export default defineConfig({
  // 站点基础路径，部署到 GitHub Pages 子目录时需要
  base: '/antd-form-schema-docs/',

  // 静态资源公共路径
  publicPath: '/antd-form-schema-docs/',

  // 站点 logo
  logo: '/antd-form-schema-docs/logo.png',

  // 语言
  locales: [{ id: 'zh-CN', name: '中文' }],

  // 代码块解析方式
  resolve: {
    codeBlockMode: 'passive', // 'passive' 普通代码块 | 'active' 可交互
  },

  // 主题
  themeConfig: {
    name: 'antd-form-schema 文档',
    description: 'Ant Design 表单 schema 渲染器。',
    nav: [
      { title: '指南', link: '/guide/getting-started' },
      { title: '组件', link: '/components' },
      { title: '演练场', link: '/playground' },
    ],
    nprogress: true,
    socialLinks: {
      github: 'https://github.com/afeiship/antd-form-schema',
    },
  },

  // 自定义样式
  styles: ['/* 在这里写自定义 CSS */'],
});
```

## 导航

`themeConfig.nav` 控制顶部导航：

```ts
nav: [
  {
    title: '指南',              // 导航标题
    link: '/guide/getting-started', // 站内路径
  },
  {
    title: '组件',
    link: '/components',
  },
  {
    title: 'GitHub',
    link: 'https://github.com/afeiship/antd-form-schema', // 支持外链
  },
],
```

## 侧边栏

dumi 会根据目录结构自动生成侧边栏，顺序由每个 Markdown 文件 frontmatter 里的 `order` 决定：

```text
docs/
├── guide/
│   ├── getting-started.md    # /guide/getting-started
│   ├── configuration.md      # /guide/configuration
│   ├── deployment.md         # /guide/deployment
│   └── form-schema.md        # /guide/form-schema
└── components/
    └── index.md              # /components
```

## 自定义样式

在 `styles` 中传入 CSS 字符串：

```ts
styles: [
  `
  .dumi-default-sidebar {
    --dumi-sidebar-width: 320px;
  }
  `,
],
```

## 代码块

`resolve.codeBlockMode` 决定代码块是否变成可运行示例：

```ts
resolve: {
  // active：React 代码渲染为可交互演练场
  // passive：只显示普通代码块
  codeBlockMode: 'passive',
},
```

文档里的 `<code src="./demos/xxx.tsx">` 仍会渲染真实 demo，不受这个配置影响。

## 运行模式

dumi 支持三种模式：

- **文档模式**：标准文档页面，本站使用这一模式。
- **演示模式**：组件 demo 带实时预览。
- **站点模式**：通用网站。

## 更多配置

完整配置项见 [dumi 官方文档](https://d.umijs.org/config)。
