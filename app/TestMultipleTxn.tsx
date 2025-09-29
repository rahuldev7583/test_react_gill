'use client';

import React, { useState } from 'react';
import { createTransaction, compileTransaction, Base64EncodedWireTransaction } from 'gill';
import { getAddMemoInstruction } from 'gill/programs';
import { useSolanaClient, useWallet } from '@gillsdk/react'; 
import { useGillSignAllTransaction } from '@gillsdk/react';

export default function TestGillSignAllTransactions() {
  const { rpc } = useSolanaClient();
  const { account, signAllTransaction, signer } = useGillSignAllTransaction();

  const [memoText, setMemoText] = useState('');
  const [txSigs, setTxSigs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  
  function toBase64EncodedWireTransaction(bytes: Uint8Array): Base64EncodedWireTransaction {
    return Buffer.from(bytes).toString('base64') as Base64EncodedWireTransaction;
  }

  const handleSendMemos = async () => {
    if (!account || !signer) {
      setError('Wallet not connected!');
      return;
    }
    if (!memoText.trim()) {
      setError('Please enter a memo message');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setTxSigs([]);


      const txs = [];

for (let i = 0; i < 3; i++) {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const tx = compileTransaction(
    createTransaction({
      version: 0,
      feePayer: signer,
      instructions: [getAddMemoInstruction({ memo: `${memoText} #${i+1}` })],
      latestBlockhash,
    })
  );

  txs.push(tx);
}
      const signedTxBytesArray = await signAllTransaction(txs);

      const sigs: string[] = [];


      for (const bytes of signedTxBytesArray) {
        const base64Tx = toBase64EncodedWireTransaction(bytes);
        const sig = await rpc.sendTransaction(base64Tx, {
          encoding: 'base64',
          preflightCommitment: 'confirmed',
          skipPreflight: false,
        }).send();
        sigs.push(sig);
      }

      setTxSigs(sigs);
    } catch (err: any) {
      console.error('Transaction failed:', err);
      setError(err.message || 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-4 border rounded-xl max-w-md mx-auto mt-8'>
      <h2 className='text-lg font-bold mb-2'>Send Multiple Memo Transactions</h2>

      <input
        type='text'
        className='w-full border px-2 py-1 rounded mb-2'
        placeholder='Enter memo text'
        value={memoText}
        onChange={(e) => setMemoText(e.target.value)}
      />

      <button
        onClick={handleSendMemos}
        disabled={!memoText || isLoading}
        className='px-4 py-2 bg-black text-white rounded-xl cursor-pointer'
      >
        {isLoading ? 'Sending...' : 'Send Memos'}
      </button>

      {txSigs.length > 0 && (
        <div className='mt-2 text-green-600'>
          ✅ Success! Tx Signatures:
          <ul>
            {txSigs.map((sig, i) => (
              <li key={i}>
                <a
                  href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`}
                  target='_blank'
                  rel='noreferrer'
                  className='underline'
                >
                  {sig}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className='mt-2 text-red-600'>⚠️ {error}</p>}
    </div>
  );
}
