'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [litecoinData, setLitecoinData] = useState(null);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [marketData, setMarketData] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function fetchLitecoinData() {
      const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true');
      const priceData = await priceResponse.json();

      const marketResponse = await fetch('https://api.coingecko.com/api/v3/coins/litecoin');
      const marketInfo = await marketResponse.json();

      const transactionsResponse = await fetch('https://api.blockchair.com/litecoin/transactions?limit=5');
      const transactionsData = await transactionsResponse.json();

      setLitecoinData(priceData.litecoin);
      setMarketData(marketInfo);
      setLatestTransactions(transactionsData.data);
    }

    fetchLitecoinData();
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-black text-gray-100 font-sans">
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/bg4.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      ></div>

      <div className='text-center relative z-10 w-3/4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 px-4'>
        <div className=''>

        </div>
        <div className="relative z-10 flex justify-center items-center py-6">
          <Image
          src="/ralitetrans.png"
          alt="RA Lite Logo"
          width={300}
          height={300}
          className="object-contain drop-shadow-2xl"
          />
        </div>
        <div className="hover:scale-105 relative z-10 flex flex-col justify-center items-center py-6">
        <button type="button" className="" onClick={() => router.push('/page2')}>
        <Image
          src="/litewalletwh.png"
          alt="Wallet Icon"
          width={80}
          height={80}
          className="object-contain drop-shadow-2xl"
        />
        <p className="mt-2 text-white text-lg font-semibold">Wallet</p>
        </button>
        </div>
      </div>


      {litecoinData && (
        <div className="text-center relative z-10 w-3/4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 px-4">
          <div className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white font-display">Price</h2>
            <p className="text-3xl font-bold text-green-500">${litecoinData.usd}</p>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white font-display">Market Cap</h2>
            <p className="text-3xl font-bold text-green-500">${litecoinData.usd_market_cap.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white font-display">24h Volume</h2>
            <p className="text-3xl font-bold text-green-500">${litecoinData.usd_24h_vol.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white font-display">24h Change</h2>
            <p className={`text-3xl font-bold ${litecoinData.usd_24h_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {litecoinData.usd_24h_change.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white font-display">Circulating Supply</h2>
            <p className="text-3xl font-bold text-green-500">{marketData.market_data?.circulating_supply?.toLocaleString()} LTC</p>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white font-display">Max Supply</h2>
            <p className="text-3xl font-bold text-green-500">{marketData.market_data?.max_supply?.toLocaleString()} LTC</p>
          </div>
        </div>
      )}

      <div className="relative z-10 mt-16">
        <h2 className="text-center text-4xl font-extrabold text-white font-display">Latest Transactions</h2>
        <div className="max-w-screen-xl mx-auto mt-8 grid grid-cols-1 gap-8 px-4">
          {latestTransactions.map((transaction, index) => (
            <div key={index} className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105">
              <p className="font-display text-lg"><strong>Transaction Hash:</strong> {transaction.transaction_hash}</p>
              <p className="font-display text-lg"><strong>Block Height:</strong> {transaction.block_id}</p>
              <p className="font-display text-lg"><strong>Transaction Fee:</strong> {transaction.transaction_fee} LTC</p>
              <p className="font-display text-lg"><strong>Time:</strong> {new Date(transaction.time * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-16">
        <h2 className="text-center text-4xl font-extrabold text-white font-display">Blockchain Info</h2>
        <div className="max-w-screen-xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          <div className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white font-display">Total Blocks</h2>
            <p className="text-3xl font-bold text-green-500">{marketData.blockchain_stats_24_hours?.blocks}</p>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white font-display">Total Transactions</h2>
            <p className="text-3xl font-bold text-green-500">{marketData.blockchain_stats_24_hours?.transaction_count}</p>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white font-display">Difficulty</h2>
            <p className="text-3xl font-bold text-green-500">{marketData.blockchain_stats_24_hours?.difficulty}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
