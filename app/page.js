'use client'
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Head from 'next/head';

const API_URL = 'https://api.coingecko.com/api/v3';

export default function Home() {
  const [litecoinData, setLitecoinData] = useState(null);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    async function fetchLitecoinData() {
      try {
        const priceResponse = await fetch(`${API_URL}/simple/price?ids=litecoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`);
        const priceData = await priceResponse.json();

        const marketResponse = await fetch(`${API_URL}/coins/litecoin`);
        const marketInfo = await marketResponse.json();

        const transactionsResponse = await fetch('https://api.blockchair.com/litecoin/transactions?limit=5');
        const transactionsData = await transactionsResponse.json();

        setLitecoinData(priceData.litecoin);
        setMarketData(marketInfo);
        setLatestTransactions(transactionsData.data);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchLitecoinData();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const marketCap = useMemo(() => litecoinData?.usd_market_cap?.toLocaleString(), [litecoinData]);
  const circulatingSupply = useMemo(() => marketData.market_data?.circulating_supply?.toLocaleString(), [marketData]);

  return (
    <>
      <Head>
        <title>Litecoin Dashboard</title>
        <meta name="description" content="Stay updated with the latest Litecoin market data and transactions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`w-full min-h-screen ${isDarkMode ? 'bg-dark-gradient text-gray-100' : 'bg-light-gradient text-gray-900'} font-sans transition-colors duration-300 ease-in-out`}>
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <section className="max-w-screen-lg mx-auto px-4 py-8">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <Card title="Price" value={`$${litecoinData.usd}`} isDarkMode={isDarkMode} />
                <Card title="Market Cap" value={`$${marketCap}`} isDarkMode={isDarkMode} />
                <Card title="24h Volume" value={`$${litecoinData.usd_24h_vol.toLocaleString()}`} isDarkMode={isDarkMode} />
                <Card title="24h Change" value={`${litecoinData.usd_24h_change.toFixed(2)}%`} change={litecoinData.usd_24h_change} isDarkMode={isDarkMode} />
                <Card title="Circulating Supply" value={`${circulatingSupply} LTC`} isDarkMode={isDarkMode} />
                <Card title="Max Supply" value={`${marketData.market_data?.max_supply?.toLocaleString()} LTC`} isDarkMode={isDarkMode} />
              </div>

              <Transactions transactions={latestTransactions} isDarkMode={isDarkMode} />

              <BlockchainInfo marketData={marketData} isDarkMode={isDarkMode} />
            </>
          )}
        </section>
        <Footer isDarkMode={isDarkMode} />
      </main>

      <style jsx global>{`
        .bg-dark-gradient {
          background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(30,30,30,1) 35%, rgba(69,11,100,1) 100%);
        }

        .bg-light-gradient {
          background: linear-gradient(180deg, rgba(240,240,240,1) 0%, rgba(255,215,180,1) 35%, rgba(255,143,107,1) 100%);
        }

        .header-gradient-dark {
          background: radial-gradient(circle, rgba(255,143,107,0.25) 0%, rgba(0,0,0,0.8) 70%);
        }

        .header-gradient-light {
          background: radial-gradient(circle, rgba(255,215,180,0.25) 0%, rgba(240,240,240,0.8) 70%);
        }

        h1 {
          font-family: 'Playfair Display', serif;
          font-size: 4rem;
          color: ${isDarkMode ? '#FFF' : '#333'};
          background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,143,107,1) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: color 0.3s ease-in-out;
        }

        .card {
          background-color: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0px 10px 30px rgba(0,0,0,0.5);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        .card:hover {
          transform: scale(1.08);
          box-shadow: 0px 15px 35px rgba(0,0,0,0.7);
        }

        .card.light-mode {
          background-color: rgba(255,255,255,0.6);
          box-shadow: 0px 10px 30px rgba(0,0,0,0.2);
        }

        .text-glow {
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.75);
        }

        .peer-checked:after {
          transform: translateX(6px) !important;
        }

        .transition-colors {
          transition: color 0.3s ease, background-color 0.3s ease;
        }

        .card-content {
          position: relative;
          z-index: 2;
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          z-index: 1;
          pointer-events: none;
          border-radius: 15px;
          transition: background 0.3s ease;
        }

        .card:hover .card-overlay {
          background: rgba(0, 0, 0, 0.3);
        }

        footer {
          padding: 20px 0;
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
          backdrop-filter: blur(10px);
          text-align: center;
          color: ${isDarkMode ? '#FFF' : '#333'};
          box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
        }

        footer a {
          color: ${isDarkMode ? '#ff8f6b' : '#ff5722'};
          transition: color 0.2s ease-in-out;
        }

        footer a:hover {
          color: ${isDarkMode ? '#ff5722' : '#ff8f6b'};
        }
      `}</style>
    </>
  );
}

