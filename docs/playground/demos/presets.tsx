import { useState } from 'react';
import { Button, Radio } from 'antd';
import { SchemaForm } from '@jswork/antd-form-schema';
import type { FormSchema, Presets } from '@jswork/antd-form-schema';

const presets: Presets = {
  fields: {
    title: 'input',
    name: 'input',
    status: 'select',
    bio: 'textarea',
    enabled: 'switch',
  },
  labels: {
    'zh-CN': {
      title: '标题',
      name: '姓名',
      status: '状态',
      bio: '个人简介',
      enabled: '是否启用',
    },
    'en-US': {
      title: 'Title',
      name: 'Name',
      status: 'Status',
      bio: 'Bio',
      enabled: 'Enabled',
    },
  },
};

/** Schema 只写 key，label 和 widget 来自同一份 presets 文件。 */
const meta: FormSchema = {
  initialValues: { status: 'active', enabled: true },
  fields: [
    { key: 'title' },
    { key: 'name', required: true },
    {
      key: 'status',
      options: [
        { value: 'active', label: '活跃' },
        { value: 'disabled', label: '禁用' },
      ],
    },
    { key: 'bio' },
    { key: 'enabled' },
  ],
};

export default () => {
  const [locale, setLocale] = useState<'zh-CN' | 'en-US'>('zh-CN');

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Radio.Group
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
          optionType="button"
          options={[
            { label: '中文', value: 'zh-CN' },
            { label: 'English', value: 'en-US' },
          ]}
        />
      </div>

      <SchemaForm
        meta={meta}
        presets={presets}
        locale={locale}
        onFinish={(values) => console.log('submitted', values)}
      >
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </SchemaForm>
    </div>
  );
};
