"use strict";(self.webpackChunk_jswork_antd_form_schema_docs=self.webpackChunk_jswork_antd_form_schema_docs||[]).push([[181],{30918:(function(o,n,e){e.r(n);var a=e(50724),m=e(93442),c=e(52594),i=e(81042),h=e(39477),s=e(70841),r=e(74399),l=e(31439),u=e(78054),t=e(74732),p=e(32013),x=e(30758),d=e(93696),_=e(86070);function j(){return(0,_.jsx)(t.LO,{children:(0,_.jsx)(x.Suspense,{fallback:(0,_.jsx)(p.A,{}),children:(0,_.jsx)(_.Fragment,{children:(0,_.jsxs)("div",{className:"markdown",children:[(0,_.jsxs)("h2",{id:"\u5B89\u88C5",children:[(0,_.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u5B89\u88C5",children:(0,_.jsx)("span",{className:"icon icon-link"})}),"\u5B89\u88C5"]}),(0,_.jsx)(s.A,{lang:"bash",children:d.texts[0].value}),(0,_.jsxs)("h2",{id:"\u5FEB\u901F\u5F00\u59CB",children:[(0,_.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u5FEB\u901F\u5F00\u59CB",children:(0,_.jsx)("span",{className:"icon icon-link"})}),"\u5FEB\u901F\u5F00\u59CB"]}),(0,_.jsx)(s.A,{lang:"tsx",children:d.texts[1].value}),(0,_.jsxs)("h2",{id:"\u6587\u6863\u5BFC\u822A",children:[(0,_.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u6587\u6863\u5BFC\u822A",children:(0,_.jsx)("span",{className:"icon icon-link"})}),"\u6587\u6863\u5BFC\u822A"]}),(0,_.jsxs)("ul",{children:[(0,_.jsxs)("li",{children:[(0,_.jsx)(t.N_,{to:"/guide/getting-started",children:d.texts[2].value}),d.texts[3].value]}),(0,_.jsxs)("li",{children:[(0,_.jsx)(t.N_,{to:"/guide/form-schema",children:d.texts[4].value}),d.texts[5].value]}),(0,_.jsxs)("li",{children:[(0,_.jsx)(t.N_,{to:"/guide/list-query-plugins",children:d.texts[6].value}),d.texts[7].value]}),(0,_.jsxs)("li",{children:[(0,_.jsx)(t.N_,{to:"/playground",children:d.texts[8].value}),d.texts[9].value]})]})]})})})})}n.default=j}),78054:(function(o,n,e){var a,m,c=e(86070);function i(s){var r=s.title,l=s.className,u=s.children;return m("article",{className:"p-6 bg-white rounded-xl shadow-md border ".concat(l||""),children:[a("h3",{className:"text-lg font-bold mb-3",children:r}),u]})}var h=null}),93696:(function(o,n,e){e.r(n);const a=[{value:`pnpm add @jswork/antd-form-schema antd
`,paraId:0,tocIndex:0},{value:`import { Button } from 'antd';
import { SchemaForm } from '@jswork/antd-form-schema';
import type { FormSchema } from '@jswork/antd-form-schema';

const meta: FormSchema = {
  initialValues: { name: '', role: 'user' },
  fields: [
    { key: 'name', label: '\u59D3\u540D', widget: 'input', required: true },
    {
      key: 'role',
      label: '\u89D2\u8272',
      widget: 'select',
      options: [
        { value: 'admin', label: '\u7BA1\u7406\u5458' },
        { value: 'user', label: '\u666E\u901A\u7528\u6237' },
      ],
    },
  ],
};

<SchemaForm meta={meta} onFinish={(values) => console.log(values)}>
  <Button type="primary" htmlType="submit">
    \u63D0\u4EA4
  </Button>
</SchemaForm>;
`,paraId:1,tocIndex:1},{value:"\u5FEB\u901F\u5F00\u59CB",paraId:2,tocIndex:2},{value:" \u2014 \u5B89\u88C5\u3001\u6E32\u67D3\u5165\u53E3\u548C\u76EE\u5F55\u7ED3\u6784",paraId:3,tocIndex:2},{value:"\u8868\u5355 Schema \u5168\u6307\u5357",paraId:4,tocIndex:2},{value:" \u2014 \u5168\u90E8\u914D\u7F6E\u9879\u4E0E\u7279\u6027",paraId:3,tocIndex:2},{value:"CRUD \u5217\u8868\u67E5\u8BE2\u63D2\u4EF6",paraId:5,tocIndex:2},{value:" \u2014 \u5185\u7F6E\u63D2\u4EF6\u4E0E\u81EA\u5B9A\u4E49\u63D2\u4EF6",paraId:3,tocIndex:2},{value:"\u6F14\u7EC3\u573A",paraId:6,tocIndex:2},{value:" \u2014 \u53EF\u76F4\u63A5\u8FD0\u884C\u7684\u5E38\u7528\u793A\u4F8B",paraId:3,tocIndex:2}];e.d(n,["texts",0,a])})}]);