function Header({ isDarkMode, toggleTheme }) {
  return (
    <header className={`py-4 px-6 flex flex-col items-center justify-center ${isDarkMode ? 'header-gradient-dark' : 'header-gradient-light'} shadow-lg`}>
      <div className="flex flex-col items-center space-y-4">
        <Image
          src="/ralitecornerdark.png"
          alt="RA Lite Logo"
          width={100}
          height={100}
          className="object-contain"
        />
        <h1 className="text-glow" style={{ color: isDarkMode ? '#FFFFFF' : '#333333' }}>Litecoin Dashboard</h1>
      </div>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </header>
  );
}

function ThemeToggle({ isDarkMode, toggleTheme }) {
  return (
    <div className="mt-4 flex items-center space-x-2 justify-end w-full">
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Dark Mode</span>
      <label className="relative inline-flex items-center cursor-pointer ml-2">
        <input type="checkbox" className="sr-only" checked={isDarkMode} onChange={toggleTheme} />
        <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white dark:after:bg-gray-300 after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-6 peer-checked:bg-indigo-500"></div>
      </label>
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Light Mode</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <p className="text-2xl font-bold animate-pulse">Loading...</p>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <p className="text-2xl font-bold text-red-500">{error}</p>
    </div>
  );
}

function Card({ title, value, change, isDarkMode }) {
  return (
    <div className={`card ${isDarkMode ? '' : 'light-mode'}`}>
      <div className="card-content">
        <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-black'} font-display truncate`}>{title}</h2>
        <p className={`text-4xl font-bold truncate ${change ? (change >= 0 ? 'text-green-500' : 'text-red-500') : 'text-green-500'}`}>
          {value}
        </p>
      </div>
      <div className="card-overlay"></div>
    </div>
  );
}

function Transactions({ transactions, isDarkMode }) {
  return (
    <div className="mt-16">
      <h2 className={`text-center text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-black'} font-display`}>Latest Transactions</h2>
      <div className="max-w-screen-lg mx-auto mt-8 grid grid-cols-1 gap-8">
        {transactions.map((transaction, index) => (
          <TransactionItem key={index} transaction={transaction} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );
}

function TransactionItem({ transaction, isDarkMode }) {
  return (
    <div className={`card ${isDarkMode ? '' : 'light-mode'}`}>
      <div className="card-content">
        <p className={`font-display text-lg truncate ${isDarkMode ? 'text-white' : 'text-black'}`}><strong>Transaction Hash:</strong> {transaction.transaction_hash}</p>
        <p className={`font-display text-lg truncate ${isDarkMode ? 'text-white' : 'text-black'}`}><strong>Block Height:</strong> {transaction.block_id}</p>
        <p className={`font-display text-lg truncate ${isDarkMode ? 'text-white' : 'text-black'}`}><strong>Transaction Fee:</strong> {transaction.transaction_fee} LTC</p>
        <p className={`font-display text-lg truncate ${isDarkMode ? 'text-white' : 'text-black'}`}><strong>Time:</strong> {new Date(transaction.time * 1000).toLocaleString()}</p>
      </div>
      <div className="card-overlay"></div>
    </div>
  );
}

function BlockchainInfo({ marketData, isDarkMode }) {
  return (
    <div className="mt-16">
      <h2 className={`text-center text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-black'} font-display`}>Blockchain Info</h2>
      <div className="max-w-screen-lg mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card title="Total Blocks" value={marketData.blockchain_stats_24_hours?.blocks} isDarkMode={isDarkMode} />
        <Card title="Total Transactions" value={marketData.blockchain_stats_24_hours?.transaction_count} isDarkMode={isDarkMode} />
        <Card title="Difficulty" value={marketData.blockchain_stats_24_hours?.difficulty} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

function Footer({ isDarkMode }) {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Litecoin Dashboard. All rights reserved.</p>
      <p>
        Designed by <a href="https://example.com">Your Name</a>
      </p>
    </footer>
  );
}
