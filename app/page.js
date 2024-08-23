'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [litecoinData, setLitecoinData] = useState(null);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    async function fetchLitecoinData() {
      // Fetch Litecoin price and market data
      const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true');
      const priceData = await priceResponse.json();

      // Fetch Litecoin market data
      const marketResponse = await fetch('https://api.coingecko.com/api/v3/coins/litecoin');
      const marketInfo = await marketResponse.json();

      // Fetch latest Litecoin transactions
      const transactionsResponse = await fetch('https://api.blockchair.com/litecoin/transactions?limit=5');
      const transactionsData = await transactionsResponse.json();

      setLitecoinData(priceData.litecoin);
      setMarketData(marketInfo);
      setLatestTransactions(transactionsData.data);
    }

    fetchLitecoinData();
  }, []);

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mt-10">
        <div className="flex justify-end w-full">
          <Image
            src="/ralitecorner.png" // Replace with the path to your image
            alt="RA Lite Logo"
            width={300} // Set appropriate width
            height={300} // Set appropriate height
            className="object-contain"
         />
        </div>
      </div>

      {/* Display Litecoin Price and Market Info */}
      {litecoinData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Price</h2>
            <p className="text-2xl">${litecoinData.usd}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Market Cap</h2>
            <p className="text-2xl">${litecoinData.usd_market_cap.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">24h Volume</h2>
            <p className="text-2xl">${litecoinData.usd_24h_vol.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">24h Change</h2>
            <p className={`text-2xl ${litecoinData.usd_24h_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {litecoinData.usd_24h_change.toFixed(2)}%
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Circulating Supply</h2>
            <p className="text-2xl">{marketData.market_data?.circulating_supply?.toLocaleString()} LTC</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Max Supply</h2>
            <p className="text-2xl">{marketData.market_data?.max_supply?.toLocaleString()} LTC</p>
          </div>
        </div>
      )}

      {/* Display Latest Transactions */}
      <div className="mt-10">
        <h2 className="text-center text-3xl font-bold">Latest Transactions</h2>
        <div className="mt-5 grid grid-cols-1 gap-6">
          {latestTransactions.map((transaction, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-md">
              <p><strong>Transaction Hash:</strong> {transaction.transaction_hash}</p>
              <p><strong>Block Height:</strong> {transaction.block_id}</p>
              <p><strong>Transaction Fee:</strong> {transaction.transaction_fee} LTC</p>
              <p><strong>Time:</strong> {new Date(transaction.time * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Litecoin Blockchain Info */}
      <div className="mt-10">
        <h2 className="text-center text-3xl font-bold">Blockchain Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Total Blocks</h2>
            <p className="text-2xl">{marketData.blockchain_stats_24_hours?.blocks}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Total Transactions</h2>
            <p className="text-2xl">{marketData.blockchain_stats_24_hours?.transaction_count}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Difficulty</h2>
            <p className="text-2xl">{marketData.blockchain_stats_24_hours?.difficulty}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
