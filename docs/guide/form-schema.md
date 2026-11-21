---
title: 表单 Schema 全指南
order: 3
---

# 表单 Schema 全指南

`@jswork/antd-form-schema` 是一个无 UI 的 Ant Design 表单 schema 渲染器：字段、校验、条件、标签、控件和值转换全部由数据描述，布局留在 JSX 里。

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

## 三种渲染方式

| 入口            | 适用场景                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `SchemaForm`    | 最常见。内部创建并管理 antd `Form`，自动注入 `meta.initialValues`，支持 `onFinish`、异步 meta、loading / error。 |
| `SchemaFields`  | 已经有自己的 `<Form>`。只渲染字段，不创建 Form；必须放在 Form 内。                                               |
| `useFormSchema` | 完全无 UI。返回 `BoundField[]`，由调用方决定每个字段的布局、分组、分步和样式。                                   |
| `FormFields`    | 轻量渲染器，接收 `useFormSchema` 返回的字段并渲染成 antd `Form.Item`。                                           |

`useFormSchema` 的典型用法：

```tsx
const [form] = Form.useForm();
const { visibleFields } = useFormSchema(meta, form, {
  presets,
  locale,
  converters,
});

<Form form={form} initialValues={meta.initialValues} layout="vertical">
  {visibleFields.map((field) => (
    <Form.Item
      key={field.key}
      {...field.itemProps}
      label={field.label}
      required={field.required}
    >
      {field.control}
    </Form.Item>
  ))}
</Form>;
```

注意：hook 不会替你创建 Form，也不会用 `meta.initialValues` 初始化表单；使用 `useFormSchema` 时要把 `initialValues` 传给自己的 `<Form>`。

## 组件 props

`SchemaForm` 在 antd `FormProps`（除 `form`、`initialValues`、`className`）之上增加：

| 属性                 | 说明                                                                    |
| -------------------- | ----------------------------------------------------------------------- |
| `meta`               | `FormSchema` 或返回 `FormSchema` 的 Promise。                           |
| `widgets`            | 局部 widget 注册表，覆盖内置 id。                                       |
| `presets` / `locale` | key 级 label 与 widget 预设，`locale` 默认 `zh-CN`。                    |
| `converters`         | 字段值转换器注册表。                                                    |
| `classNames`         | `form` / `field` / `label` / `control` 四组 class。                     |
| `slots`              | `label` / `control` / `field` 渲染插槽。                                |
| `normalizeValues`    | 提交前整表转换，优先于 `meta.normalizeValues`。                         |
| `loading` / `error`  | 异步 meta 的等待与失败占位，`loading` 默认 `Spin`，`error` 默认不渲染。 |
| `onFormReady`        | 内部 Form 实例就绪后回调一次，适合外部调用 `setFieldsValue`。           |
| `children`           | 渲染在字段之后，通常放提交按钮。                                        |

`SchemaFields` 接收同样的 `meta`、`widgets`、`presets`、`locale`、`converters`、`classNames`、`slots`、`loading`、`error`，但不创建 Form，必须放在 `<Form>` 内。

`FormFields` 只接收 `fields: BoundField[]`，按字段默认渲染 Form.Item，适合不需要自定义布局的 无 UI 场景。

## FormSchema 顶层配置

| 属性               | 类型                                 | 说明                                                   |
| ------------------ | ------------------------------------ | ------------------------------------------------------ |
| `fields`           | `FieldSchema[]`                      | 字段列表，必填。                                       |
| `initialValues`    | `Record<string, any>`                | 表单初始值。`SchemaForm` / `SchemaFields` 会自动使用。 |
| `viewMode`         | `boolean`                            | 整表只读模式，可被字段级 `viewMode` 覆盖。             |
| `disabled`         | `boolean`                            | 整表禁用，字段级 `disabled` 优先。                     |
| `converters`       | `Record<string, string \| string[]>` | 表单级转换器默认值，按字段 key 配置。                  |
| `normalizeValues`  | `(values) => values`                 | 提交前整表转换，`SchemaForm` 在 `onFinish` 前执行。    |
| `name` / `version` | `string`                             | 业务元信息，不参与渲染。                               |

## FieldSchema 字段配置

