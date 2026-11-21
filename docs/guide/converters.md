---
title: 字段值转换器
order: 3
---

# 字段值转换器

转换器负责在「存储值」和「控件值」之间做适配。它在注册表里定义一次，schema 里只引用 id，字段本身的 key 保持不变。适用于金额分 ↔ 元、比例 ↔ 百分比、JSON 字符串 ↔ 对象等场景。

## 配置单个转换器

```tsx
import type { FieldConverter, FormSchema } from '@jswork/antd-form-schema';

/** 存储：分；控件：元 */
const money: FieldConverter = {
  read: (value) => (value == null ? value : Number(value) / 100),
  write: (value) => (value == null ? value : Math.round(Number(value) * 100)),
};

const meta: FormSchema = {
  initialValues: { price: 1999 },
  fields: [{ key: 'price', label: '价格', widget: 'number', converter: 'money' }],
};

<SchemaForm meta={meta} converters={{ money }} />;
```

- `read(value, ctx)`：存储值 → 控件值，用于回显和视图模式。
- `write(value, ctx)`：控件值 → 存储值，用于用户输入回写。
- `ctx` 是 `{ field, values, meta }`。可以通过 `values` 读取整张表单，但不要写其他字段。
- 转换器内部抛错时回退原值，开发环境打印 warning。
- 引用了未注册的 id 时，开发环境直接报错。

## 链式转换

一个字段可以按顺序经过多个转换器。`read` 从左到右执行，`write` 从右到左执行，保证值能还原。

```tsx
/** number ↔ 保留两位小数的字符串 */
const fixed2: FieldConverter = {
  read: (value) => (value == null ? value : Number(value).toFixed(2)),
  write: (value) => (value == null || value === '' ? value : Number(value)),
};

const meta: FormSchema = {
  initialValues: { price: 1999 },
  fields: [{ key: 'price', converter: ['money', 'fixed2'] }],
};

<SchemaForm meta={meta} converters={{ money, fixed2 }} />;
```

| 阶段 | 值 |
| --- | --- |
| 存储值 | `1999` |
| `money.read` | `19.99` |
| `fixed2.read` | `"19.99"` |
| 用户输入 | `"20.50"` |
| `fixed2.write` | `20.5` |
| `money.write` | `2050` |

规则：

- 链长度大于 1 时，每个成员都应同时实现 `read` 和 `write`。缺少 `write` 会破坏写回的可逆性，开发环境会给出 warning。
- 空数组 `[]` 等同于不转换。
- 单个字符串保持原有行为，已有 schema 不需要改动。
- 链中出现未注册 id，仍然是致命错误。

## 表单级默认值

`meta.converters` 按字段 key 配置默认转换器，值可以是单个 id，也可以是链。字段自己的 `converter` 会整体覆盖表单级配置。

```tsx
const meta: FormSchema = {
  initialValues: { price: 1999, discount: 0.125 },
  converters: {
    price: ['money', 'fixed2'],
    discount: 'ratio',
  },
  fields: [
    { key: 'price', widget: 'number' },
    // 整体覆盖上面的表单级配置
    { key: 'discount', widget: 'number', converter: 'ratio' },
  ],
};

<SchemaForm meta={meta} converters={{ money, fixed2, ratio }} />;
```

生效顺序：

1. 字段自己的 `converter`。
2. `meta.converters[field.key]`。
3. 都没有配置，不转换。

## 校验规则

- 生效链中的每个 id 都必须已注册。
- 同一个字段不能同时配置 converter 和 `valueType`。
- 链长大于 1 且成员缺少 `write` 时，开发环境给出 warning。
- `meta.converters` 中的条目只在被字段实际使用时校验。

## 逃生舱

字段 `itemProps` 里显式写的 `getValueProps` / `getValueFromEvent` 优先于整条转换链：

```tsx
{
  key: 'price',
  converter: ['money', 'fixed2'],
  itemProps: {
    getValueProps: (value) => ({ value: value }),
    getValueFromEvent: (event) => event.target.value,
  },
}
```

## 类型定义

```ts
interface FieldConverter {
  read?: (value: any, ctx: ConverterContext) => any;
  write?: (value: any, ctx: ConverterContext) => any;
}

interface ConverterContext {
  field: NormalizedField;
  values: Record<string, any>;
  meta: FormSchema;
}
```

`FieldSchema.converter`、`FormSchema.converters` 的值以及 `BoundField.converter` 都支持 `string | string[]`。
