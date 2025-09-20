'use client';
import React, { useState } from 'react';

import {
  useWallets,
  getWalletAccountFeature,
  UiWalletAccount,
} from '@wallet-standard/react';

const WalletTest = () => {
  const wallets: any = useWallets();
  const [account, setAccount] = useState<UiWalletAccount | null>(null);
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]);

  async function connectWithWallet(wallet) {
    const connect = getWalletAccountFeature(wallet, 'standard:connect').connect;

    const walletAccounts = await connect();
    console.log({ walletAccounts });

    console.log(walletAccounts.accounts);
    setAccount(walletAccounts.accounts[0]);
  }

  console.log(account);

  console.log({ wallets });

  return (
    <div className='flex w-[80%] h-[100%] justify-center items-center '>
      <div className='flex-row gap-4'>
        {!account &&
          wallets.map((wallet) => (
            <button
              className='mt-4 p-6 bg-blue-600 rounded-full mx-6 text-white'
              onClick={() => {
                setSelectedWallet(wallet);
                connectWithWallet(wallet);
              }}
            >
              Connect with {wallet.name} chain {wallet.chains[0]}
            </button>
          ))}
      </div>

      {account && (
        <button
          className='p-6 bg-black text-white'
          onClick={async () => {
            const signMessageFn = getWalletAccountFeature(
              selectedWallet,
              'solana:signMessage'
            );
            const { signMessage } = signMessageFn;
            const message = new TextEncoder().encode('Hey');

            console.log(signMessage);

            const result = await signMessage({ account, message });
            console.log('Signature:', result);
          }}
        >
          Sign Message
        </button>
      )}
    </div>
  );
};

export default WalletTest;
