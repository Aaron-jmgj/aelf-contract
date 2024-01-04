import { Button, Card, Input } from 'antd';
import { AElfReactProvider } from '@aelf-react/core';
import DynamicForm from './DynamicForm';
import { useState, useCallback, useEffect } from 'react';
import { getContractInstance, getAElfInstance } from 'utils/contractInstance';
import { useAElfReact } from '@aelf-react/core';
import { useEffectOnce } from 'react-use';

import './index.css';

export interface IMethod {
  name: string;
  input: string[];
  fn: any;
  key?: string | number;
  address: string;
  activeKey?: string | number;
}

function ContractDemo() {
  const { account, activate, deactivate } = useAElfReact();
  const [methods, setMethods] = useState<IMethod[]>([]);
  const [tokenContractAddress, setTokenContractAddress] = useState<string>(
    'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  );
  const [rpcUrl, setRpcUrl] = useState<string>('https://explorer-test.aelf.io/chain');

  const getInfo = async () => {
    console.log('tokenContractAddress', tokenContractAddress);

    try {
      const tokenContract = await getContractInstance(tokenContractAddress, rpcUrl);
      console.log('tokenContract', tokenContract);
      const tokenMethods = adjustMethods(tokenContract);
      console.log('tokenMethods', tokenContract);

      setMethods(tokenMethods);
    } catch (error) {
      console.log('error', error);
      setMethods([]);
    }
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

  useEffect(() => {
    const init = async () => {
      const aelf = getAElfInstance(rpcUrl);
      const chainStatus = await aelf.chain.getChainStatus();
      const chainId = chainStatus.ChainId;
      const isActive = await activate({
        [chainId]: {
          chainId,
          rpcUrl,
        },
      });
    };
    init();

    getInfo();
  }, [tokenContractAddress, rpcUrl]);

  return (
    <Card
      title={<div className="text-lg font-bold">Contract Read & Write</div>}
      className="ContractDemo container mx-auto px-4"
    >
      <Card type="inner" className=" mb-4" title={<div className="text-lg font-bold">Wallet</div>}>
        <div>
          <div className="mb-4">
            Contract Address:
            <Input
              className="mt-2"
              placeholder="please enter contract address"
              value={tokenContractAddress}
              onChange={(e) => setTokenContractAddress(e.target.value)}
            ></Input>
          </div>
          <div className="mb-4">
            RpcUrl:
            <Input
              className="mt-2"
              placeholder="please enter rpcUrl"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
            ></Input>
          </div>
          <Button type="default" className="mr-4" onClick={() => activate()}>
            activate
          </Button>
          <Button type="primary" onClick={() => changeWallet()}>
            {account && account.length ? 'change wallet' : 'connect wallet'}
          </Button>
        </div>
        {account && account.length ? (
          <div className="mt-4 text-lg">
            You have connected to the wallet!
            <div>
              address:
              <span className="text-gray-500	ml-2">{account}</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-lg">You should connect wallet at first</div>
        )}
      </Card>
      <Card type="inner" title={<div className="text-lg font-bold">Methods</div>}>
        <DynamicForm methods={methods} address={tokenContractAddress}></DynamicForm>
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
        // TDVW: { rpcUrl: 'https://aelf-test-node.aelf.io', chainId: 'AELF' },
        // TDVV: { rpcUrl: 'https://aelf-test-node.aelf.io', chainId: 'AELF' },
      }}
    >
      <ContractDemo></ContractDemo>
    </AElfReactProvider>
  );
};

export default HomeProvider;
