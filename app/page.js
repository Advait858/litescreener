'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// API endpoints
const API_ENDPOINTS = {
  PRICE: 'https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true',
  MARKET: 'https://api.coingecko.com/api/v3/coins/litecoin',
  TRANSACTIONS: 'https://api.blockchair.com/litecoin/transactions?limit=5',
  BLOCKCHAIN: 'https://api.blockchair.com/litecoin/stats',
  TRANSACTION: 'https://api.blockchair.com/litecoin/raw/transaction/',
  HISTORY: 'https://api.coingecko.com/api/v3/coins/litecoin/market_chart?vs_currency=usd&days=30',
  NEWS:'https://newsapi.org/v2/everything?q=litecoin&language=en&sortBy=publishedAt&pageSize=5&apiKey=11fb47b112ef4af7976cdf7d7df43cf9'   
};

// DataCard component for displaying data in cards
const DataCard = ({ title, value, isPrice = false, isPercentage = false }) => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-gray-500">
    <h2 className="text-lg font-semibold text-gray-200 mb-2">{title}</h2>
    <p className={`text-3xl font-bold ${isPrice ? 'text-green-400' : isPercentage ? (parseFloat(value) >= 0 ? 'text-green-400' : 'text-red-400') : 'text-blue-400'}`}>
      {isPrice ? '$' : ''}{isPercentage ? `${parseFloat(value).toFixed(2)}%` : isNaN(value) ? 'N/A' : parseFloat(value).toLocaleString()}
    </p>
  </div>
);

