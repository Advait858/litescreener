'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiRipple, SiDogecoin } from 'react-icons/si';

export default function Home() {
  const [litecoinData, setLitecoinData] = useState(null);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [blockchainData, setBlockchainData] = useState({});
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  
  const coinIcons = {
    bitcoin: <FaBitcoin className="inline-block mr-2" />,
    ethereum: <FaEthereum className="inline-block mr-2" />,
    ripple: <SiRipple className="inline-block mr-2" />,
    dogecoin: <SiDogecoin className="inline-block mr-2" />,
  };

  useEffect(() => {
    async function fetchData() {
      const handleScroll = () => {
        if (window.scrollY > 150) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      };

      const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true');
      const priceData = await priceResponse.json();

      const marketResponse = await fetch('https://api.coingecko.com/api/v3/coins/litecoin');
      const marketInfo = await marketResponse.json();

      const transactionsResponse = await fetch('https://api.blockchair.com/litecoin/transactions?limit=5');
      const transactionsData = await transactionsResponse.json();

      const blockchainResponse = await fetch('https://api.blockchair.com/litecoin/stats');
      const blockchainData = await blockchainResponse.json();

      const historyResponse = await fetch('https://api.coingecko.com/api/v3/coins/litecoin/market_chart?vs_currency=usd&days=30');
      const historyData = await historyResponse.json();

      const newsResponse = await fetch('https://newsapi.org/v2/everything?q=litecoin&language=en&sortBy=publishedAt&pageSize=2&apiKey=11fb47b112ef4af7976cdf7d7df43cf9');
      const newsData = await newsResponse.json();

      const exchangeRatesResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=litecoin,bitcoin,ethereum,ripple,dogecoin&vs_currencies=usd');
      const exchangeRatesData = await exchangeRatesResponse.json();

      const litecoinPrice = exchangeRatesData.litecoin.usd;
      const calculatedRates = {
        bitcoin: litecoinPrice / exchangeRatesData.bitcoin.usd,
        ethereum: litecoinPrice / exchangeRatesData.ethereum.usd,
        ripple: litecoinPrice / exchangeRatesData.ripple.usd,
        dogecoin: litecoinPrice / exchangeRatesData.dogecoin.usd,
      };

      const processedHistory = historyData.prices.map(([timestamp, price], index) => ({
        date: new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
        price: price.toFixed(2),
        showLabel: index % 5 === 0
      }));

      setLitecoinData(priceData.litecoin);
      setMarketData(marketInfo);
      setLatestTransactions(transactionsData.data);
      setBlockchainData(blockchainData.data);
      setPriceHistory(processedHistory);
      setNewsArticles(newsData.articles || []);
      setExchangeRates(calculatedRates);

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (transactionHash) {
      try {
        const response = await fetch(`https://api.blockcypher.com/v1/ltc/main/txs/${transactionHash}`);
        if (!response.ok) {
          throw new Error('Transaction not found');
        }
        const data = await response.json();
        setTransactionData(data);
        setTransactionError(null);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        setTransactionData(null);
        setTransactionError("Failed to fetch transaction data. Please check the hash and try again.");
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative w-full min-h-screen bg-[#F6F1EE] text-gray-100 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[#11100F] z-20">
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
            <div className="flex space-x-4 text-[#F6F1EE] dia">
              <a href="#litecoin-details" className="hover:text-gray-300 hover:underline">Litecoin Details</a>
              <a href="#blockchain-info" className="hover:text-gray-300 hover:underline">Blockchain Info</a>
              <a href="#search-transaction" className="hover:text-gray-300 hover:underline">Search</a>
              <a href="#latest-transactions" className="hover:text-gray-300 hover:underline">Latest Transactions</a>
              <a href="#exchange-rates" className="hover:text-gray-300 hover:underline">Exchange Rates</a>
              <a href="#price-history" className="hover:text-gray-300 hover:underline">Price History</a>
              <a href="#latest-news" className="hover:text-gray-300 hover:underline">News</a>
              <a href="#about-litecoin" className="hover:text-gray-300 hover:underline">About</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-32"></div>

      <h2 id="litecoin-details" className="text-center marfo text-5xl font-bold text-[#11100F] hover:underline font-display">Litecoin Details</h2>

      {litecoinData && (
        <div className="dia text-center relative z-10 w-3/4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 px-4">
          <div className="bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">Price</h2>
            <p className="text-3xl font-bold text-green-600">${litecoinData.usd}</p>
          </div>
          <div className="bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">Market Cap</h2>
            <p className="text-3xl font-bold text-green-600">${litecoinData.usd_market_cap.toLocaleString()}</p>
          </div>
          <div className="bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">24h Volume</h2>
            <p className="text-3xl font-bold text-green-600">${litecoinData.usd_24h_vol.toLocaleString()}</p>
          </div>
          <div className="bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">24h Change</h2>
            <p className={`text-3xl font-bold ${litecoinData.usd_24h_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {litecoinData.usd_24h_change.toFixed(2)}%
            </p>
          </div>
          <div className="bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">Circulating Supply</h2>
            <p className="text-3xl font-bold text-green-600">{marketData.market_data?.circulating_supply?.toLocaleString()} LTC</p>
          </div>
          <div className="bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105">
            <h2 className="text-2xl font-bold text-[#11100F] font-display">Max Supply</h2>
            <p className="text-3xl font-bold text-green-600">{marketData.market_data?.max_supply?.toLocaleString()} LTC</p>
          </div>
        </div>
      )}

      <div className='text-center relative z-10 w-3/4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 px-4'>
        <div className='relative z-10 mt-16 col-span-3'>
        <h2  id="blockchain-info" className="marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display">Blockchain Info</h2>
        <div className="dia max-w-screen-xl mx-auto mt-8 grid grid-cols-2 gap-8">
        
                <div className="bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 p-8 rounded-lg transition-transform transform hover:scale-105">
                  <h2 className="text-2xl font-bold text-white font-display">Total Blocks</h2>
                  <p className="text-3xl font-bold text-green-600">{blockchainData.blocks}</p>
                </div>
                <div className="bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 p-8 rounded-lg transition-transform transform hover:scale-105">
                  <h2 className="text-2xl font-bold text-white font-display">24h Transactions</h2>
                  <p className="text-3xl font-bold text-green-600">{blockchainData.transactions_24h}</p>
                </div>
                <div className="bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 p-8 rounded-lg transition-transform transform hover:scale-105">
                  <h2 className="text-2xl font-bold text-white font-display">Total Transactions</h2>
                  <p className="text-3xl font-bold text-green-600">{blockchainData.transactions}</p>
                </div>
                <div className="bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 p-8 rounded-lg transition-transform transform hover:scale-105">
                  <h2 className="text-2xl font-bold text-white font-display">Difficulty</h2>
                  <p className="text-3xl font-bold text-green-600">{blockchainData.difficulty}</p>
                </div>
              
            </div>
        </div>
        <div id="search-transaction" className='relative z-10 mt-16 col-span-2'>
        <div className=''>
            <div className="items-center">
              <h2 className="marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display">Search Transaction</h2>
              <div className='dia flex items-center justify-center'>
                <div className='relative w-full'>
                  <input
                    type="text"
                    placeholder="Enter Transaction Hash"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    className="mt-8 p-4 transition-transform transform hover:scale-105 placeholder:text-center rounded-lg bg-[#54257d]/30 hover:bg-[#672e99]/30 text-white placeholder-white w-full"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="mt-8 ml-2 px-4 py-4 rounded-lg bg-[#11100F] transition-transform transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                </button>
              </div>
            </div>

            {!transactionData && !transactionError ? (
              <div className="dia min-h-[205px] flex items-center justify-center relative text-center mt-9 p-8 bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 rounded-lg transition-transform transform hover:scale-105">
                <p className="font-display text-lg text-white">Enter hash above to search</p>
              </div>
            ) : transactionError ? (
              <div className="min-h-[205px] flex items-center justify-center relative text-center mt-9 p-8 bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 rounded-lg transition-transform transform hover:scale-105">
                <p className="dia font-display text-lg text-red-500">{transactionError}</p>
              </div>
            ) : (
              <div className="dia relative text-center mt-9 p-8 bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 rounded-lg transition-transform transform hover:scale-105">
                
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

      <div className='text-center relative z-10 w-3/4 mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 px-4'>
        <div className=''>
          <div className="relative z-10 mt-16">
          <h2 className="marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display">Latest Transactions</h2>
            <div id="latest-transactions" className="dia transition-transform transform hover:scale-105 mx-auto mt-8 ">
              <table className="mt-8 min-w-full bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-blur-lg backdrop-brightness-125 rounded-lg text-[#11100F] transition-transform transform">
                <thead>
                  <tr>
                    <th className="px-6 py-4 font-display text-lg">Transaction Hash</th>
                    <th className="px-6 py-4 font-display text-lg">Block Height</th>
                    <th className="px-6 py-4 font-display text-lg">Transaction Fee</th>
                    <th className="px-6 py-4 font-display text-lg">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {latestTransactions.map((transaction, index) => (
                    <tr key={index} className="">
                      <td className="px-6 py-4 font-display text-lg break-all">{transaction.hash.slice(0, 5)}...{transaction.hash.slice(-5)}</td>
                      <td className="px-6 py-4 font-display text-lg">{transaction.block_id}</td>
                      <td className="px-6 py-4 font-display text-lg">{transaction.fee} LTC</td>
                      <td className="px-6 py-4 font-display text-lg">{new Date(transaction.time).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Exchange Rates and Latest News section */}
      <div className='text-center relative z-10 w-3/4 mx-auto mt-16 px-4'>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div id="exchange-rates" className="col-span-2">
            <h2 className="marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display mb-8">Exchange Rates</h2>
            <div className="dia grid grid-cols-1 gap-4">
              {Object.entries(exchangeRates).map(([coin, rate]) => (
                <div key={coin} className="mb-2 bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 p-4 rounded-lg transition-transform transform hover:scale-105">
                  <h3 className="text-xl font-bold text-white font-display mb-2">
                    {coinIcons[coin]}
                    {coin.charAt(0).toUpperCase() + coin.slice(1)}
                  </h3>
                  <p className="text-lg font-bold text-green-600">1 LTC = {rate.toFixed(8)} {coin.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div id="latest-news" className="col-span-3">
            <h2 className="marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display mb-8">Latest News</h2>
            <div className="space-y-4">
              {newsArticles.length > 0 ? (
                newsArticles.map((article, index) => (
                  <div key={index} className="dia bg-[#54257d]/30 hover:bg-[#672e99]/30 p-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg">
                    <h3 className="text-xl font-bold text-white font-display mb-2">{article.title}</h3>
                    <p className="text-white mb-4">{article.description}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Read more</a>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No news available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Updated Price History section */}
      {/* Updated Price History section */}
      <div id="price-history" className='text-center relative z-10 w-3/4 mx-auto mt-24 px-4'>
        <h2 className="marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display mb-12">30-Day Price History</h2>
        <div className="dia bg-white p-4 rounded-lg transition-transform transition-all transform hover:scale-105 shadow-lg">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={priceHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.5} />
              <XAxis 
                dataKey="date" 
                stroke="#333"
                tick={{ fill: '#333', fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  const day = date.getDate();
                  return day % 5 === 0 ? value : '';
                }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#333"
                tick={{ fill: '#333' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', color: '#333' }}
                itemStyle={{ color: '#333' }}
                formatter={(value) => [`$${value}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line type="monotone" dataKey="price" stroke="#766387" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      <div id="about-litecoin" className='text-center relative z-10 w-3/4 mx-auto mt-16 px-4 mb-16'>
        <h2 className="marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display mb-8">About Litecoin</h2>
        <div className="dia bg-[#54257d]/30 hover:bg-[#672e99]/30 p-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg">
          <p className="text-white mb-4">
            Litecoin (LTC), often referred to as the "silver to Bitcoin's gold," is a decentralized cryptocurrency created by Charlie Lee in 2011. It was one of the earliest cryptocurrencies to fork from Bitcoin's blockchain, aiming to provide a faster and more efficient payment network. Designed as a "lite" version of Bitcoin, Litecoin offers faster transaction speeds and lower fees, making it more suitable for everyday transactions.
          </p>
          
          <p className="text-white mb-4">
            One of Litecoin's key features is its use of the Scrypt algorithm, a memory-hard mining algorithm that makes it more resistant to ASIC mining and potentially more accessible to smaller miners. Litecoin has a block generation time of 2.5 minutes, compared to Bitcoin's 10 minutes, allowing for quicker transaction confirmations. It also has a larger maximum supply of 84 million LTC, compared to Bitcoin's 21 million, and supports technologies like SegWit and the Lightning Network for even faster and cheaper transactions.
          </p>
          
          <p className="text-white mb-4">
            The benefits of Litecoin include faster transaction confirmations, lower fees, and more accessible mining for individuals. With a proven track record and stability since 2011, Litecoin has gained wide acceptance among exchanges and merchants. Its strong community and growing adoption by merchants make it an attractive option for investors and users alike.
          </p>
          
          <p className="text-white mb-4">
            Compared to other cryptocurrencies, Litecoin occupies a unique position. While it shares similarities with Bitcoin as a payment system, it offers faster transactions and lower fees. Unlike Ethereum, which focuses on smart contracts and decentralized applications, Litecoin primarily serves as a digital currency. In contrast to newer chains, Litecoin has a longer history and proven reliability, though it may lack some of the advanced features of these newer platforms.
          </p>

          <p className="text-white mb-4">
            For investors, Litecoin presents both opportunities and risks. Its faster transaction speed and lower fees make it a potential alternative for smaller transactions and everyday payments. The cryptocurrency market's volatility can lead to significant price fluctuations, which can be seen as both a risk and an opportunity. As the market continues to evolve, Litecoin could see further growth and adoption, potentially leading to increased value.
          </p>

          <p className="text-white mb-4">
            However, it's important to note that investing in cryptocurrencies carries significant risks. These include market volatility, regulatory risks as governments worldwide closely monitor cryptocurrencies, and technological risks as the underlying technology continues to evolve. Potential investors should conduct thorough research and consider their own financial goals and risk tolerance before making any investment decisions.
          </p>
        </div>
      </div>

      <div className='h-16'></div>

      {showButton && (
        <button onClick={scrollToTop} className="fixed bottom-5 right-5 px-4 py-2 transition-all">
          <Image
            src="/scrollb.png"
            alt="scroll button"
            width={55}
            height={55}
            className="object-contain drop-shadow-2xl"
          />
        </button>
      )}

    </main>
  );
}