| 属性            | 类型                                             | 说明                                                                         |
| --------------- | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| `key`           | `string`                                         | 唯一 id。默认按 `.` 拆成 name path，例如 `user.name`。                       |
| `name`          | `NamePath`                                       | 显式数据路径，优先于 `key`。key 本身含点时可用 `!!!a.b` 转义。               |
| `widget`        | `string \| ComponentType`                        | 控件 id 或组件，默认 `input`。                                               |
| `viewWidget`    | `string \| ComponentType`                        | 只读模式下的控件，默认 `span`。                                              |
| `widgetProps`   | `Record<string, any>`                            | 透传给控件的 props，例如 `{ mode: 'multiple' }`。                            |
| `label`         | `ReactNode`                                      | 标签。显式配置优先于 presets 和内置标签。                                    |
| `className`     | `string`                                         | 该字段 Form.Item 的 className。                                              |
| `placeholder`   | `string`                                         | 控件占位文案。                                                               |
| `options`       | `OptionInput[]`                                  | 选项，支持字符串、`[value, label]`、`{ value, label, disabled }`。           |
| `required`      | `boolean`                                        | 快捷必填，内部转成 antd required rule。                                      |
| `rules`         | `Rule[]`                                         | 原生 antd 校验规则，原样透传。                                               |
| `condition`     | `Condition \| Function`                          | 声明式或函数式显隐条件。                                                     |
| `initialValue`  | `any`                                            | 字段级初始值数据，挂在 `BoundField` 上供自定义渲染使用；不会写入 antd Form。 |
| `disabled`      | `boolean`                                        | 禁用该控件。                                                                 |
| `readOnly`      | `boolean`                                        | 只读属性透传给控件。                                                         |
| `viewMode`      | `boolean`                                        | 字段级只读，覆盖表单级 `viewMode`。                                          |
| `watch`         | `NamePath[]`                                     | 函数式 condition 的显式依赖声明。                                            |
| `dependencies`  | `NamePath[]`                                     | 透传给 antd `Form.Item`。                                                    |
| `shouldUpdate`  | `boolean \| function`                            | 透传给 antd `Form.Item`。                                                    |
| `itemProps`     | `Partial<FormItemProps>`                         | 覆盖派生出的 Form.Item 属性，优先级最高。                                    |
| `valuePropName` | `string`                                         | 控件值属性，默认 `value`；checkbox / switch 类由 widget 自动设为 `checked`。 |
| `valueType`     | `'dayjs' \| 'string' \| 'number' \| 'timestamp'` | 日期控件的存储类型。                                                         |
| `valueFormat`   | `string`                                         | `valueType: 'string'` 时的日期格式，默认 `YYYY-MM-DD`。                      |
| `converter`     | `string \| string[]`                             | 字段值转换器 id 或链，不能与 `valueType` 同时使用。                          |

## 内置 widgets

| id               | 控件                   |
| ---------------- | ---------------------- |
| `input` / `text` | `Input`                |
| `password`       | `Input.Password`       |
| `textarea`       | `Input.TextArea`       |
| `number`         | `InputNumber`          |
| `date-picker`    | `DatePicker`           |
| `date-time`      | `DatePicker`（带时间） |
| `radio`          | `Radio`                |
| `radio-group`    | `Radio.Group`          |
| `checkbox`       | `Checkbox`             |
| `switch`         | `Switch`               |
| `checkbox-group` | `Checkbox.Group`       |
| `select`         | `Select`               |
| `span`           | 只读文本 `ViewSpan`    |

日期控件支持 `valueType`：

- `dayjs`（默认）：值保持 dayjs，不做转换；
- `string`：存储为 `valueFormat` 指定的字符串；
- `number` / `timestamp`：存储为毫秒时间戳。

## options 的三种写法

```ts
options: ['Low', 'Medium', 'High'];

options: [
  ['active', '活跃'],
  ['disabled', '禁用'],
];

options: [{ value: 'admin', label: '管理员', disabled: true }];
```

只读模式会把枚举值映射回 label；多选数组会用逗号拼接显示。

## 校验

```ts
{
  key: 'email',
  label: '邮箱',
  required: true,
  rules: [{ type: 'email', message: '邮箱格式不正确' }],
}
```

- `required` 是快捷写法，最终合并进 antd rules。
- `rules` 原样透传，支持 antd 的全部规则能力。
- `SchemaFields` / `SchemaForm` 内部在开发环境调用 `validateMeta`，未注册 widget、未注册 converter 会直接抛错；其余问题打印 warning。
- 可单独调用 `validateMeta(meta, widgets)` 获取 `Issue[]`。

