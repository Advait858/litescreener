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
<<<<<<< HEAD
    <main className="relative w-full min-h-screen bg-[#FFFFFF] text-[#11100F] font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[#645573] z-20 shadow-lg">
        <div className="max-w mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/ralitetrans.png"
                alt="RA Lite Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <div className="flex space-x-4">
              <a href="#litecoin-details" className="text-[#11100F] font-light hover:text-gray-300">Litecoin Details</a>
              <a href="#blockchain-info" className="text-[#11100F] hover:text-gray-300">Blockchain Info</a>
              <a href="#search-transaction" className="text-[#11100F] hover:text-gray-300">Search Transaction</a>
              <a href="#latest-transactions" className="text-[#11100F] hover:text-gray-300">Latest Transactions</a>
            </div>
          </div>
=======
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

      <div className="relative z-10 flex justify-center items-center py-6">
        <Image
          src="/ralitetrans.png"
          alt="RA Lite Logo"
          width={300}
          height={300}
          className="object-contain drop-shadow-2xl"
        />
      </div>

      <div className="flex justify-center relative z-10 max-w-screen-xl mx-auto mt-4">
        <div className="space-x-4">
          <button type="button" className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:focus:ring-yellow-900" onClick={() => router.push('./')}>Screener</button>
>>>>>>> 32a99714bbd42b525b6503dfd8e210e7bf725db2
        </div>
      </div>

