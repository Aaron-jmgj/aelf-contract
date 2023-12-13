'use client';
// import { WebLoginProvider, setGlobalConfig, PortkeyProvider } from 'aelf-web-login';
const APPNAME = 'AElf DApp';

// setGlobalConfig({
//   appName: APPNAME,
//   chainId: 'chainId placeholder',
//   // @ts-ignore
//   networkType: 'networkType placeholder',
//   portkey: {},
//   aelfReact: {
//     appName: APPNAME,
//     nodes: {},
//   },
//   defaultRpcUrl: '',
// });

export default function Providers({ children }: any) {
  return (
    <div>{children}</div>
    // @ts-ignore
  );
}
