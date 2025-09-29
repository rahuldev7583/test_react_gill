'use client';

import MintDetails from './Nft';
import { GillProvider } from './GillProviders';
import { useState } from 'react';
import { WalletConnectButton } from './WalletConnect';
import { WalletContextProvider } from '@gillsdk/react';
import Landing from './Landing';

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
          <Landing/>
        </GillProvider>
      </WalletContextProvider>
    </div>
  );
}
