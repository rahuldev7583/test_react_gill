'use client';

import React, { useState } from 'react';
import { useGillSignTransaction, useSolanaClient } from '@gillsdk/react';
import {
  createTransaction,
  compileTransaction,
  Base64EncodedWireTransaction,
  getBase58Encoder,
  getBase64Encoder,
} from 'gill';
import { getAddMemoInstruction } from 'gill/programs';
import bs58 from 'bs58';

export default function TestGillMemoTransaction() {
  const { rpc } = useSolanaClient();
  const { account, signTransaction, signer } = useGillSignTransaction();
  const [txSig, setTxSig] = useState<string | null>(null);

  const handleSendMemo = async () => {
    if (!account || !signer) {
      alert('Wallet not connected!');
      return;
    }

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
    const txRaw = createTransaction({
      version: 'legacy',
      feePayer: signer,
      instructions: [getAddMemoInstruction({ memo: 'hello from memo' })],
      latestBlockhash,
    });
    console.log({ txRaw });

    const tx: any = compileTransaction(txRaw);
    console.log({ tx });

    try {
      const signedTxBytes = await signTransaction(tx);
      console.log({ signedTxBytes });
      const encoder = getBase64Encoder();
      const signedBase64 = Buffer.from(signedTxBytes).toString(
        'base64'
      ) as Base64EncodedWireTransaction;
      console.log({ signedBase64 });
      // Send to network
      //   const txSig = await rpc
      //     .sendTransaction(signedBase64, {
      //       encoding: 'base64',
      //     })
      //     .send();
      //   console.log('Transaction sent:', txSig);
      //   setTxSig(bs58Sign);
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  return (
    <div className='p-4'>
      <button
        onClick={handleSendMemo}
        className='px-4 py-2 bg-blue-600 text-white rounded'
      >
        Send Memo Transaction
      </button>

      {txSig && (
        <div className='mt-4'>
          <strong>Transaction Signature:</strong>
          <pre className='break-all'>{txSig}</pre>
          <a
            href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
            target='_blank'
            rel='noreferrer'
            className='text-blue-400 underline'
          >
            View on Explorer
          </a>
        </div>
      )}
    </div>
  );
}