<<<<<<< HEAD
      <div className="h-24"></div>

      <h2 id="litecoin-details" className="text-center text-4xl font-bold text-[#11100F] font-display">Litecoin Details</h2>

      {litecoinData && (
        <div className="text-center relative z-10 w-3/4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 px-4">
          <div className="bg-[#F6F1EE] border border-[#D9CFC4] p-8 rounded-lg shadow-lg transition-transform transition-all transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">Price</h2>
            <p className="text-3xl font-bold text-green-500">${litecoinData.usd}</p>
          </div>
          <div className="bg-[#F6F1EE] border border-[#D9CFC4] p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">Market Cap</h2>
            <p className="text-3xl font-bold text-green-500">${litecoinData.usd_market_cap.toLocaleString()}</p>
          </div>
          <div className="bg-[#F6F1EE] border border-[#D9CFC4] p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">24h Volume</h2>
            <p className="text-3xl font-bold text-green-500">${litecoinData.usd_24h_vol.toLocaleString()}</p>
          </div>
          <div className="bg-[#F6F1EE] border border-[#D9CFC4] p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">24h Change</h2>
=======

      {litecoinData && (
        <div className="relative z-10 max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 px-4">
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
>>>>>>> 32a99714bbd42b525b6503dfd8e210e7bf725db2
            <p className={`text-3xl font-bold ${litecoinData.usd_24h_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {litecoinData.usd_24h_change.toFixed(2)}%
            </p>
          </div>
<<<<<<< HEAD
          <div className="bg-[#F6F1EE] border border-[#D9CFC4] p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">Circulating Supply</h2>
            <p className="text-3xl font-bold text-green-500">{marketData.market_data?.circulating_supply?.toLocaleString()} LTC</p>
          </div>
          <div className="bg-[#F6F1EE] border border-[#D9CFC4] p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">Max Supply</h2>
=======
          <div className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white font-display">Circulating Supply</h2>
            <p className="text-3xl font-bold text-green-500">{marketData.market_data?.circulating_supply?.toLocaleString()} LTC</p>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-lg backdrop-brightness-125 p-8 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-extrabold text-white font-display">Max Supply</h2>
>>>>>>> 32a99714bbd42b525b6503dfd8e210e7bf725db2
            <p className="text-3xl font-bold text-green-500">{marketData.market_data?.max_supply?.toLocaleString()} LTC</p>
          </div>
        </div>
      )}

<<<<<<< HEAD
      <div className='text-center relative z-10 w-3/4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 px-4'>
        <div className='relative z-10 mt-16 col-span-3'>
        <h2  id="blockchain-info" className="text-center text-4xl font-bold text-[#11100F] font-display">Blockchain Info</h2>
        <div className="max-w-screen-xl mx-auto mt-8 grid grid-cols-2 gap-8">
        
                <div className="bg-[#F6F1EE] border border-[#D9CFC4] p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                  <h2 className="text-2xl font-bold text-[#11100F] font-display">Total Blocks</h2>
                  <p className="text-3xl font-bold text-green-500">{blockchainData.blocks}</p>
                </div>
                <div className="bg-[#F6F1EE] border border-[#D9CFC4] p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                  <h2 className="text-2xl font-bold text-[#11100F] font-display">24h Transactions</h2>
                  <p className="text-3xl font-bold text-green-500">{blockchainData.transactions_24h}</p>
                </div>
                <div className="bg-[#F6F1EE] border border-[#D9CFC4] p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                  <h2 className="text-2xl font-bold text-[#11100F] font-display">Total Transactions</h2>
                  <p className="text-3xl font-bold text-green-500">{blockchainData.transactions}</p>
                </div>
                <div className="bg-[#F6F1EE] border border-[#D9CFC4] p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                  <h2 className="text-2xl font-bold text-[#11100F] font-display">Difficulty</h2>
                  <p className="text-3xl font-bold text-green-500">{blockchainData.difficulty}</p>
                </div>
              
            </div>
        </div>
        <div id="search-transaction" className='relative z-10 mt-16 col-span-2'>
        <div className=''>
            <div className="items-center">
              <h2 className="text-center text-4xl font-bold text-[#11100F] font-display">Search Transaction</h2>
              <div className='flex items-center justify-center'>
                <div className='relative w-full'>
                  <input
                    type="text"
                    placeholder="Enter Transaction Hash"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    className="mt-8 p-4 transition-transform transform hover:scale-105 placeholder:text-center rounded-lg bg-[#87729c] text-[#11100F] placeholder-gray-300 w-full"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="mt-8 ml-2 px-4 py-4 bg-white-500 text-xs text-[#11100F] rounded-lg hover:bg-[#292a2b]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                </button>
              </div>
            </div>

            {!transactionData && !transactionError ? (
              <div className="min-h-[205px] flex items-center justify-center relative text-center mt-9 p-8 bg-[#F6F1EE] border border-[#D9CFC4] rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <p className="font-display text-lg text-gray-300">Enter hash above to search</p>
              </div>
            ) : transactionError ? (
              <div className="min-h-[205px] flex items-center justify-center relative text-center mt-9 p-8 bg-[#F6F1EE] border border-[#D9CFC4] rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <p className="font-display text-lg text-red-500">{transactionError}</p>
              </div>
            ) : (
              <div className="relative text-center mt-9 p-8 bg-[#F6F1EE] border border-[#D9CFC4] rounded-lg shadow-lg transition-transform transform hover:scale-105">
                
                <p className="font-display text-lg"><strong>Block Height:</strong> {transactionData.block_height}</p>
                <p className="font-display text-lg"><strong>Transaction Fee:</strong> {transactionData.fees / 100000000} LTC</p>
                <p className="font-display text-lg"><strong>Time:</strong> {new Date(transactionData.received).toLocaleString()}</p>
                <p className="font-display text-lg"><strong>Size:</strong> {transactionData.size} bytes</p>
                <p className="font-display text-lg"><strong>Total:</strong> {transactionData.total / 100000000} LTC</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="latest-transactions" className='text-center relative z-10 w-3/4 mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 px-4'>
        <div className=''>
          <div className="relative z-10 mt-16">
          <h2 className="text-center text-4xl font-bold text-[#11100F] font-display">Latest Transactions</h2>
            <div className=" transition-transform transform hover:scale-105 mx-auto mt-8 ">
              <table className="mt-8 min-w-full bg-[#F6F1EE] border border-[#D9CFC4] rounded-lg shadow-lg text-[#11100F] transition-transform transform">
                <thead>
                  <tr>
                    <th className="px-6 py-4 font-display text-lg">Transaction Hash</th>
                    <th className="px-6 py-4 font-display text-lg">Block Height</th>
                    <th className="px-6 py-4 font-display text-lg">Transaction Fee</th>
                    <th className="px-6 py-4 font-display text-lg">Amount</th>
                    <th className="px-6 py-4 font-display text-lg">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {latestTransactions.map((transaction, index) => (
                    <tr key={index} className="">
                      <td className="px-6 py-4 font-display text-lg break-all">{transaction.hash.slice(0, 5)}...{transaction.hash.slice(-5)}</td>
                      <td className="px-6 py-4 font-display text-lg">{transaction.block_id}</td>
                      <td className="px-6 py-4 font-display text-lg">{transaction.fee} LTC</td>
                      <td className="px-6 py-4 font-display text-lg">{transaction.amount} LTC</td>
                      <td className="px-6 py-4 font-display text-lg">{new Date(transaction.time).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
=======
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
>>>>>>> 32a99714bbd42b525b6503dfd8e210e7bf725db2
          </div>
        </div>
      </div>
    </main>
  );
}
