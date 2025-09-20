'use client';

import { useTokenMint } from '@gillsdk/react';
import { useState } from 'react';

export default function MintDetails() {
  const [mintInput, setMintInput] = useState('');
  const [mint, setMint] = useState<string>('');

  const { account, metadata, metadataAccount, isLoading, error } = useTokenMint(
    { mint }
  );

  console.log({
    account,
    isLoading,
    metadata,
    metadataAccount,
    fromNext: 'app',
  });

  return (
    <div className='pl-10 mt-8'>
      <h1>Get NFT details by mint address</h1>
      <input
        className='border border-black w-[50%]'
        type='text'
        onChange={(e) => setMintInput(e.target.value)}
        value={mintInput}
        placeholder='Enter mint address...'
      />
      <button
        className='ml-2 px-3 py-1 border rounded cursor-pointer'
        onClick={() => setMint(mintInput)}
      >
        Search
      </button>

      <br />
      {isLoading && <p>Loading...</p>}
      {error && <p className='text-red-500'>Error: {String(error)}</p>}

      {account && (
        <>
          <h2 className='font-bold text-lg mt-8'>Mint Details</h2>
          <p>Supply: {account.data.supply.toString()}</p>
          <p>Decimals: {account.data.decimals}</p>
          <p>
            Mint Authority:{' '}
            {account.data.mintAuthority.__option === 'Some'
              ? String(account.data.mintAuthority.value)
              : 'None'}
          </p>
          <p>
            Freeze Authority:{' '}
            {account.data.freezeAuthority.__option === 'Some'
              ? String(account.data.freezeAuthority.value)
              : 'None'}
          </p>
        </>
      )}
    </div>
  );
}
