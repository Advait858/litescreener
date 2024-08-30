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
    bitcoin: <FaBitcoin className=&quot;inline-block mr-2&quot; />,
    ethereum: <FaEthereum className=&quot;inline-block mr-2&quot; />,
    ripple: <SiRipple className=&quot;inline-block mr-2&quot; />,
    dogecoin: <SiDogecoin className=&quot;inline-block mr-2&quot; />,
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
          throw new Error(&apos;Transaction not found&apos;);
        }
        const data = await response.json();
        setTransactionData(data);
        setTransactionError(null);
      } catch (error) {
        console.error(&quot;Error fetching transaction data:&quot;, error);
        setTransactionData(null);
        setTransactionError(&quot;Failed to fetch transaction data. Please check the hash and try again.&quot;);
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: &quot;smooth&quot; });
  };

  return (
    <main className=&quot;relative w-full min-h-screen bg-[#F6F1EE] text-gray-100 font-sans&quot;>
      {/* Navbar */}
      <nav className=&quot;fixed top-0 left-0 w-full bg-[#11100F] z-20&quot;>
        <div className=&quot;max-w mx-auto px-4 sm:px-6 lg:px-8&quot;>
          <div className=&quot;flex items-center justify-between h-16&quot;>
            <div className=&quot;flex items-center&quot;>
              <Image
                src=&quot;/ralitetrans.png&quot;
                alt=&quot;RA Lite Logo&quot;
                width={100}
                height={100}
                className=&quot;object-contain&quot;
              />
            </div>
            <div className=&quot;flex space-x-4 text-[#F6F1EE] dia&quot;>
              <a href=&quot;#litecoin-details&quot; className=&quot;hover:text-gray-300 hover:underline&quot;>Litecoin Details</a>
              <a href=&quot;#blockchain-info&quot; className=&quot;hover:text-gray-300 hover:underline&quot;>Blockchain Info</a>
              <a href=&quot;#search-transaction&quot; className=&quot;hover:text-gray-300 hover:underline&quot;>Search</a>
              <a href=&quot;#latest-transactions&quot; className=&quot;hover:text-gray-300 hover:underline&quot;>Latest Transactions</a>
              <a href=&quot;#exchange-rates&quot; className=&quot;hover:text-gray-300 hover:underline&quot;>Exchange Rates</a>
              <a href=&quot;#price-history&quot; className=&quot;hover:text-gray-300 hover:underline&quot;>Price History</a>
              <a href=&quot;#latest-news&quot; className=&quot;hover:text-gray-300 hover:underline&quot;>News</a>
              <a href=&quot;#about-litecoin&quot; className=&quot;hover:text-gray-300 hover:underline&quot;>About</a>
            </div>
          </div>
        </div>
      </nav>

      <div className=&quot;h-32&quot;></div>

      <h2 id=&quot;litecoin-details&quot; className=&quot;text-center marfo text-5xl font-bold text-[#11100F] hover:underline font-display&quot;>Litecoin Details</h2>

      {litecoinData && (
        <div className=&quot;dia text-center relative z-10 w-3/4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 px-4&quot;>
          <div className=&quot;bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105&quot;>
            <h2 className=&quot;text-2xl font-bold text-[#11100F] font-display&quot;>Price</h2>
            <p className=&quot;text-3xl font-bold text-green-600&quot;>${litecoinData.usd}</p>
          </div>
          <div className=&quot;bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105&quot;>
            <h2 className=&quot;text-2xl font-bold text-[#11100F] font-display&quot;>Market Cap</h2>
            <p className=&quot;text-3xl font-bold text-green-600&quot;>${litecoinData.usd_market_cap.toLocaleString()}</p>
          </div>
          <div className=&quot;bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105&quot;>
            <h2 className=&quot;text-2xl font-bold text-[#11100F] font-display&quot;>24h Volume</h2>
            <p className=&quot;text-3xl font-bold text-green-600&quot;>${litecoinData.usd_24h_vol.toLocaleString()}</p>
          </div>
          <div className=&quot;bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105&quot;>
            <h2 className=&quot;text-2xl font-bold text-[#11100F] font-display&quot;>24h Change</h2>
            <p className={`text-3xl font-bold ${litecoinData.usd_24h_change >= 0 ? &apos;text-green-600&apos; : &apos;text-red-600&apos;}`}>
              {litecoinData.usd_24h_change.toFixed(2)}%
            </p>
          </div>
          <div className=&quot;bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105&quot;>
            <h2 className=&quot;text-2xl font-bold text-[#11100F] font-display&quot;>Circulating Supply</h2>
            <p className=&quot;text-3xl font-bold text-green-600&quot;>{marketData.market_data?.circulating_supply?.toLocaleString()} LTC</p>
          </div>
          <div className=&quot;bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-brightness-125 p-8 rounded-lg transition-transform transition-all transform hover:scale-105&quot;>
            <h2 className=&quot;text-2xl font-bold text-[#11100F] font-display&quot;>Max Supply</h2>
            <p className=&quot;text-3xl font-bold text-green-600&quot;>{marketData.market_data?.max_supply?.toLocaleString()} LTC</p>
          </div>
        </div>
      )}

      <div className=&quot;text-center relative z-10 w-3/4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 px-4&quot;>
        <div className=&quot;relative z-10 mt-16 col-span-3&quot;>
        <h2  id=&quot;blockchain-info&quot; className=&quot;marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display&quot;>Blockchain Info</h2>
        <div className=&quot;dia max-w-screen-xl mx-auto mt-8 grid grid-cols-2 gap-8&quot;>
        
                <div className=&quot;bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 p-8 rounded-lg transition-transform transform hover:scale-105&quot;>
                  <h2 className=&quot;text-2xl font-bold text-white font-display&quot;>Total Blocks</h2>
                  <p className=&quot;text-3xl font-bold text-green-600&quot;>{blockchainData.blocks}</p>
                </div>
                <div className=&quot;bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 p-8 rounded-lg transition-transform transform hover:scale-105&quot;>
                  <h2 className=&quot;text-2xl font-bold text-white font-display&quot;>24h Transactions</h2>
                  <p className=&quot;text-3xl font-bold text-green-600&quot;>{blockchainData.transactions_24h}</p>
                </div>
                <div className=&quot;bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 p-8 rounded-lg transition-transform transform hover:scale-105&quot;>
                  <h2 className=&quot;text-2xl font-bold text-white font-display&quot;>Total Transactions</h2>
                  <p className=&quot;text-3xl font-bold text-green-600&quot;>{blockchainData.transactions}</p>
                </div>
                <div className=&quot;bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 p-8 rounded-lg transition-transform transform hover:scale-105&quot;>
                  <h2 className=&quot;text-2xl font-bold text-white font-display&quot;>Difficulty</h2>
                  <p className=&quot;text-3xl font-bold text-green-600&quot;>{blockchainData.difficulty}</p>
                </div>
              
            </div>
        </div>
        <div id=&quot;search-transaction&quot; className=&quot;relative z-10 mt-16 col-span-2&quot;>
        <div className=&quot;&quot;>
            <div className=&quot;items-center&quot;>
              <h2 className=&quot;marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display&quot;>Search Transaction</h2>
              <div className=&quot;dia flex items-center justify-center&quot;>
                <div className=&quot;relative w-full&quot;>
                  <input
                    type=&quot;text&quot;
                    placeholder=&quot;Enter Transaction Hash&quot;
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    className=&quot;mt-8 p-4 transition-transform transform hover:scale-105 placeholder:text-center rounded-lg bg-[#54257d]/30 hover:bg-[#672e99]/30 text-white placeholder-white w-full&quot;
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className=&quot;mt-8 ml-2 px-4 py-4 rounded-lg bg-[#11100F] transition-transform transform hover:scale-105&quot;>
                  <svg xmlns=&quot;http://www.w3.org/2000/svg&quot; fill=&quot;none&quot; viewBox=&quot;0 0 24 24&quot; strokeWidth={1.5} stroke=&quot;white&quot; className=&quot;size-6&quot;><path strokeLinecap=&quot;round&quot; strokeLinejoin=&quot;round&quot; d=&quot;m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z&quot; /></svg>
                </button>
              </div>
            </div>

            {!transactionData && !transactionError ? (
              <div className=&quot;dia min-h-[205px] flex items-center justify-center relative text-center mt-9 p-8 bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 rounded-lg transition-transform transform hover:scale-105&quot;>
                <p className=&quot;font-display text-lg text-white&quot;>Enter hash above to search</p>
              </div>
            ) : transactionError ? (
              <div className=&quot;min-h-[205px] flex items-center justify-center relative text-center mt-9 p-8 bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 rounded-lg transition-transform transform hover:scale-105&quot;>
                <p className=&quot;dia font-display text-lg text-red-500&quot;>{transactionError}</p>
              </div>
            ) : (
              <div className=&quot;dia relative text-center mt-9 p-8 bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 rounded-lg transition-transform transform hover:scale-105&quot;>
                
                <p className=&quot;font-display text-lg&quot;><strong>Block Height:</strong> {transactionData.block_height}</p>
                <p className=&quot;font-display text-lg&quot;><strong>Transaction Fee:</strong> {transactionData.fees / 100000000} LTC</p>
                <p className=&quot;font-display text-lg&quot;><strong>Time:</strong> {new Date(transactionData.received).toLocaleString()}</p>
                <p className=&quot;font-display text-lg&quot;><strong>Size:</strong> {transactionData.size} bytes</p>
                <p className=&quot;font-display text-lg&quot;><strong>Total:</strong> {transactionData.total / 100000000} LTC</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className=&quot;text-center relative z-10 w-3/4 mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 px-4&quot;>
        <div className=&quot;&quot;>
          <div className=&quot;relative z-10 mt-16&quot;>
          <h2 className=&quot;marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display&quot;>Latest Transactions</h2>
            <div id=&quot;latest-transactions&quot; className=&quot;dia transition-transform transform hover:scale-105 mx-auto mt-8 &quot;>
              <table className=&quot;mt-8 min-w-full bg-[#FFFFFF]/30 hover:bg-[#E6E0D9]/30 backdrop-blur-lg backdrop-brightness-125 rounded-lg text-[#11100F] transition-transform transform&quot;>
                <thead>
                  <tr>
                    <th className=&quot;px-6 py-4 font-display text-lg&quot;>Transaction Hash</th>
                    <th className=&quot;px-6 py-4 font-display text-lg&quot;>Block Height</th>
                    <th className=&quot;px-6 py-4 font-display text-lg&quot;>Transaction Fee</th>
                    <th className=&quot;px-6 py-4 font-display text-lg&quot;>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {latestTransactions.map((transaction, index) => (
                    <tr key={index} className=&quot;&quot;>
                      <td className=&quot;px-6 py-4 font-display text-lg break-all&quot;>{transaction.hash.slice(0, 5)}...{transaction.hash.slice(-5)}</td>
                      <td className=&quot;px-6 py-4 font-display text-lg&quot;>{transaction.block_id}</td>
                      <td className=&quot;px-6 py-4 font-display text-lg&quot;>{transaction.fee} LTC</td>
                      <td className=&quot;px-6 py-4 font-display text-lg&quot;>{new Date(transaction.time).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Exchange Rates and Latest News section */}
      <div className=&quot;text-center relative z-10 w-3/4 mx-auto mt-16 px-4&quot;>
        <div className=&quot;grid grid-cols-1 md:grid-cols-5 gap-8&quot;>
          <div id=&quot;exchange-rates&quot; className=&quot;col-span-2&quot;>
            <h2 className=&quot;marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display mb-8&quot;>Exchange Rates</h2>
            <div className=&quot;dia grid grid-cols-1 gap-4&quot;>
              {Object.entries(exchangeRates).map(([coin, rate]) => (
                <div key={coin} className=&quot;mb-2 bg-[#54257d]/30 hover:bg-[#672e99]/30 backdrop-blur-lg backdrop-brightness-125 p-4 rounded-lg transition-transform transform hover:scale-105&quot;>
                  <h3 className=&quot;text-xl font-bold text-white font-display mb-2&quot;>
                    {coinIcons[coin]}
                    {coin.charAt(0).toUpperCase() + coin.slice(1)}
                  </h3>
                  <p className=&quot;text-lg font-bold text-green-600&quot;>1 LTC = {rate.toFixed(8)} {coin.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div id=&quot;latest-news&quot; className=&quot;col-span-3&quot;>
            <h2 className=&quot;marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display mb-8&quot;>Latest News</h2>
            <div className=&quot;space-y-4&quot;>
              {newsArticles.length > 0 ? (
                newsArticles.map((article, index) => (
                  <div key={index} className=&quot;dia bg-[#54257d]/30 hover:bg-[#672e99]/30 p-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg&quot;>
                    <h3 className=&quot;text-xl font-bold text-white font-display mb-2&quot;>{article.title}</h3>
                    <p className=&quot;text-white mb-4&quot;>{article.description}</p>
                    <a href={article.url} target=&quot;_blank&quot; rel=&quot;noopener noreferrer&quot; className=&quot;text-black hover:underline&quot;>Read more</a>
                  </div>
                ))
              ) : (
                <p className=&quot;text-gray-400&quot;>No news available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Updated Price History section */}
      {/* Updated Price History section */}
      <div id=&quot;price-history&quot; className=&quot;text-center relative z-10 w-3/4 mx-auto mt-24 px-4&quot;>
        <h2 className=&quot;marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display mb-12&quot;>30-Day Price History</h2>
        <div className=&quot;dia bg-white p-4 rounded-lg transition-transform transition-all transform hover:scale-105 shadow-lg&quot;>
          <ResponsiveContainer width=&quot;100%&quot; height={400}>
            <LineChart data={priceHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray=&quot;3 3&quot; stroke=&quot;#ccc&quot; opacity={0.5} />
              <XAxis 
                dataKey=&quot;date&quot; 
                stroke=&quot;#333&quot;
                tick={{ fill: &quot;#333&quot;, fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  const day = date.getDate();
                  return day % 5 === 0 ? value : &quot;&quot;;
                }}
                interval={0}
                angle={-45}
                textAnchor=&quot;end&quot;
                height={60}
              />
              <YAxis 
                stroke=&quot;#333&quot;
                tick={{ fill: &quot;#333&quot; }}
                tickFormatter={(value) => &quot;$&quot; + value}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: &quot;#fff&quot;, border: &quot;1px solid #ccc&quot;, color: &quot;#333&quot; }}
                itemStyle={{ color: &quot;#333&quot; }}
                formatter={(value) => [&quot;$&quot; + value, &quot;Price&quot;]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line type=&quot;monotone&quot; dataKey=&quot;price&quot; stroke=&quot;#766387&quot; strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      <div id=&quot;about-litecoin&quot; className=&quot;text-center relative z-10 w-3/4 mx-auto mt-16 px-4 mb-16&quot;>
        <h2 className=&quot;marfo text-center text-5xl font-bold text-[#11100F] hover:underline font-display mb-8&quot;>About Litecoin</h2>
        <div className=&quot;dia bg-[#54257d]/30 hover:bg-[#672e99]/30 p-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg&quot;>
          <p className=&quot;text-white mb-4&quot;>
            Litecoin (LTC), often referred to as the &quot;silver to Bitcoin&apos;s gold,&quot; is a decentralized cryptocurrency created by Charlie Lee in 2011. It was one of the earliest cryptocurrencies to fork from Bitcoin&apos;s blockchain, aiming to provide a faster and more efficient payment network. Designed as a &quot;lite&quot; version of Bitcoin, Litecoin offers faster transaction speeds and lower fees, making it more suitable for everyday transactions.
          </p>
          
          <p className=&quot;text-white mb-4&quot;>
            One of Litecoin&apos;s key features is its use of the Scrypt algorithm, a memory-hard mining algorithm that makes it more resistant to ASIC mining and potentially more accessible to smaller miners. Litecoin has a block generation time of 2.5 minutes, compared to Bitcoin&apos;s 10 minutes, allowing for quicker transaction confirmations. It also has a larger maximum supply of 84 million LTC, compared to Bitcoin&apos;s 21 million, and supports technologies like SegWit and the Lightning Network for even faster and cheaper transactions.
          </p>
          
          <p className=&quot;text-white mb-4&quot;>
            The benefits of Litecoin include faster transaction confirmations, lower fees, and more accessible mining for individuals. With a proven track record and stability since 2011, Litecoin has gained wide acceptance among exchanges and merchants. Its strong community and growing adoption by merchants make it an attractive option for investors and users alike.
          </p>
          
          <p className=&quot;text-white mb-4&quot;>
            Compared to other cryptocurrencies, Litecoin occupies a unique position. While it shares similarities with Bitcoin as a payment system, it offers faster transactions and lower fees. Unlike Ethereum, which focuses on smart contracts and decentralized applications, Litecoin primarily serves as a digital currency. In contrast to newer chains, Litecoin has a longer history and proven reliability, though it may lack some of the advanced features of these newer platforms.
          </p>

          <p className=&quot;text-white mb-4&quot;>
            For investors, Litecoin presents both opportunities and risks. Its faster transaction speed and lower fees make it a potential alternative for smaller transactions and everyday payments. The cryptocurrency market&apos;s volatility can lead to significant price fluctuations, which can be seen as both a risk and an opportunity. As the market continues to evolve, Litecoin could see further growth and adoption, potentially leading to increased value.
          </p>

          <p className=&quot;text-white mb-4&quot;>
            However, it&apos;s important to note that investing in cryptocurrencies carries significant risks. These include market volatility, regulatory risks as governments worldwide closely monitor cryptocurrencies, and technological risks as the underlying technology continues to evolve. Potential investors should conduct thorough research and consider their own financial goals and risk tolerance before making any investment decisions.
          </p>
        </div>
      </div>

      <div className=&quot;h-16&quot;></div>

      {showButton && (
        <button onClick={scrollToTop} className=&quot;fixed bottom-5 right-5 px-4 py-2 transition-all&quot;>
          <Image
            src=&quot;/scrollb.png&quot;
            alt=&quot;scroll button&quot;
            width={55}
            height={55}
            className=&quot;object-contain drop-shadow-2xl&quot;
          />
        </button>
      )}

    </main>
  );
}
