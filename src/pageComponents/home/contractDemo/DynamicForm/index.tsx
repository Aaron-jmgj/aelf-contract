import { IMethod } from '../../contractDemo';
import { Collapse } from 'antd';

import FormItem from './formItem';

const { Panel } = Collapse;

export default function DynamicForm({ methods }: { methods: IMethod[] }) {
  return (
    <Collapse defaultActiveKey={['0']} className="rounded-md">
      {methods.map((ele, i) => {
        return (
          <Panel
            key={ele.name}
            header={<span className="font-semibold">{ele.name}</span>}
            showArrow={false}
          >
            <FormItem name={ele.name} input={ele.input} fn={ele.fn}></FormItem>
          </Panel>
        );
      })}
    </Collapse>
  );
}
