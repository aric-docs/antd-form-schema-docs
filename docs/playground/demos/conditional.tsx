import { Button } from 'antd';
import { SchemaForm } from '@jswork/antd-form-schema';
import type { FormSchema } from '@jswork/antd-form-schema';

const meta: FormSchema = {
  initialValues: { role: 'user', customerType: '个人', scale: 10 },
  fields: [
    {
      key: 'role',
      label: '角色',
      widget: 'select',
      options: [
        { value: 'admin', label: '管理员' },
        { value: 'user', label: '普通用户' },
      ],
    },
    {
      key: 'company',
      label: '公司名称',
      widget: 'input',
      placeholder: '仅管理员可见',
      condition: { field: 'role', op: 'eq', value: 'admin' },
    },
    {
      key: 'customerType',
      label: '客户类型',
      widget: 'select',
      options: ['个人', '企业'],
    },
    { key: 'scale', label: '企业规模', widget: 'number' },
    {
      key: 'contactPolicy',
      label: '专属对接策略',
      widget: 'input',
      placeholder: '个人客户，或企业规模 ≥ 100 时显示',
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
      },
    },
  ],
};

export default () => (
  <div>
    <SchemaForm meta={meta} onFinish={(values) => console.log('submitted', values)}>
      <Button type="primary" htmlType="submit">
        提交
      </Button>
    </SchemaForm>

    <p style={{ marginTop: 16, color: '#888', fontSize: 13 }}>
      试试：角色选「管理员」显示公司名称；客户类型选「企业」且规模 ≥ 100，也会显示专属对接策略。
      条件会自动监听依赖字段，不需要写 onValuesChange。
    </p>
  </div>
);
