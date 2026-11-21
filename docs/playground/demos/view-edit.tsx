import { useState } from 'react';
import { Button, Switch } from 'antd';
import { SchemaForm } from '@jswork/antd-form-schema';
import type { FormSchema } from '@jswork/antd-form-schema';

const meta: FormSchema = {
  initialValues: {
    name: '张三',
    role: 'admin',
    bio: '负责表单 schema 与低代码平台。',
  },
  fields: [
    { key: 'name', label: '姓名', widget: 'input' },
    {
      key: 'role',
      label: '角色',
      widget: 'select',
      options: [
        { value: 'admin', label: '管理员' },
        { value: 'user', label: '普通用户' },
      ],
    },
    { key: 'bio', label: '个人简介', widget: 'textarea' },
  ],
};

export default () => {
  const [viewMode, setViewMode] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Switch checked={viewMode} onChange={setViewMode} />
        <span style={{ color: '#888' }}>{viewMode ? '只读详情' : '编辑模式'}</span>
      </div>

      {/* 切换时重建表单，避免在编辑/只读之间复用同一份交互状态 */}
      <SchemaForm
        key={viewMode ? 'view' : 'edit'}
        meta={{ ...meta, viewMode }}
        onFinish={(values) => console.log('submitted', values)}
      >
        {!viewMode && (
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        )}
      </SchemaForm>
    </div>
  );
};