## 条件显隐

```ts
{
  key: 'company',
  label: '公司名称',
  condition: { field: 'role', op: 'eq', value: 'admin' },
}
```

支持的运算符：

| op                          | 说明                                    |
| --------------------------- | --------------------------------------- |
| `eq` / `ne`                 | 严格相等 / 不等                         |
| `gt` / `gte` / `lt` / `lte` | 数值比较；无法转数字时按字符串比较      |
| `in` / `nin`                | 当前值是否在给定数组中                  |
| `empty` / `notEmpty`        | 空判断，覆盖 null、空串、空数组、空对象 |
| `includes`                  | 数组值是否包含给定项                    |

组合条件：

```ts
condition: {
  or: [
    { field: 'customerType', op: 'eq', value: '个人' },
    {
      and: [
        { field: 'customerType', op: 'eq', value: '企业' },
        { field: 'scale', op: 'gte', value: 100 },
      ],
    },
  ],
}
```

函数式条件：

```ts
condition: ({ values }) => Number(values.qty) > 10;
watch: ['qty'];
```

声明式条件会自动提取依赖字段，依赖变化后重新计算，不需要手写 `onValuesChange`。

## Key presets 与内置标签

presets 用于只写 key 的表单：schema 保留语义 key，label 和 widget 统一放在一个配置文件里。

```ts
const presets: Presets = {
  fields: {
    title: 'input',
    status: 'select',
    bio: 'textarea',
  },
  labels: {
    'zh-CN': { title: '标题', status: '状态', bio: '个人简介' },
    'en-US': { title: 'Title', status: 'Status', bio: 'Bio' },
  },
};

const meta: FormSchema = {
  fields: [{ key: 'title' }, { key: 'status' }, { key: 'bio' }],
};

<SchemaForm meta={meta} presets={presets} locale="zh-CN" />;
```

解析规则：

1. schema 显式写的 `label` / `widget` 优先。
2. 没有配置时使用 presets。
3. label 再回退到内置标签，最后回退到 key 本身。
4. 嵌套 key 先查完整 key，再查最后一段，例如 `user.name` → `name`。
5. `locale` 默认 `zh-CN`，指定语言缺失时回退到中文。

内置标签覆盖常见 key：`title`、`name`、`nickname`、`email`、`phone`、`mobile`、`password`、`avatar`、`status`、`remark`、`description`、`content`、`address`、`type`、`code`、`sort`、`enabled`、`createdAt`、`updatedAt`，并提供中英文。

## 字段值转换器

converter 负责在存储值和控件值之间做适配。实现放在 `SchemaForm` / `SchemaFields` / `useFormSchema` 的 `converters` prop 注册表里，schema 只引用 id。

```tsx
const money: FieldConverter = {
  read: (value) => (value == null ? value : Number(value) / 100),
  write: (value) => (value == null ? value : Math.round(Number(value) * 100)),
};

const meta: FormSchema = {
  initialValues: { price: 1999 },
  fields: [
    { key: 'price', label: '价格', widget: 'number', converter: 'money' },
  ],
};

<SchemaForm meta={meta} converters={{ money }} />;
```

- `read(value, ctx)`：存储值 → 控件值，用于回显和只读模式。
- `write(value, ctx)`：控件值 → 存储值。
- `ctx = { field, values, meta }`，可以读整表，但不要写其他字段。
- 抛错时回退原值，开发环境 warning；未注册 id 是致命错误。
- 与 `valueType` 互斥。
- `itemProps` 里显式写的 `getValueProps` / `getValueFromEvent` 优先于 converter。

### 链式转换

```ts
converter: ['money', 'fixed2'];
```

`read` 从左到右，`write` 从右到左：

```text
1999 → money.read(19.99) → fixed2.read("19.99") → 控件
"20.50" → fixed2.write(20.5) → money.write(2050) → 存储
```

- 链长大于 1 时，每个成员都应实现 `read` 和 `write`；缺少 `write` 会 warning。
- 空数组等同于不转换。
- 单字符串写法完全兼容。

### 表单级默认值

```ts
const meta: FormSchema = {
  converters: {
    price: ['money', 'fixed2'],
    discount: 'ratio',
  },
  fields: [{ key: 'price' }, { key: 'discount', converter: 'ratio' }],
};
```

优先级：字段 `converter` → `meta.converters[field.key]` → 不转换。字段配置整体覆盖表单级配置，不拼接。

