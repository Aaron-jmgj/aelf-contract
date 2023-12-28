import { IMethod } from '../../contractDemo';
import { Collapse } from 'antd';

import FormItem from './formItem';

const { Panel } = Collapse;

export default function DynamicForm({ methods, address }: { methods: IMethod[]; address: string }) {
  return (
    <Collapse defaultActiveKey={['0']} className="rounded-md">
      {methods.map((ele, i) => {
        return (
          <Panel
            key={ele.name}
            header={<span className="font-semibold">{ele.name}</span>}
            showArrow={false}
          >
            <FormItem address={address} name={ele.name} input={ele.input} fn={ele.fn}></FormItem>
          </Panel>
        );
      })}
    </Collapse>
  );
}
