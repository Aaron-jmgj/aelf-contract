import { Button, Card } from 'antd';
import { AElfReactProvider } from '@aelf-react/core';
import DynamicForm from './DynamicForm';
import { useState, useCallback } from 'react';
import { getContractInstance } from 'utils/contractInstance';
import { useAElfReact } from '@aelf-react/core';
import { useEffectOnce } from 'react-use';

import './index.css';

export interface IMethod {
  name: string;
  input: string[];
  fn: any;
  key?: string | number;
  activeKey?: string | number;
}

export const tokenContractAddress = 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE';

function ContractDemo() {
  const { account, activate, deactivate } = useAElfReact();

  const [methods, setMethods] = useState<IMethod[]>([]);

  const getInfo = async () => {
    const tokenContract = await getContractInstance(tokenContractAddress);

    const tokenMethods = adjustMethods(tokenContract);
    setMethods(tokenMethods);
  };

  const changeWallet = useCallback(async () => {
    await deactivate();
    activate();
  }, [activate, deactivate]);

  const adjustMethods = (methodsObj: any) => {
    const res = [];
    const keysArr = Object.keys(methodsObj);
    for (let i = 0; i < keysArr.length; i++) {
      if (!methodsObj[keysArr[i]].inputTypeInfo) {
        continue;
      }
      const temp: any = {};
      temp.name = keysArr[i];
      temp.input = Object.keys(methodsObj[keysArr[i]].inputTypeInfo.fields);
      temp.fn = methodsObj[keysArr[i]];
      res.push(temp);
    }
    return res;
  };

  useEffectOnce(() => {
    activate();
    getInfo();
  });

  return (
    <Card
      title={<div className="text-lg font-bold">Contract Read & Write</div>}
      className="ContractDemo container mx-auto px-4"
    >
      <Card type="inner" className=" mb-4" title={<div className="text-lg font-bold">Wallet</div>}>
        <div>
          <Button type="default" className="mr-4" onClick={() => activate()}>
            activate
          </Button>
          <Button type="primary" onClick={() => changeWallet()}>
            changeWallet
          </Button>
        </div>
        <div className="mt-4 text-lg">
          ACCOUNT: <span className="text-gray-500	ml-2">{account}</span>
        </div>
      </Card>
      <Card type="inner" title={<div className="text-lg font-bold">Methods</div>}>
        <DynamicForm methods={methods}></DynamicForm>
      </Card>
    </Card>
  );
}

const HomeProvider = () => {
  return (
    <AElfReactProvider
      appName="example"
      nodes={{
        AELF: { rpcUrl: 'https://aelf-test-node.aelf.io', chainId: 'AELF' },
      }}
    >
      <ContractDemo></ContractDemo>
    </AElfReactProvider>
  );
};

export default HomeProvider;