## 查看 / 编辑模式

`viewMode` 打开后：

- 改用 `viewWidget` 渲染，默认是只读 `span`；
- 枚举值显示为选项 label；
- converter 只执行 `read`；
- 不挂载写回逻辑。

```tsx
<SchemaForm meta={{ ...meta, viewMode }} />
```

字段级 `viewMode` 可以单独控制某个字段。

## classNames 与 slots

`classNames` 只负责 class：

| key       | 作用范围                        |
| --------- | ------------------------------- |
| `form`    | antd Form，仅 `SchemaForm` 有效 |
| `field`   | 每个 Form.Item                  |
| `label`   | label 内容外层                  |
| `control` | 值绑定控件                      |

`slots` 用于替换字段的局部渲染：

```tsx
const slots: FormSlots = {
  label: ({ field }) => <abbr title="说明">{field.label}</abbr>,
  control: ({ control, field }) => (
    <div>
      {control}
      {field.key === 'age' && <span> 岁</span>}
    </div>
  ),
};
```

- `label`：替换 label 内容，antd 仍保留 `<label htmlFor>` 和必填星号。
- `control`：包装控件。
- `field`：替换整个 Form.Item。

## 异步 meta

`SchemaForm` / `SchemaFields` 的 `meta` 可以是 Promise：

```tsx
<SchemaForm meta={fetchMeta()} loading={<Spin />} error={<Empty />} />
```

- pending 时渲染 `loading`，默认 antd `Spin`；传 `null` 表示不渲染。
- reject 时渲染 `error`，默认不渲染。
- 后一次 meta 覆盖前一次，过期的 resolve 会被忽略。

## 提交前整表转换

```tsx
<SchemaForm
  meta={meta}
  normalizeValues={(values) => ({
    ...values,
    total: Number(values.price ?? 0) * Number(values.qty ?? 0),
  })}
/>
```

`SchemaForm` 的 `normalizeValues` prop 优先于 `meta.normalizeValues`；只作用于 `onFinish`，不改变表单内值。

## useFormSchema 返回值

| 属性            | 说明                                    |
| --------------- | --------------------------------------- |
| `fields`        | 全部字段的 `BoundField`，含不可见字段。 |
| `visibleFields` | 过滤掉 `visible = false` 的字段。       |
| `getField(key)` | 按 key 取单个字段。                     |
| `issues`        | 开发环境校验产生的 `Issue[]`。          |

`BoundField` 主要包含：

- `key` / `name` / `widget` / `label` / `className` / `options`
- `visible` / `viewMode` / `disabled` / `required`
- `itemProps`：可直接展开给 antd `Form.Item`
- `control`：已经绑定好的控件 React 元素
- `controlProps`：控件原始 props
- `viewContent` / `WidgetComponent`
- `converter`：实际生效的转换器 id 或链，便于调试

## 自定义 widget

```tsx
const widgets: Record<string, WidgetDef> = {
  'radio-button': { component: Radio.Group },
};

{
  key: 'priority',
  widget: 'radio-button',
  widgetProps: { optionType: 'button', buttonStyle: 'solid' },
  options: ['Low', 'Medium', 'High'],
}
```

- 本地 `widgets` 优先于内置控件，可以覆盖同名 id。
- `WidgetDef.metaConverter` 可在渲染前补充 `widgetProps` 或 `itemProps`，日期控件就是这样处理 `valueType` 的。
- `widget` 也可以直接传组件本身，适合一次性场景。

## 开发期校验

`validateMeta` 检查：

- `fields` 是否为数组、key 是否缺失或重复；
- widget 是否注册；
- `options` 是否为数组；
- `valueType` 是否合法；
- converter 是否注册、是否与 `valueType` 冲突、链成员是否缺 `write`；
- condition、规则等基础结构。

开发环境默认启用；生产环境不执行校验。未注册 widget / converter 会抛错，其余只打印 warning。

## 导出 API

```ts
import {
  SchemaForm,
  SchemaFields,
  FormFields,
  useFormSchema,
  validateMeta,
  normalizeMeta,
  evaluateCondition,
  collectWatchPaths,
} from '@jswork/antd-form-schema';
```

类型导出包括 `FormSchema`、`FieldSchema`、`BoundField`、`WidgetDef`、`Presets`、`FieldConverter`、`ConverterContext`、`Issue` 等。
