---
title: 指南
order: 0
---

# 指南

`@jswork/antd-form-schema` 用一份数据描述把字段、校验、条件、标签、控件和值转换组合起来，布局仍留在 JSX 中。

## 阅读顺序

1. [表单 Schema 全指南](./form-schema) — 覆盖 `SchemaForm`、`SchemaFields`、`useFormSchema`、widgets、presets、条件、查看态、converters、classNames/slots、异步 meta 等全部特性。
2. [项目级默认配置](./project-defaults) — 用 `configureSchemaForm` 统一 `presets`、`converters` 和 `locale`。
3. [CRUD 列表查询插件](./list-query-plugins) — `SchemaCrudList` 的 `query.slots`、内置 `keywords` / `status` 与外部 `defineQueryPlugin`。
4. [演练场](/playground) — 常用场景的可运行示例。

## 特性一览

- 三种渲染入口：`SchemaForm`、`SchemaFields`、无 UI 的 `useFormSchema`
- 14 个内置 widget：输入、数字、日期、单选、多选、开关、下拉、只读文本
- key presets：schema 只写 key，label 与 widget 统一配置，内置中英文常用标签
- 项目级默认：`configureSchemaForm` 统一 presets、converters 和 locale，表单级 props 按需覆盖
- 声明式条件：`and` / `or` / `not` 组合，自动追踪依赖
- 字段级 converter 与链式 converter，支持 `read` / `write` 双向
- 整表 `Descriptions` 查看态 / 字段级只读，枚举值自动显示 label
- 自定义 widget、classNames 和 slots
- 异步 meta、提交前整表转换
- CRUD 列表查询区：`query.slots`、内置 `keywords` / `status` 插件和外部 `defineQueryPlugin`

## 相关链接

- [GitHub 仓库](https://github.com/afeiship/antd-form-schema)
- [npm](https://www.npmjs.com/package/@jswork/antd-form-schema)
