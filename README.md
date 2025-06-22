# StockSim - Stock Trading Simulator

A modern web app where you can practice trading stocks with virtual money. Learn to invest without any risk!

## What This App Does

- **Practice Trading**: Buy and sell stocks with $10,000 virtual money
- **Real-Time Prices**: Uses live stock data when available, or realistic simulation
- **Track Performance**: See your profits, losses, and portfolio growth
- **Learn Safely**: No real money involved - perfect for beginners
- **Mobile Friendly**: Works great on phones, tablets, and computers

## Live Demo

Try it out: (https://dev.dfi69wt422dkk.amplifyapp.com)

## Features

### 🎯 **Trading**
- Search and select from popular stocks (Apple, Microsoft, Google, etc.)
- Buy and sell with easy-to-use interface
- Real-time price updates every 2 seconds
- See your buying power and current holdings

### 📊 **Portfolio Management**
- Track all your stock holdings
- See profit/loss for each stock
- View complete transaction history
- Portfolio value updates automatically

### 📱 **Mobile Ready**
- Touch-friendly buttons and menus
- Works perfectly on any screen size
- Swipe-friendly scrolling
- Optimized for phones and tablets

### 🔄 **Smart Data System**
- Tries to get real stock prices first
- Falls back to realistic simulation if needed
- No API limits - unlimited practice trading
- Prices move like real stocks

### 🔐 **User Accounts**
- Secure sign up and login
- Your data is saved automatically
- Export/import your trading data
- Reset your portfolio anytime

## How to Use

1. **Sign Up**: Create a free account (no credit card needed)
2. **Start Trading**: You begin with $10,000 virtual money
3. **Search Stocks**: Find stocks you want to trade
4. **Buy/Sell**: Practice your trading strategies
5. **Track Progress**: Watch your portfolio grow (or learn from losses!)

## Technical Setup

### Quick Start
```bash
# Clone the project
git clone [your-repo-url]
cd stock-application

# Install everything needed
npm install

# Start the app
npm start
```

The app will open at http://localhost:3000

### Optional: Real Stock Data

By default, the app uses realistic simulation. To get actual stock prices:

1. Get a free API key from [finnhub.io](https://finnhub.io)
2. Create a `.env` file in the project folder
3. Add this line: `REACT_APP_FINNHUB_API_KEY=your_api_key_here`
4. Restart the app with `npm start`

**Note**: Even without an API key, the app works perfectly with simulation!

## What's Built With

### Frontend
- **React** - For the user interface
- **Tailwind CSS** - For styling and mobile design
- **Lucide React** - For icons

### Backend & Services
- **AWS Amplify** - For user accounts and data storage
- **Finnhub API** - For real stock prices (optional)
- **Smart Simulation** - For unlimited practice trading

### Key Features
- **Hybrid Data System** - Real prices + simulation
- **Mobile-First Design** - Works on any device
- **Real-Time Updates** - Prices change like real markets
- **Secure Authentication** - Your data is safe

## How the Data Works

1. **First Load**: App tries to get real stock prices
2. **Success**: Uses real prices as starting point, then simulates realistic movements
3. **No API Key**: Uses pure simulation with market-like behavior
4. **Updates**: Prices update every 2 seconds with realistic patterns

This gives you unlimited practice without API rate limits!

## Project Structure

```
src/
├── components/          # All UI components
│   ├── home/           # Home page with welcome and market movers
│   ├── portfolio/      # Portfolio tracking and holdings
│   ├── trade/          # Stock trading interface
│   ├── layout/         # Navigation and headers
│   ├── common/         # Reusable components
│   └── public/         # Landing page for visitors
├── hooks/              # Custom React hooks
├── services/           # Data fetching and simulation
├── utils/              # Helper functions and constants
└── App.js              # Main app with authentication
```

## Mobile Optimizations

The app is fully optimized for mobile devices:

- **Touch Targets**: All buttons are finger-friendly (44px minimum)
- **Responsive Layout**: Adapts to any screen size
- **Card Design**: Important info is in easy-to-read cards
- **Swipe Scrolling**: Smooth scrolling for lists
- **Safe Areas**: Works with phone notches and rounded corners
- **Large Text**: No tiny text that's hard to read

## Available Scripts

- `npm start` - Run the app locally
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run deploy` - Deploy to GitHub Pages

## Deployment

### GitHub Pages
```bash
npm run build
npm run deploy
```

### Other Platforms
The built files are in the `build/` folder after running `npm run build`.

## Contributing

Want to help improve StockSim?

1. Fork the project
2. Create a feature branch: `git checkout -b my-new-feature`
3. Make your changes
4. Commit: `git commit -am 'Add some feature'`
5. Push: `git push origin my-new-feature`
6. Submit a pull request

## Common Questions

**Q: Do I need an API key?**
A: No! The app works great with simulation. An API key just gives you real starting prices.

**Q: Is my data safe?**
A: Yes! User accounts and data are secured with AWS Amplify.

**Q: Can I use this on my phone?**
A: Absolutely! The app is designed mobile-first.

**Q: Is this real trading?**
A: No, it's 100% simulation with virtual money. Perfect for learning!

**Q: Can I reset my portfolio?**
A: Yes, there's a reset button in the settings menu.

## License

This project is open source. Feel free to use it for learning!

## Support

Having issues? Check these:

1. Make sure you're using a modern browser
2. Try refreshing the page
3. Check your internet connection
4. Look at the browser console for error messages

---

**Built with ❤️ for learning and practice trading**

Start your investment journey risk-free with StockSim!