---
title: 演练场
order: 1
---

# 演练场

下面几个示例覆盖 `@jswork/antd-form-schema` 与 `@jswork/antd-form-schema-crud` 最常用的场景：基础表单、key 预设、声明式条件、字段值转换器、查看/编辑切换和列表查询插件。

## 基础表单

字段、初始值、校验和提交结果。

<code src="./demos/basic-form.tsx">基础表单</code>

## key 预设

schema 里只写 key，label 和 widget 由一份 presets 文件统一提供，并支持中英文切换。

<code src="./demos/presets.tsx">key 预设</code>

## 条件显示

用声明式 condition 控制字段显隐，依赖字段变化后自动重新计算，不需要手写 `onValuesChange`。

<code src="./demos/conditional.tsx">条件显示</code>

## 字段值转换器

`meta.converters` 配置全局转换器，支持单个 id 或按顺序执行的链。

<code src="./demos/converters.tsx">字段值转换器</code>

## 查看 / 编辑

同一份 schema 在编辑态和只读详情态之间切换。内置查看态的 `Descriptions` 配置、字段跨列和自定义内容见指南的「查看 / 编辑模式」章节。

<code src="./demos/view-edit.tsx">查看 / 编辑</code>

## 列表查询插件

`SchemaCrudList` 用 `query.slots` 接入查询控件。示例同时使用内置的 `keywords`、`status`，并用 `defineQueryPlugin` 自定义 `level` 插件。

<code src="./demos/list-query-plugins.tsx">列表查询插件</code>
