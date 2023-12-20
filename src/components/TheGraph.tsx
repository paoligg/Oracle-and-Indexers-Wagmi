'use client'
import { useState } from 'react';
import { request, gql } from 'graphql-request';
import axios from 'axios';

export function TheGraph() {
  return (
    <div className="bg-gray-800 rounded mt-4 p-4">
      <div>
        <SushiSwapDashboard />
      </div>
    </div>
  );
}

const SushiSwapDashboard = () => {
  const [poolId, setPoolId] = useState<string>('');
  const [topTokenHolders, setTopTokenHolders] = useState<any[]>([]);

  const poolOptions = [
    ['SUSHI/ETH', '0x795065dcc9f64b5614c407a6efdc400da6221fb0'],
    ['LINK/ETH', '0xc40d16476380e4037e6b1a2594caf6a6cc8da967'],
    ['ILV/ETH', '0x6a091a3406e0073c3cd6340122143009adac0eda'],
    ['WBTC/ETH', '0xceff51756c56ceffca006cd410b03ffc46dd3a58'],
    ['USDC/ETH', '0x397ff1542f962076d0bfe58ea045ffa2d347aca0'],
    ['PUNK/ETH', '0x0463a06fbc8bf28b3f120cd1bfc59483f099d332'],
    ['DAI/ETH', '0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f'],
  ];

  const fetchTopTokenHolders = async (selectedPoolId: string) => {
    try {
      const query = gql`
        query MyQuery($poolId: String!) {
          liquidityPositions(
            first: 3
            where: { pair_: { id: $poolId } }
            orderBy: liquidityTokenBalance
            orderDirection: desc
          ) {
            user {
              id
            }
            liquidityTokenBalance
          }
        }
      `;
      const subgraphEndpoint =
        'https://api.thegraph.com/subgraphs/name/sushiswap/exchange';
      const variables = { poolId: selectedPoolId };
      const data:any = await request(subgraphEndpoint, query, variables);
      if (data) {
        const holders = data.liquidityPositions;
        setTopTokenHolders(holders);
      }
    } catch (error) {
      console.error('Error fetching top token holders:', error);
    }
  };

  const handlePoolChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedPoolId = event.target.value;
    setPoolId(selectedPoolId);
    await fetchTopTokenHolders(selectedPoolId);
  };

  return (
    <div className=" p-8 rounded-md">
      <h1 className='text-3xl font-bold p-3'>Top 3 Token Holders</h1>
      <label
        htmlFor="poolSelector"
        className="block text-neon mb-2"
      >
        Select a Pool:
      </label>
      <select
        id="poolSelector"
        className="w-full p-2 border border-gray-500 rounded mb-4 bg-gray-900"
        onChange={handlePoolChange}
        value={poolId}
      >
        <option value="">Select a Pool</option>
        {poolOptions.map((pool) => (
          <option key={pool[0]} value={pool[1]}>
            {pool[0]}
          </option>
        ))}
      </select>
      <ul className="text-neon">
        {topTokenHolders.map((holder) => (
          <li key={holder.user.id} className="mb-2 text-green-300">
            <span className="font-bold">{holder.user.id}</span> - Balance: {holder.liquidityTokenBalance} LT
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SushiSwapDashboard;
