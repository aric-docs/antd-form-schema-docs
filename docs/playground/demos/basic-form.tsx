import { useState } from 'react';
import { Button } from 'antd';
import { SchemaForm } from '@jswork/antd-form-schema';
import type { FormSchema } from '@jswork/antd-form-schema';

const meta: FormSchema = {
  initialValues: { name: '', role: 'user', age: 28 },
  fields: [
    { key: 'name', label: '姓名', widget: 'input', required: true, placeholder: '请输入姓名' },
    {
      key: 'role',
      label: '角色',
      widget: 'select',
      options: [
        { value: 'admin', label: '管理员' },
        { value: 'user', label: '普通用户' },
      ],
    },
    { key: 'age', label: '年龄', widget: 'number', required: true },
    { key: 'bio', label: '个人简介', widget: 'textarea', placeholder: '选填' },
  ],
};

export default () => {
  const [values, setValues] = useState<Record<string, any> | null>(null);

  return (
    <div>
      <SchemaForm meta={meta} onFinish={(next) => setValues(next)}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </SchemaForm>

      <p style={{ marginTop: 16, color: '#888' }}>提交结果（存储值）：</p>
      <pre style={{ background: '#fafafa', padding: 12, borderRadius: 6, fontSize: 12 }}>
        {values ? JSON.stringify(values, null, 2) : '点击提交查看 values'}
      </pre>
    </div>
  );
};
