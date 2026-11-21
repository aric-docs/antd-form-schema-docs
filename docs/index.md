---
title: antd-form-schema 文档
hero:
  title: antd-form-schema
  description: 用一份 schema 描述 Ant Design 表单的字段、校验、条件、标签和值转换。
  actions:
    - text: 快速开始
      link: /guide/getting-started
    - text: GitHub
      link: https://github.com/afeiship/antd-form-schema
features:
  - title: 数据驱动
    emoji: 📋
    description: 字段、校验、条件、标签和控件全部写在 schema 里，布局仍由 JSX 控制。
  - title: key 预设
    emoji: 🏷️
    description: schema 只写 key，label 与 widget 从统一配置自动补齐，内置常用中英文标签。
  - title: 条件联动
    emoji: 🔀
    description: 声明式 and / or / not 组合，自动追踪依赖字段，不需要手写 onValuesChange。
  - title: 值转换器
    emoji: 🔁
    description: 存储值与控件值双向转换，支持链式组合和表单级默认配置。
  - title: 查看 / 编辑
    emoji: 👁️
    description: 同一份 schema 在编辑态与只读详情态之间切换，枚举值自动显示 label。
  - title: 可扩展
    emoji: 🧩
    description: 自定义 widget、classNames、slots，并提供无 UI 的 useFormSchema。
---

## 安装

```bash
pnpm add @jswork/antd-form-schema antd
```

## 快速开始

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

<SchemaForm meta={meta} onFinish={(values) => console.log(values)}>
  <Button type="primary" htmlType="submit">
    提交
  </Button>
</SchemaForm>;
```

## 文档导航

- [快速开始](/guide/getting-started) — 安装、渲染入口和目录结构
- [表单 Schema 全指南](/guide/form-schema) — 全部配置项与特性
- [演练场](/playground) — 可直接运行的常用示例
