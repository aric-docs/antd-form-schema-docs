---
title: 快速开始
order: 0
---

# 快速开始

`@jswork/antd-form-schema` 用一份 schema 描述 Ant Design 表单：字段、校验、条件、标签、控件和值转换都写在数据里，页面布局仍由 JSX 决定。

## 环境要求

- React 与 React DOM
- Ant Design 5 及以上
- `classnames`（组件内部使用，安装时会自动带上）

## 安装

```bash
pnpm add @jswork/antd-form-schema antd
```

也可以使用 npm 或 yarn：

```bash
npm install @jswork/antd-form-schema antd
yarn add @jswork/antd-form-schema antd
```

## 最简示例

```tsx
import { Button } from 'antd';
import { SchemaForm } from '@jswork/antd-form-schema';
import type { FormSchema } from '@jswork/antd-form-schema';

const meta: FormSchema = {
  initialValues: { name: '', role: 'user' },
  fields: [
    { key: 'name', label: '姓名', widget: 'input', required: true },
    {
      key: 'role',
      label: '角色',
      widget: 'select',
      options: [
        { value: 'admin', label: '管理员' },
        { value: 'user', label: '普通用户' },
      ],
    },
  ],
};

export default () => (
  <SchemaForm meta={meta} onFinish={(values) => console.log(values)}>
    <Button type="primary" htmlType="submit">
      提交
    </Button>
  </SchemaForm>
);
```

`SchemaForm` 会自己创建 antd `Form`，自动使用 `meta.initialValues`，并把提交结果交给 `onFinish`。

## 三种使用方式

### 1. SchemaForm

适合绝大多数页面。内部管理 Form 实例，支持异步 meta、loading、提交前转换和 `onFormReady`。

```tsx
<SchemaForm meta={meta} onFinish={handleSubmit} />
```

### 2. SchemaFields

已经有自己的 `<Form>` 时使用，只渲染字段，不创建 Form。

```tsx
<Form form={form} initialValues={meta.initialValues}>
  <SchemaFields meta={meta} />
</Form>
```

### 3. useFormSchema

完全无 UI，适合分步表单、分组布局和自定义卡片。它返回字段数据，由你决定怎么渲染。

```tsx
const [form] = Form.useForm();
const { visibleFields } = useFormSchema(meta, form);

<Form form={form} initialValues={meta.initialValues}>
  {visibleFields.map((field) => (
    <Form.Item key={field.key} {...field.itemProps} label={field.label}>
      {field.control}
    </Form.Item>
  ))}
</Form>;
```

## 只写 key 的表单

如果项目里大量字段使用相同的 label 和 widget，可以把它们集中放在 presets 文件里：

```ts
const presets = {
  fields: { title: 'input', status: 'select' },
  labels: {
    'zh-CN': { title: '标题', status: '状态' },
    'en-US': { title: 'Title', status: 'Status' },
  },
};

const meta: FormSchema = {
  fields: [{ key: 'title' }, { key: 'status' }],
};

<SchemaForm meta={meta} presets={presets} locale="zh-CN" />;
```

schema 里显式写的 `label` / `widget` 永远优先，presets 只负责补缺。

## 项目结构

本站是纯文档项目，库本身位于独立仓库：

```text
antd-form-schema-docs
├── .dumirc.ts              # 文档站配置
├── docs
│   ├── index.md            # 首页
│   ├── guide               # 指南
│   │   ├── getting-started.md
│   │   └── form-schema.md
│   ├── playground          # 可运行示例
│   │   ├── index.md
│   │   └── demos
│   └── components          # 组件说明
├── public                  # 静态资源
└── workbox-config.cjs      # PWA 配置
```

## 常用命令

| 命令              | 作用                               |
| ----------------- | ---------------------------------- |
| `npm run dev`     | 启动本地文档站，默认监听 8000 端口 |
| `npm run build`   | 构建生产版本到 `dist/`             |
| `npm run preview` | 本地预览生产构建                   |

## 下一步

- [表单 Schema 全指南](/guide/form-schema) — 查看全部字段配置和特性
- [演练场](/playground) — 直接运行常用示例
- [组件说明](/components) — 了解各个入口组件
