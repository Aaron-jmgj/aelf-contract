// Every item made up with title, params input and query button.

import { Divider, Form, Input, Button, Collapse } from 'antd';
import { useState } from 'react';
import { useAElfReact } from '@aelf-react/core';
import { IMethod, tokenContractAddress } from '../index';
import ReactJson from 'react-json-view';

export default function FormItem({ name, input, fn, activeKey }: IMethod) {
  const { account, activate, defaultAElfBridge } = useAElfReact();
  const [form] = Form.useForm();
  const [toggle, setToggle] = useState(false);
  const [res, setRes] = useState<any>('');
  const query = async () => {
    // get all fileds value with param true
    const filedsValue = form.getFieldsValue();
    try {
      const result = await fn.call(filedsValue);
      setRes(result);
    } catch (e: any) {
      setRes(e);
    }
  };
  const write = async (name: string) => {
    if (!account) {
      await activate();
    }
    if (!defaultAElfBridge) return;
    const filedsValue = form.getFieldsValue();

    try {
      await defaultAElfBridge.chain.getChainStatus();
      const contract = await defaultAElfBridge.chain.contractAt(tokenContractAddress, {
        address: account as string,
      });
      const result = await contract[name](filedsValue);
      setRes(result);
      return;
    } catch (e: any) {
      debugger;
      setRes(e);
    }
  };

  return (
    <>
      <Form form={form} name={name} key={name}>
        {input?.map((ele) => (
          <Form.Item key={ele} label={ele} name={ele}>
            <Input />
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="default" className="mr-8" onClick={query}>
            Query
          </Button>
          <Button type="primary" onClick={() => write(name)}>
            Write
          </Button>
        </Form.Item>
      </Form>

      {res && (
        <>
          <Divider dashed />
          <div>Response Body</div>
          <div>
            <ReactJson src={res} />
          </div>
        </>
      )}
    </>
  );
}
