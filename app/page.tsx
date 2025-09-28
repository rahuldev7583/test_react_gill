'use client';

import MintDetails from './Nft';
import { GillProvider } from './GillProviders';
import WalletTest from './WalletTest';
import GetBalance from './Gill_Test';
import { useState } from 'react';
import { WalletConnectButton } from './WalletConnect';
import { WalletContextProvider } from '@gillsdk/react';

export default function Home() {
  return (
    <div>
      <h1 className='text-2xl mt-4 ml-[40%]'>Solana Wallet Adapter</h1>
      <WalletContextProvider
      // config={{
      //   autoConnect: true,
      //   walletAllowList: ['Phantom', 'Backpack', 'Metamask'],
      //   onError: (err: any) => console.error('Wallet error:', err),
      // }}
      >
        <WalletConnectButton />
        <GillProvider>
          <GetBalance />
        </GillProvider>
      </WalletContextProvider>
    </div>
  );
}
