# Litecoin Screener

## Description

Litecoin Screener is a comprehensive web application that provides real-time information and analytics for Litecoin (LTC). Built with Next.js and React, this project offers a user-friendly interface to track Litecoin's market data, blockchain information, and latest transactions.

## Features

- Real-time Litecoin price, market cap, and 24-hour volume
- Blockchain statistics including total blocks, transactions, and mining difficulty
- Transaction search functionality
- Latest transactions display
- 30-day price history chart
- Exchange rates comparison with other major cryptocurrencies
- Latest news articles related to Litecoin

## Technologies Used

- Next.js 14.2.6
- React 18.3.1
- Tailwind CSS 3.4.1
- Recharts 2.12.7 for data visualization
- React Icons 5.3.0

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/litecoin-screener.git
   ```

2. Navigate to the project directory:
   ```
   cd litecoin-screener
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

The application is divided into several sections:

1. Litecoin Details: Displays current price, market cap, volume, and supply information.
2. Blockchain Info: Shows key blockchain statistics.
3. Transaction Search: Allows users to search for specific transactions by hash.
4. Latest Transactions: Lists the most recent Litecoin transactions.
5. Exchange Rates: Compares Litecoin's value to other major cryptocurrencies.
6. Price History: Visualizes Litecoin's price over the last 30 days.
7. Latest News: Displays recent news articles related to Litecoin.

## API Integration

This project integrates with several APIs to fetch real-time data:

- CoinGecko API for price and market data
- Blockchair API for blockchain and transaction data
- BlockCypher API for transaction search
- News API for latest Litecoin news

## Dependencies

Main dependencies:
- next: ^14.2.6
- react: ^18.3.1
- react-dom: ^18.3.1
- react-icons: ^5.3.0
- recharts: ^2.12.7

Dev dependencies:
- eslint: ^8
- eslint-config-next: 14.2.6
- postcss: ^8
- tailwindcss: ^3.4.1

For a full list of dependencies, please refer to the `package.json` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [CoinGecko API](https://www.coingecko.com/en/api/documentation)
- [Blockchair API](https://blockchair.com/api)
- [BlockCypher API](https://www.blockcypher.com/dev/litecoin/)
- [News API](https://newsapi.org/)
