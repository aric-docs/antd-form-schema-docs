---
title: CRUD 列表查询插件
order: 3
---

# CRUD 列表查询插件

`SchemaCrudList` 的查询区只有 `query.slots` 一个入口。`queryPlugins` 是放在这些 slot 里的常用控件工厂，不新增第二套查询 API。

## 安装

```bash
pnpm add @jswork/antd-form-schema-crud @jswork/antd-form-schema antd
```

`@jswork/antd-form-schema` 是 peer dependency，宿主项目需要显式安装。

```tsx
import {
  SchemaCrudList,
  defineQueryPlugin,
  queryPlugins,
} from '@jswork/antd-form-schema-crud';
import '@jswork/antd-form-schema-crud/style.css';
```

## 最小用法

内置 `status` 和 `keywords` 两个插件：

```tsx
interface PostQuery {
  keywords?: string;
  status?: 'open' | 'done';
}

<SchemaCrudList<PostRecord, PostQuery>
  resource="posts"
  schema={postSchema}
  query={{
    defaultValues: { keywords: undefined, status: undefined },
    slots: {
      headerStart: queryPlugins.status<PostQuery>({
        options: [
          { value: 'open', label: '进行中' },
          { value: 'done', label: '已完成' },
        ],
      }),
      headerEnd: queryPlugins.keywords<PostQuery>({
        placeholder: '搜索标题',
        autoFocus: true,
      }),
    },
  }}
/>;
```

`headerStart` 在新建按钮之前，`headerEnd` 在刷新按钮之后；两个 slot 都是可选的。

## 内置插件

### keywords

```tsx
queryPlugins.keywords<PostQuery>({
  queryKey: 'keywords',
  placeholder: '搜索',
  width: 240,
  size: 'small',
  allowClear: true,
  enterButton: true,
  autoFocus: false,
});
```

- 输入过程只更新本地草稿，不触发请求；
- 回车或点击搜索时，trim 后提交；
- 空字符串会写成 `undefined`，并回到第 1 页；
- 清空输入立即移除查询值；
- 外部查询值变化会同步回输入框。

其余属性透传给 antd `Input.Search`。

### status

```tsx
queryPlugins.status<PostQuery, 'open' | 'done'>({
  queryKey: 'status',
  placeholder: '全部状态',
  width: 120,
  size: 'small',
  allowClear: true,
  options: [
    { value: 'open', label: '进行中' },
    { value: 'done', label: '已完成' },
  ],
});
```

- 选择后立即提交并回到第 1 页；
- 清空提交 `undefined`；
- `options` 必填，`value` 支持 `string | number`；
- 其余属性透传给 antd `Select`。

两个插件使用的 queryKey 都可以通过 `queryKey` 改，但需要和类型、URL 映射保持一致。

## 多个插件同时使用

一个 slot 可以放多个插件，用 `Fragment` 或 `Space` 组合：

```tsx
slots: {
  headerStart: (context) => (
    <Space wrap>
      {statusSlot(context)}
      {levelSlot(context)}
    </Space>
  ),
  headerEnd: keywordsSlot,
},
```

规则：

- 不同 slot 可以同时使用；
- 同一 slot 可以放多个，但必须使用不同的 `queryKey`；
- 插件只负责渲染控件和调用 `context.setValues`，不直接请求列表；
- 不做运行时重复 key 校验，也不提供 `compose()` 之类组合 API。

## 外部项目定义插件

`defineQueryPlugin` 的契约和内置插件一致：`name` 只用于调试，`create(config)` 返回一个 `CrudListQuerySlot`。

```tsx
import { Select } from 'antd';
import { defineQueryPlugin } from '@jswork/antd-form-schema-crud';

interface LevelQuery {
  level?: string;
}

const levelPlugin = defineQueryPlugin<
  LevelQuery,
  { options: { value: string; label: string }[] }
>({
  name: 'level',
  create:
    ({ options }) =>
    ({ values, setValues }) =>
      (
        <Select
          size="small"
          allowClear
          placeholder="全部优先级"
          style={{ width: 120 }}
          value={values.level}
          options={options}
          onChange={(level) => setValues({ level })}
        />
      ),
});

const levelSlot = levelPlugin({
  options: [
    { value: 'low', label: '低' },
    { value: 'medium', label: '中' },
    { value: 'high', label: '高' },
  ],
});
```

再放进任意 slot：

```tsx
slots: {
  headerStart: levelSlot,
},
```

`create` 返回的 slot 需要 React hooks 时，在 slot 内返回自定义组件即可：

```tsx
const searchPlugin = defineQueryPlugin({
  name: 'advanced-search',
  create: () => () => <AdvancedSearch />,
});
```

外部插件不操作 URL、分页或 API；这些仍由 `SchemaCrudList` 统一处理。

## 初始值与 URL

查询值的初始值只有两个来源：`query.defaultValues` 和 URL。

```tsx
query={{
  defaultValues: { keywords: undefined, status: 'open' },
  urlKeys: { keywords: 'q', status: 'status' },
  slots: {
    headerStart: statusSlot,
    headerEnd: keywordsSlot,
  },
}}
```

- `url` 默认同步到路由，传 `false` 可关闭；
- `urlKeys` 没配置时只同步实际存在的查询值；
- 配置 `{ keywords: 'q' }` 后，URL 中使用 `q`，查询值仍叫 `keywords`；
- `defaultValues` 也是 `reset()` 的恢复基线。

## 与普通 slot 混用

插件本质就是 slot，所以可以和手写 slot 共存：

```tsx
slots: {
  headerStart: statusSlot,
  headerEnd: keywordsSlot,
  body: ({ values }) => values.status ? <Tag>{values.status}</Tag> : null,
},
```

## 演练场

可运行示例：

<code src="../playground/demos/list-query-plugins.tsx">查询插件</code>
