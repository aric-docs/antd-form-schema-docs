---
title: Playground
order: 1
---

# Playground

下面几个 demo 覆盖 `@jswork/antd-form-schema` 最常用的场景：基础表单、key presets、声明式条件、字段值转换器和查看/编辑切换。

## 基础表单

字段、初始值、校验和提交结果。

<code src="./demos/basic-form.tsx">基础表单</code>

## Key Presets

schema 里只写 key，label 和 widget 由一份 presets 文件统一提供，并支持中英文切换。

<code src="./demos/presets.tsx">Key Presets</code>

## 条件显示

用声明式 condition 控制字段显隐，依赖字段变化后自动重新计算，不需要手写 `onValuesChange`。

<code src="./demos/conditional.tsx">条件显示</code>

## 字段值转换器

`meta.converters` 配置全局转换器，支持单个 id 或按顺序执行的链。

<code src="./demos/converters.tsx">字段值转换器</code>

## 查看 / 编辑

同一份 schema 在编辑态和只读详情态之间切换，view 模式自动把枚举值显示为选项 label。

<code src="./demos/view-edit.tsx">查看 / 编辑</code>
