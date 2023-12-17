'use client'
import { useState, useEffect } from 'react';
import { useContractRead, useContractWrite } from 'wagmi';
import { marketplaceContract, STPContract, ETHContract } from './contracts';

export function SwapTokens() {

  return (
    <div className='bg-gray-800 rounded mt-4 p-4'>
      <div className='text-center'>
       <Swap/>
      </div>
    </div>
  );
}

function Swap() {

  const { data : price } = useContractRead({
    ...marketplaceContract,
    functionName: 'getLatestPrice',
  });
  const [tokensent, setTokensent] = useState('ETP');
  const [tokenasked, setTokenasked] = useState('STP');
  const [amountasked, setAmountasked] = useState('0');
  const [isApproved, setIsApproved] = useState(false);


  const { write : approveETH, isLoading: approveETHLoading} = useContractWrite({
    ...ETHContract,
    functionName: "approve",
  });
  const handleApproveETH = async (amount: number) => {
    if( price != undefined) {
      const amountToSend = BigInt(amount) * BigInt(10**26) / price + BigInt(1*10**18);
      await approveETH({ args: ["0xAD04f487d659295e37d7f86D37d893a43150c905",amountToSend] });
      setIsApproved(true);
    }
  };


  const { write : approveSTP, isLoading: approveSTPLoading} = useContractWrite({
    ...STPContract,
    functionName: "approve",
  });
  const handleApproveSTP = async (amount: number) => {
    if( price != undefined) {
      const amountToSend = BigInt(amount) * BigInt(10**10) * price + BigInt(1*10**18);
      await approveSTP({ args: ["0xAD04f487d659295e37d7f86D37d893a43150c905",amountToSend] });
      setIsApproved(true);
    }
  };


  const { write : swapSTP} = useContractWrite({
    ...marketplaceContract,
    functionName: "swapforStableToken"
  });
  const handleSwapSTP = async (amount: number) => {
    if( price != undefined) {
      const amountToSend = BigInt(amount);
      await swapSTP({ args: [amountToSend] });
      setIsApproved(false);
    }
  };


  const { write : swapETH} = useContractWrite({
    ...marketplaceContract,
    functionName: "swapforETHToken"
  });
  const handleSwapETH = async (amount: number) => {
    if( price != undefined) {
      const amountToSend = BigInt(amount);
      await swapETH({ args: [amountToSend] });
      setIsApproved(false);
    }
  };


  return (
    <div className='mx-auto max-w-md text-white'>
      <label className='block mb-2' htmlFor="options">
        Choose the swap :
      </label>
      <select
        id="options"
        className='w-full p-2 border border-gray-500 rounded mb-4 bg-gray-900'
        onChange={(e) => setTokenasked(e.target.value)}
      >
        <option value="STP">ETP to STP</option>
        <option value="ETP">STP to ETP</option>
      </select>

      <label className='block mb-2' htmlFor="options">
        Choose the amount that you want to receive :
      </label>
      <input
        type="text"
        className='w-full p-2 border border-gray-500 rounded mb-4 bg-gray-900 text-green-300'
        onChange={(e) => setAmountasked(e.target.value)}
      /> {tokenasked}

      {tokenasked == 'STP' && price ? (
        <div>
          {!isNaN(Number(amountasked)) && amountasked != '0' ? (
            <div className='space-y-4'>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
                onClick={() => handleApproveETH(Number(amountasked))}
              >
                Approve
              </button>
              <br/>
              {isApproved ? (
                <div>
                  <button
                    className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition'
                    onClick={() => handleSwapSTP(Number(amountasked))}
                    disabled
                  >
                    Swap for STP
                  </button>
              </div>
            ) : 
              <div>
                <button
                  className='bg-gray-500 text-white px-4 py-2 rounded transition'
                  disabled
                >
                  Swap for STP
                </button>
              </div>}
            </div>
          ) : null}
        </div>
      ) : null}

      {tokenasked == 'ETP' && price ? (
        <div>
          {!isNaN(Number(amountasked)) && amountasked != '0' ? (
            <div className='space-y-4'>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
                onClick={() => handleApproveSTP(Number(amountasked))}
              >
                Approve
              </button>
              <br/>
              <button
                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition'
                onClick={() => handleSwapETH(Number(amountasked))}
              >
                Swap for ETH
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default SwapTokens;