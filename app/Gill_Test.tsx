'use client';

import { useBalance, useSolanaClient, useWallet } from '@gillsdk/react';
import React from 'react';
import { MemoTransactionButton } from './SignTransaction';
import { MemoTransactionDemo } from './SignTxnWithGill';
import TestSignTransaction from './SignIn';
import TestTransaction from './TransactionTest';
import FinalTransaction from './FinalTxn';

const GetBalance = () => {
  const { account, wallet } = useWallet();
  const { rpc, cluster } = useSolanaClient();

  console.log({ rpc, cluster });

  const { balance } = useBalance({
    address: account?.address,
  });
  console.log({ account });
  console.log({ wallet });

  console.log({ balance });

  return (
    wallet && (
      <div className='ml-10 mt-4'>
        <h1 className='text-xl mt-8'>
          Connected to
          <span className='font-bold'> {account?.address}</span>
        </h1>

        <h2 className='font-semibold text-xl'>
          Balance
          <span className='ml-2'>
            {balance ? `${(Number(balance) / 1e9).toFixed(4)} SOL` : '0 SOL'}
          </span>
        </h2>
        {/* <MemoTransactionButton text={'Test Memo Txn'} /> */}
        {/* <MemoTransactionDemo /> */}

        {/* <TestSignTransaction /> */}
        {/* <TestTransaction /> */}
        <FinalTransaction />
      </div>
    )
  );
};

export default GetBalance;
