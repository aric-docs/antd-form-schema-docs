---
title: 项目级默认配置
order: 4
---

# 项目级默认配置

`configureSchemaForm` 把 `presets`、`converters`、`locale` 放到项目入口配置一次，之后所有 `SchemaForm`、`SchemaFields` 和 `useFormSchema` 自动继承，不用在每个表单里重复传 props。

```tsx
// src/main.tsx
import { configureSchemaForm } from '@jswork/antd-form-schema';
import { projectPresets, projectConverters } from './schema-config';

configureSchemaForm({
  locale: 'zh-CN',
  presets: projectPresets,
  converters: projectConverters,
});
```

配置完成后，普通表单可以直接省略这三项：

```tsx
<SchemaForm meta={meta} />
```

只覆盖当前表单需要的部分：

```tsx
<SchemaForm meta={meta} locale="en-US" converters={{ ratio }} />
```

## API

| API                       | 签名                                     | 说明                               |
| ------------------------- | ---------------------------------------- | ---------------------------------- |
| `configureSchemaForm`     | `(defaults: SchemaFormDefaults) => void` | 写入项目级默认，按顶层字段浅合并。 |
| `getSchemaFormDefaults`   | `() => SchemaFormDefaults`               | 返回当前默认的快照。               |
| `resetSchemaFormDefaults` | `() => void`                             | 清空全部项目级默认，回到内置行为。 |

### SchemaFormDefaults

```ts
interface SchemaFormDefaults {
  presets?: Presets;
  converters?: Record<string, FieldConverter>;
  locale?: string;
}
```

| 字段         | 类型                             | 说明                                                  |
| ------------ | -------------------------------- | ----------------------------------------------------- |
| `presets`    | `Presets`                        | 默认的 key presets，按字段 key 和 locale 合并。       |
| `converters` | `Record<string, FieldConverter>` | 默认转换器注册表，key 是 converter id，不是字段 key。 |
| `locale`     | `string`                         | 默认语言，最终回退到 `zh-CN`。                        |

只有这三类会进入项目级默认。`widgets`、`classNames`、`slots`、`normalizeValues`、`view` 等仍由每个表单自己传。

## 作用范围

| 入口            | 是否读取项目级默认 | 说明                                               |
| --------------- | ------------------ | -------------------------------------------------- |
| `SchemaForm`    | 是                 | 通过内部 `useFormSchema` 读取。                    |
| `SchemaFields`  | 是                 | 同上，需要放在已有 `<Form>` 内。                   |
| `useFormSchema` | 是                 | 无 UI 用法同样继承。                               |
| `FormFields`    | 否                 | 只接收已经生成好的 `BoundField[]`，不创建 schema。 |

## 优先级

总规则：**表单级 props → 项目级默认 → 内置回退**。

### presets

表单级和项目级不是整体替换，而是按字段 key、按 locale 合并：

- `fields` 按 key 合并，同名字段以表单级为准；
- `labels[locale]` 按文案 key 合并，同名以表单级为准；
- 项目级有、表单级没有的条目继续生效。

```tsx
configureSchemaForm({
  locale: 'zh-CN',
  presets: {
    labels: {
      'zh-CN': { title: '全局标题', status: '状态' },
    },
  },
});

<SchemaForm
  meta={{ fields: [{ key: 'title' }, { key: 'status' }] }}
  presets={{ labels: { 'zh-CN': { title: '本地标题' } } }}
/>;
```

结果：`title` 显示“本地标题”，`status` 仍显示项目级的“状态”。

### converters

`converters` 是转换器注册表，按 id 合并：

- 同 id 时表单级实现覆盖项目级；
- 其他 id 继续保留，项目级注册的转换器仍然可用。

```tsx
configureSchemaForm({
  converters: {
    money: projectMoney,
    ratio: projectRatio,
  },
});

<SchemaForm
  meta={meta}
  converters={{
    money: localMoney,
  }}
/>;
```

结果：字段引用 `money` 时使用 `localMoney`，引用 `ratio` 时仍使用项目级 `projectRatio`。

### locale

```ts
const locale = formProps.locale ?? projectDefaults.locale ?? 'zh-CN';
```

表单级 `locale` 优先；没有时才用项目级；最后回退到内置 `zh-CN`。

## 多次调用 configureSchemaForm

`configureSchemaForm` 按顶层字段浅合并，不是深度合并：

- 传了 `presets` 就整体替换旧的全局 `presets`；
- 传了 `converters` 就整体替换旧的全局转换器注册表；
- 传了 `locale` 就替换旧的全局语言；
- 没传的顶层字段保持原值，传 `undefined` 等同于没传。

```ts
configureSchemaForm({ presets: projectPresets, locale: 'zh-CN' });
configureSchemaForm({ converters: { money } });
```

第二次调用只替换 `converters`，`presets` 和 `locale` 仍然是第一次的值。

如果只改一个转换器，先把旧注册表展开再传：

```ts
const current = getSchemaFormDefaults();

configureSchemaForm({
  converters: {
    ...current.converters,
    money: nextMoney,
  },
});
```

## 读取与重置

`getSchemaFormDefaults` 返回顶层浅拷贝，适合调试和增量配置：

```ts
const defaults = getSchemaFormDefaults();

console.log(defaults.locale);
console.log(Object.keys(defaults.converters ?? {}));
```

快照的顶层字段可以安全替换，但 `presets`、`converters` 内部仍是原对象引用，不要通过快照直接修改嵌套配置。

`resetSchemaFormDefaults` 清空全部项目级默认：

```ts
resetSchemaFormDefaults();
```

测试里通常在 `beforeEach` / `afterEach` 调用，避免用例之间互相影响；HMR 或模块重复加载后也可以用它在入口重新建立干净状态。

```ts
import { afterEach } from 'vitest';
import { resetSchemaFormDefaults } from '@jswork/antd-form-schema';

afterEach(() => resetSchemaFormDefaults());
```

## 与 meta.converters 的区别

这两个 `converters` 容易混淆，职责不同：

| 配置位置                  | 形状                                             | 作用                                   |
| ------------------------- | ------------------------------------------------ | -------------------------------------- |
| `configureSchemaForm`     | `Record<converterId, FieldConverter>`            | 项目级转换器**实现**注册表。           |
| `<SchemaForm converters>` | `Record<converterId, FieldConverter>`            | 当前表单的转换器**实现**注册表。       |
| `meta.converters`         | `Record<fieldKey, converterId \| converterId[]>` | 当前表单的字段 → 转换器 **id 映射**。  |
| `field.converter`         | `converterId \| converterId[]`                   | 单个字段的转换器 id 或链，优先级最高。 |

解析顺序：

1. `field.converter`；
2. `meta.converters[field.key]`；
3. 都没有则不转换。

确定 id 或链之后，再到注册表里找实现：表单级 `converters` → 项目级 `converters`。

```ts
configureSchemaForm({
  converters: { money: projectMoney },
});

const meta: FormSchema = {
  converters: { price: 'money' },
  fields: [{ key: 'price', widget: 'number' }],
};
```

## 注意事项

- 在组件挂载前调用 `configureSchemaForm`。不要在表单运行期间依赖全局默认变化；需要动态配置时，用当前表单自己的 props。
- 配置是模块级状态，同一进程内所有表单共享。SSR 多租户场景不要按请求改全局默认，改用每个表单自己的 props。
- 项目级默认只减少重复配置，不改变 schema 的显式优先级：字段上写了的 `label`、`widget`、`converter` 仍然优先。
  </content>
