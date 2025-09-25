'use client';

import React, { useState } from 'react';
import { getAddMemoInstruction } from '@solana-program/memo'; // memo ix builder
import { useGillSignTransaction } from '@gillsdk/react';
import bs58 from 'bs58';
import { getPublicKeyFromAddress } from 'gill';
import { log } from 'console';

export function MemoTransactionDemo() {
  const { account, signTransaction } = useGillSignTransaction();
  const [memoText, setMemoText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSendMemo() {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setTxSig(null);
      console.log({ memoText });

      const ix = getAddMemoInstruction({
        memo: memoText,
      });
      console.log('Instruction:', ix);

      const sig = await signTransaction([ix]);
      console.log('Transaction signature:', sig);
      const bs58Sign = bs58.encode(sig);
      console.log({ sig });

      console.log({ bs58Sign });

      setTxSig(bs58Sign);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to send transaction');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='p-4 border rounded-xl max-w-md mx-auto mt-8'>
      <h2 className='text-lg font-bold mb-2'>
        Send Memo Transaction via Gill hook
      </h2>

      <input
        type='text'
        className='w-full border px-2 py-1 rounded mb-2'
        placeholder='Enter memo text'
        value={memoText}
        onChange={(e) => setMemoText(e.target.value)}
      />

      <button
        onClick={handleSendMemo}
        disabled={!memoText || isLoading}
        className='px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
      >
        {isLoading ? 'Sending...' : 'Send Memo'}
      </button>

      {txSig && (
        <p className='mt-2 text-green-600'>
          ✅ Success! Tx Signature:{' '}
          <a
            href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
            target='_blank'
            rel='noreferrer'
            className='underline'
          >
            View on Explorer
          </a>
        </p>
      )}

      {error && <p className='mt-2 text-red-600'>⚠️ {error}</p>}
    </div>
  );
}
