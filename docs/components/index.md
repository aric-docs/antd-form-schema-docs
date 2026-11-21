---
title: 组件总览
order: 0
---

# 组件总览

库提供三个渲染入口和一个无 UI hook，全部基于 antd 5 的 `Form`。

## SchemaForm

内部创建并管理 antd `Form`，适合独立表单页面。

```tsx
<SchemaForm
  meta={meta}
  presets={presets}
  locale="zh-CN"
  converters={{ money }}
  onFinish={(values) => save(values)}
/>
```

主要能力：

- 自动使用 `meta.initialValues`；
- 支持 Promise 形式的异步 meta；
- 支持 `loading` / `error` 占位；
- 提供 `onFormReady` 获取内部 Form 实例；
- 支持 `slots`、`classNames`、`normalizeValues`。

完整 props 见[全指南](/guide/form-schema#组件-props)。

## SchemaFields

只渲染字段，不创建 Form，必须放在已有的 `<Form>` 内。

```tsx
<Form form={form} initialValues={meta.initialValues}>
  <SchemaFields meta={meta} />
</Form>
```

如果当前上下文没有 Form，会直接抛错：`SchemaFields must be used inside a <Form>.`

## FormFields

接收 `useFormSchema` 计算出的 `BoundField[]`，按字段默认渲染成 `Form.Item`。适合不需要自定义布局、但想自己控制 Form 的场景。

## useFormSchema

无 UI hook，返回 `{ fields, visibleFields, getField, issues }`，不产生任何 UI。

```ts
const { visibleFields } = useFormSchema(meta, form, {
  presets,
  locale,
  converters,
});
```

适合分步表单、折叠面板、卡片分组和自定义栅格布局。

## 相关文档

- [表单 Schema 全指南](/guide/form-schema)
- [快速开始](/guide/getting-started)
- [演练场](/playground)
