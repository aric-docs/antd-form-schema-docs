import { Flex, Select, Space, Tag, message } from 'antd';
import type { TableProps } from 'antd';
import {
  SchemaCrudList,
  defineQueryPlugin,
  queryPlugins,
} from '@jswork/antd-form-schema-crud';
import type { CrudApi, CrudListQueryContext } from '@jswork/antd-form-schema-crud';
import type { FormSchema } from '@jswork/antd-form-schema';

type DemoStatus = 'open' | 'done' | 'archived';
type DemoLevel = 'low' | 'medium' | 'high';

interface DemoRecord {
  id: number;
  title: string;
  status: DemoStatus;
  level: DemoLevel;
  updatedAt: string;
}

interface DemoQuery {
  keywords?: string;
  status?: DemoStatus;
  level?: DemoLevel;
}

const STATUS_TEXT: Record<DemoStatus, string> = {
  open: '进行中',
  done: '已完成',
  archived: '已归档',
};

const LEVEL_TEXT: Record<DemoLevel, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

const STATUS_OPTIONS = (Object.keys(STATUS_TEXT) as DemoStatus[]).map((value) => ({
  value,
  label: STATUS_TEXT[value],
}));

const LEVEL_OPTIONS = (Object.keys(LEVEL_TEXT) as DemoLevel[]).map((value) => ({
  value,
  label: LEVEL_TEXT[value],
}));

const schema: FormSchema = {
  fields: [
    { key: 'title', label: '标题', widget: 'input' },
    {
      key: 'status',
      label: '状态',
      widget: 'select',
      options: STATUS_OPTIONS,
    },
    {
      key: 'level',
      label: '优先级',
      widget: 'select',
      options: LEVEL_OPTIONS,
    },
    { key: 'updatedAt', label: '更新时间', widget: 'input' },
  ],
};

const columns: TableProps<DemoRecord>['columns'] = [
  { title: '标题', dataIndex: 'title', width: 240 },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (value: DemoStatus) => (
      <Tag color={value === 'done' ? 'green' : value === 'open' ? 'blue' : undefined}>
        {STATUS_TEXT[value]}
      </Tag>
    ),
  },
  {
    title: '优先级',
    dataIndex: 'level',
    width: 90,
    render: (value: DemoLevel) => (
      <Tag color={value === 'high' ? 'red' : value === 'medium' ? 'orange' : 'default'}>
        {LEVEL_TEXT[value]}
      </Tag>
    ),
  },
  { title: '更新时间', dataIndex: 'updatedAt', width: 140 },
];

const ROWS: DemoRecord[] = [
  { id: 1, title: '支付回调超时排查', status: 'open', level: 'high', updatedAt: '2026-11-20' },
  { id: 2, title: '列表查询插件设计', status: 'done', level: 'medium', updatedAt: '2026-11-19' },
  { id: 3, title: 'URL 查询参数同步', status: 'open', level: 'medium', updatedAt: '2026-11-18' },
  { id: 4, title: '静态资源缓存策略', status: 'archived', level: 'low', updatedAt: '2026-11-17' },
  { id: 5, title: '订单导出性能优化', status: 'open', level: 'high', updatedAt: '2026-11-16' },
  { id: 6, title: '旧版筛选项迁移', status: 'done', level: 'low', updatedAt: '2026-11-15' },
  { id: 7, title: '分页回退边界处理', status: 'archived', level: 'medium', updatedAt: '2026-11-14' },
  { id: 8, title: '多插件共存验证', status: 'done', level: 'high', updatedAt: '2026-11-13' },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const api: CrudApi<DemoRecord> = {
  index: async ({ page, size, keywords, status, level }) => {
    await delay(200);
    const filtered = ROWS.filter((row) => {
      const matchedKeywords = keywords
        ? row.title.toLowerCase().includes(String(keywords).toLowerCase())
        : true;
      const matchedStatus = status ? row.status === status : true;
      const matchedLevel = level ? row.level === level : true;
      return matchedKeywords && matchedStatus && matchedLevel;
    });
    const start = (page - 1) * size;
    return { rows: filtered.slice(start, start + size), total: filtered.length };
  },
};

const statusSlot = queryPlugins.status<DemoQuery, DemoStatus>({
  options: STATUS_OPTIONS,
});

const keywordsSlot = queryPlugins.keywords<DemoQuery>({
  width: 220,
  placeholder: '搜索标题',
  autoFocus: true,
});

const levelPlugin = defineQueryPlugin<
  DemoQuery,
  { options: typeof LEVEL_OPTIONS }
>({
  name: 'level',
  create: ({ options }) => ({ values, setValues }) => (
    <Select
      size="small"
      allowClear
      placeholder="全部优先级"
      style={{ width: 120 }}
      value={values.level}
      options={options}
      onChange={(level: DemoLevel | undefined) => setValues({ level })}
    />
  ),
});

const levelSlot = levelPlugin({ options: LEVEL_OPTIONS });

function QueryChips({ values, setValues, reset }: CrudListQueryContext<DemoQuery>) {
  if (!values.keywords && !values.status && !values.level) return null;
  return (
    <Flex align="center" gap={8} wrap style={{ marginBottom: 12 }}>
      <span style={{ color: '#888' }}>当前筛选</span>
      {values.keywords ? (
        <Tag closable onClose={() => setValues({ keywords: undefined })}>
          关键词：{values.keywords}
        </Tag>
      ) : null}
      {values.status ? (
        <Tag closable onClose={() => setValues({ status: undefined })}>
          状态：{STATUS_TEXT[values.status]}
        </Tag>
      ) : null}
      {values.level ? (
        <Tag closable onClose={() => setValues({ level: undefined })}>
          优先级：{LEVEL_TEXT[values.level]}
        </Tag>
      ) : null}
      <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => reset()}>
        清空
      </Tag>
    </Flex>
  );
}

export default () => {
  return (
    <div>
      <p style={{ color: '#888' }}>
        <code>keywords</code>、<code>status</code> 是库内置的 query plugins；<code>level</code>
        通过 <code>defineQueryPlugin</code> 自定义。三个插件同时存在，分别使用不同的 queryKey。
      </p>

      <SchemaCrudList<DemoRecord, DemoQuery>
        schema={schema}
        columns={columns}
        title="查询插件演示"
        rowKey="id"
        pageSize={5}
        api={api}
        tableProps={{ scroll: { x: 720 }, size: 'small' }}
        onCreate={() => message.info('这里可以跳转到新建页')}
        onEdit={(record) => message.info(`编辑：${record.title}`)}
        query={{
          url: false,
          defaultValues: { keywords: undefined, status: undefined, level: undefined },
          slots: {
            headerStart: (context) => (
              <Space wrap>
                {statusSlot(context)}
                {levelSlot(context)}
              </Space>
            ),
            headerEnd: keywordsSlot,
            body: (context) => <QueryChips {...context} />,
          },
        }}
      />
    </div>
  );
};