// Main component
export default function Home() {
  const [litecoinData, setLitecoinData] = useState({});
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [blockchainData, setBlockchainData] = useState({});
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
      return response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;  // Return null on error to prevent crashes
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 150);

    const fetchLitecoinData = async () => {
      try {
        const [priceData, marketInfo, transactionsData, blockchainInfo, historyData, newsData] = await Promise.all([
          fetchData(API_ENDPOINTS.PRICE),
          fetchData(API_ENDPOINTS.MARKET),
          fetchData(API_ENDPOINTS.TRANSACTIONS),
          fetchData(API_ENDPOINTS.BLOCKCHAIN),
          fetchData(API_ENDPOINTS.HISTORY),
          fetchData(API_ENDPOINTS.NEWS)
        ]);

        setLitecoinData(priceData?.litecoin || {});
        setMarketData(marketInfo || {});
        setLatestTransactions(transactionsData?.data || []);
        setBlockchainData(blockchainInfo?.data || {});

        const processedHistory = (historyData?.prices || []).map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price.toFixed(2)
        }));
        setPriceHistory(processedHistory);

        setNewsArticles(newsData?.articles || []);
      } catch (error) {
        console.error('Error fetching Litecoin data:', error);
      }
    };

    fetchLitecoinData();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchData]);

  const handleSearch = useCallback(async () => {
    if (transactionHash) {
      try {
        const data = await fetchData(`${API_ENDPOINTS.TRANSACTION}${transactionHash}`);
        setTransactionData(data?.data[transactionHash] || null);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    }
  }, [transactionHash, fetchData]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <main className="relative w-full min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-gray-100 font-sans">
      <div className="absolute inset-0 bg-[url('/blockchain-background.png')] opacity-10 bg-cover bg-center"></div>
      <div className='relative z-10 container mx-auto px-4 py-8'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row justify-between items-center mb-12'>
          <Image
            src="/ralitetrans.png"
            alt="RA Lite Logo"
            width={200}
            height={200}
            className="object-contain drop-shadow-2xl mb-4 md:mb-0"
          />
          <button 
            onClick={() => router.push('/page2')}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
          >
            <Image
              src="/litewalletwh.png"
              alt="Wallet Icon"
              width={24}
              height={24}
              className="object-contain"
            />
            <span>Wallet</span>
          </button>
        </div>

        {/* Dashboard Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12 glow">Litecoin Dashboard</h1>

        {/* Data Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <DataCard title="Price" value={litecoinData.usd} isPrice />
          <DataCard title="Market Cap" value={litecoinData.usd_market_cap} isPrice />
          <DataCard title="24h Volume" value={litecoinData.usd_24h_vol} isPrice />
          <DataCard title="24h Change" value={litecoinData.usd_24h_change} isPercentage />
          <DataCard title="Circulating Supply" value={marketData.market_data?.circulating_supply} />
          <DataCard title="Max Supply" value={marketData.market_data?.max_supply} />
        </div>

        {/* Blockchain Info */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Blockchain Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DataCard title="Total Blocks" value={blockchainData.blocks} />
              <DataCard title="24h Transactions" value={blockchainData.transactions_24h} />
              <DataCard title="Total Transactions" value={blockchainData.transactions} />
              <DataCard title="Difficulty" value={blockchainData.difficulty} />
            </div>
          </div>

          {/* Transaction Search */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Search Transaction</h2>
            <div className='flex items-center space-x-2 mb-4'>
              <input
                type="text"
                placeholder="Enter Transaction Hash"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                className="flex-grow p-3 rounded-lg bg-[#2a2a3a] text-white placeholder-gray-400 border border-[#4a4a5e] focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                onClick={handleSearch}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>
            {transactionData ? (
              <div className="bg-gradient-to-br from-[#2a2a3a] to-[#3a3a4a] p-6 rounded-xl shadow-lg border border-[#4a4a5e]">
                <h3 className="text-xl font-bold text-white mb-4">Transaction Details</h3>
                <p className="text-gray-300 mb-2"><strong>Hash:</strong> <span className="text-blue-400 break-all">{transactionHash}</span></p>
                <p className="text-gray-300 mb-2"><strong>Block Height:</strong> <span className="text-blue-400">{transactionData.block_id}</span></p>
                <p className="text-gray-300 mb-2"><strong>Transaction Fee:</strong> <span className="text-blue-400">{transactionData.fee} LTC</span></p>
                <p className="text-gray-300"><strong>Time:</strong> <span className="text-blue-400">{new Date(transactionData.time).toLocaleString()}</span></p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#2a2a3a] to-[#3a3a4a] p-6 rounded-xl shadow-lg border border-[#4a4a5e] text-center">
                <p className="text-gray-400">Enter a transaction hash to see details</p>
              </div>
            )}
          </div>
        </div>

        {/* Price History Graph */}
        <div className='mb-12'>
          <h2 className="text-3xl font-bold text-white mb-6">7-Day Price History</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2a2a3a', border: 'none' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Latest News */}
        <div className='mb-12'>
          <h2 className="text-3xl font-bold text-white mb-6">Latest News</h2>
          <div className="space-y-4">
            {newsArticles.length > 0 ? (
              newsArticles.map((article, index) => (
                <div key={index} className="bg-gradient-to-br from-[#2a2a3a] to-[#3a3a4a] p-6 rounded-xl shadow-lg border border-[#4a4a5e] transition-all duration-300 hover:scale-[1.02]">
                  <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                  <p className="text-gray-300 mb-4">{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Read more</a>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No news available</p>
            )}
          </div>
        </div>

        {/* Latest Transactions Table */}
        <div className='mb-12'>
          <h2 className="text-3xl font-bold text-white mb-6">Latest Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#2a2a3a] text-white border border-[#4a4a5e] rounded-lg shadow-lg">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-[#3a3a4a] text-left font-semibold text-sm uppercase tracking-wider">Transaction Hash</th>
                  <th className="py-3 px-6 bg-[#3a3a4a] text-left font-semibold text-sm uppercase tracking-wider">Block Height</th>
                  <th className="py-3 px-6 bg-[#3a3a4a] text-left font-semibold text-sm uppercase tracking-wider">Transaction Fee (LTC)</th>
                  <th className="py-3 px-6 bg-[#3a3a4a] text-left font-semibold text-sm uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody>
                {latestTransactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-[#444] transition-colors duration-200">
                    <td className="py-3 px-6 text-sm break-all">{transaction.hash}</td>
                    <td className="py-3 px-6 text-sm">{transaction.block_id}</td>
                    <td className="py-3 px-6 text-sm">{transaction.fee}</td>
                    <td className="py-3 px-6 text-sm">{new Date(transaction.time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Scroll to Top Button */}
      {showButton && (
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}

      <style jsx global>{`
        .glow {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        body {
          background-color: #0d0d0d;
          color: #e2e2e2;
          font-family: 'Helvetica Neue', sans-serif;
        }

        h1, h2 {
          letter-spacing: 0.1em;
        }

        .data-card {
          background: linear-gradient(135deg, #1f1c2c 0%, #928dab 100%);
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .data-card h2 {
          font-size: 1.5rem;
          color: #ffffff;
        }

        .data-card p {
          font-size: 2rem;
          color: #b2b2b2;
        }

        .btn-wallet {
          background: #1b9aaa;
          color: #ffffff;
          border-radius: 30px;
          padding: 10px 20px;
          font-size: 1rem;
          box-shadow: 0 10px 20px rgba(27, 154, 170, 0.3);
          transition: all 0.3s ease;
        }

        .btn-wallet:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(27, 154, 170, 0.5);
        }

        /* New artwork enhancements */
        .background-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          pointer-events: none;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: pulse 10s infinite ease-in-out;
        }

        .circle-small {
          width: 150px;
          height: 150px;
          top: 10%;
          left: 15%;
        }

        .circle-medium {
          width: 300px;
          height: 300px;
          top: 40%;
          right: 20%;
        }

        .circle-large {
          width: 500px;
          height: 500px;
          bottom: 10%;
          left: 30%;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        .data-card-hover {
          transition: transform 0.3s ease-in-out;
        }

        .data-card-hover:hover {
          transform: translateY(-10px);
        }
      `}</style>
    </main>
  );
}
