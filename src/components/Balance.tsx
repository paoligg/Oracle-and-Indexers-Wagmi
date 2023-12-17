'use client'

import { useState, useEffect} from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { marketplaceContract, STPContract, ETHContract } from './contracts';

export function Balance() {
  return (
    <>
      <div className='bg-gray-800 rounded mt-4 p-4'>
        <AccountBalances />
      </div>
    </>
  )
}

export function AccountBalances() {
  const [ sender, setAddress ] = useState<`0x${string}`>("0x0000000000000000000000000000000000000000");
  const { address } = useAccount();
  useEffect(() => {
    if (address) {
      setAddress(address);
    }
  }, [address]);

  const { data : balanceSTP, refetch: refetchBalanceSTP } = useContractRead({
    ...STPContract,
    functionName: 'balanceOf',
    args: [sender],
  });
  const { data : balanceETH, refetch: refetchBalanceETH } = useContractRead({
    ...ETHContract,
    functionName: 'balanceOf',
    args: [sender],
  });

  const [stpBalance, setStpBalance] = useState<number | undefined>(undefined);
  const [ethBalance, setEthBalance] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (balanceSTP !== undefined) {
      setStpBalance(Number(balanceSTP) / 10**18);
    }
    if (balanceETH !== undefined) {
      setEthBalance(Number(balanceETH) / 10**18);
    }
  }, [balanceSTP, balanceETH]);


  const { write : writeSTP} = useContractWrite({
    ...STPContract,
    functionName: "mint",
  });

  const handleMintSTP = async (amount: number, address: `0x${string}`) => {
    await writeSTP({ args: [address,BigInt(amount)] });
  };

  const { write : writeETH} = useContractWrite({
    ...ETHContract,
    functionName: "mint",
  });

  const handleMintETH = async (amount: number, address: `0x${string}`) => {
    await writeETH({ args: [address,BigInt(amount)] });
  };

  return (
    <div className='text-white'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold p-3'>Your Balances</h1>
        <div className="border inline-block ">
        <h3 className='text-2xl'>
          StablePao: {stpBalance ? stpBalance.toFixed(4) : 0} STP
        </h3>
        <h3 className='text-2xl '>ETHPao: {ethBalance ? ethBalance.toFixed(4) : 0} ETP</h3>
        </div>
      </div>
      <br />
      <div className='text-center space-y-4'>
        <button
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition'
          onClick={() => handleMintSTP(1000000000000000000000, sender)}
        >
          Mint 1000 STP
        </button>
        <br />
        <button
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition'
          onClick={() => handleMintETH(1000000000000000000000, sender)}
        >
          Mint 1000 ETP
        </button>
      </div>
      <br />
      <button
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
        onClick={() => {
          refetchBalanceSTP();
          refetchBalanceETH();
        }}
      >
        Fetch Balances
      </button>
    </div>
  )
}


