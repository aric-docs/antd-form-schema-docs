---
title: 部署
order: 2
---

# 部署

本站是纯静态站点，构建产物可以直接放到任意静态托管服务。

## 构建生产版本

```bash
npm run build
```

构建会做三件事：

1. 使用 dumi 生成静态页面；
2. 通过 workbox 生成 PWA service worker；
3. 把产物输出到 `dist/`。

## 部署方式

### GitHub Pages

1. 修改 `.dumirc.ts` 中的路径：

```ts
export default defineConfig({
  base: '/your-repo-name/',
  publicPath: '/your-repo-name/',
});
```

2. 构建并使用 `gh-pages` 发布：

```bash
npm run build

npx gh-pages -d dist
```

也可以把发布命令写进 `package.json`：

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Netlify

1. 在 Netlify 中关联仓库；
2. 配置构建参数：

```text
构建命令：npm run build
发布目录：dist
```

3. 之后每次 push 自动部署。

### Vercel

1. 在 Vercel 中关联仓库；
2. 配置构建参数：

```text
构建命令：npm run build
输出目录：dist
```

3. 之后每次 push 自动部署。

### 自有服务器

把 `dist/` 交给任意静态文件服务器即可：

```bash
# 使用 serve
npx serve dist

# 使用 http-server
npx http-server dist
```

## PWA

项目通过 workbox 提供 PWA 能力，构建时会自动生成 service worker。

缓存策略在 `workbox-config.cjs` 中调整：

```js
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{js,png,svg,json,txt,css,map}'],
  swDest: 'dist/sw.js',
  runtimeCaching: [
    // 在这里添加运行时缓存策略
  ],
};
```

## 环境变量

`.dumirc.ts` 中可以直接读取环境变量：

```bash
# .env
MY_VARIABLE=value
```

```ts
export default defineConfig({
  themeConfig: {
    name: process.env.MY_VARIABLE,
  },
});
```

## 部署前预览

```bash
npm run build
npm run preview
```

`preview` 会在本地启动生产构建，方便上线前检查。

## CI/CD

GitHub Actions 示例：

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```
