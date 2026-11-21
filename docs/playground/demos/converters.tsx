import { useState } from 'react';
import { Button } from 'antd';
import { SchemaForm } from '@jswork/antd-form-schema';
import type { FieldConverter, FormSchema } from '@jswork/antd-form-schema';

/** 存储分，展示元 */
const money: FieldConverter = {
  read: (value) => (value == null ? value : Number(value) / 100),
  write: (value) => (value == null ? value : Math.round(Number(value) * 100)),
};

/** number ↔ 两位小数字符串 */
const fixed2: FieldConverter = {
  read: (value) => (value == null ? value : Number(value).toFixed(2)),
  write: (value) => (value == null || value === '' ? value : Number(value)),
};

const converters = { money, fixed2 };

const meta: FormSchema = {
  initialValues: { price: 1999 },
  // 表单级默认：price 依次经过 money、fixed2
  converters: { price: ['money', 'fixed2'] },
  fields: [{ key: 'price', label: '价格（存储为分）', widget: 'number' }],
};

export default () => {
  const [values, setValues] = useState<Record<string, any> | null>(null);

  return (
    <div>
      <SchemaForm meta={meta} converters={converters} onFinish={(next) => setValues(next)}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </SchemaForm>

      <p style={{ marginTop: 16, color: '#888', fontSize: 13 }}>
        输入框显示 19.99，提交后存回 1999。read 从左到右执行，write 从右到左执行。
      </p>
      <pre style={{ background: '#fafafa', padding: 12, borderRadius: 6, fontSize: 12 }}>
        {values ? JSON.stringify(values, null, 2) : '提交后查看存储值'}
      </pre>
    </div>
  );
};
