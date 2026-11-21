---
title: Field Converters
order: 3
---

# Field Converters

A converter adapts one field between its stored value and its control value. Register converters once, reference them by id in the schema, and the field keeps its own key. Use it for cents ↔ yuan, ratio ↔ percent, JSON string ↔ object, or any custom transformation.

## Set up a converter

```tsx
import type { FieldConverter, FormSchema } from '@jswork/antd-form-schema';

/** cents in storage <-> yuan in the control */
const money: FieldConverter = {
  read: (value) => (value == null ? value : Number(value) / 100),
  write: (value) => (value == null ? value : Math.round(Number(value) * 100)),
};

const meta: FormSchema = {
  initialValues: { price: 1999 },
  fields: [{ key: 'price', label: 'Price', widget: 'number', converter: 'money' }],
};

<SchemaForm meta={meta} converters={{ money }} />;
```

- `read(value, ctx)` maps the stored value to the control value. It runs for display and in view mode.
- `write(value, ctx)` maps the control value back to the stored value.
- `ctx` is `{ field, values, meta }`. Read the whole form through `values`, but never write other fields from a converter.
- Throwing inside a converter falls back to the raw value and warns in development.
- An unregistered converter id is a fatal error in development.

## Ordered chains

A field can pass through several converters in order. `read` runs left to right; `write` runs right to left, so the value can be restored.

```tsx
/** number <-> two-decimal string */
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

| Step | Value |
| --- | --- |
| Stored | `1999` |
| `money.read` | `19.99` |
| `fixed2.read` | `"19.99"` |
| User input | `"20.50"` |
| `fixed2.write` | `20.5` |
| `money.write` | `2050` |

Rules:

- Every member of a chain longer than one should implement both `read` and `write`. A missing `write` warns in development because write-back cannot be reversed reliably.
- An empty array `[]` means no conversion.
- A plain string keeps the original behavior, so existing schemas need no changes.
- An unknown id inside a chain is still a fatal error.

## Form-wide defaults

`meta.converters` maps a field key to a single id or a chain. A field's own `converter` replaces the whole form-level value.

```tsx
const meta: FormSchema = {
  initialValues: { price: 1999, discount: 0.125 },
  converters: {
    price: ['money', 'fixed2'],
    discount: ['ratio', 'fixed2'],
  },
  fields: [
    { key: 'price', widget: 'number' },
    // overrides the form-level value entirely
    { key: 'discount', widget: 'number', converter: 'ratio' },
  ],
};

<SchemaForm meta={meta} converters={{ money, fixed2, ratio }} />;
```

Precedence:

1. Field `converter`.
2. `meta.converters[field.key]`.
3. No converter, no conversion.

## Validation

- Every id in the effective chain must be registered.
- A converter cannot be combined with `valueType` on the same field.
- A chain longer than one warns when a member has no `write`.
- `meta.converters` entries are validated only when a field actually uses them.

## Escape hatch

Hooks set directly on the field still win over the converter chain:

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

## Types

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

`FieldSchema.converter`, `FormSchema.converters` values, and `BoundField.converter` all accept `string | string[]`.
