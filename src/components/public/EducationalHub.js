// src/components/public/EducationalHub.js
import React, { useState } from 'react';
import { BookOpen, ChevronRight, TrendingUp, PieChart, Shield, Target, DollarSign, BarChart3 } from 'lucide-react';

const EducationalHub = ({ onSignInPrompt }) => {
  const [selectedCategory, setSelectedCategory] = useState('basics');
  const [expandedTerm, setExpandedTerm] = useState(null);

  const categories = [
    {
      id: 'basics',
      title: 'Stock Market Basics',
      icon: BookOpen,
      color: 'blue'
    },
    {
      id: 'trading',
      title: 'Trading Terms',
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 'analysis',
      title: 'Technical Analysis',
      icon: BarChart3,
      color: 'purple'
    },
    {
      id: 'portfolio',
      title: 'Portfolio Management',
      icon: PieChart,
      color: 'orange'
    }
  ];

  const educationalContent = {
    basics: [
      {
        term: "Stock",
        definition: "A share of ownership in a company",
        example: "If you buy 10 shares of Apple, you own a tiny piece of Apple Inc.",
        importance: "Stocks represent potential for growth and dividends as companies succeed."
      },
      {
        term: "Market Cap",
        definition: "Total value of a company's shares (stock price × number of shares)",
        example: "If Apple has 1 billion shares at $150 each, market cap = $150 billion",
        importance: "Helps classify companies as small-cap, mid-cap, or large-cap investments."
      },
      {
        term: "Dividend",
        definition: "Cash payments companies make to shareholders from profits",
        example: "Apple pays $0.25 per share quarterly - if you own 100 shares, you get $25",
        importance: "Provides regular income stream independent of stock price movements."
      },
      {
        term: "P/E Ratio",
        definition: "Price-to-Earnings ratio shows how much investors pay per dollar of earnings",
        example: "Stock price $100, earnings $5 per share = P/E of 20",
        importance: "Helps determine if a stock is overvalued or undervalued compared to peers."
      },
      {
        term: "Bull vs Bear Market",
        definition: "Bull market = rising prices (optimism), Bear market = falling prices (pessimism)",
        example: "2020-2021 was a bull market, 2008 financial crisis was a bear market",
        importance: "Understanding market cycles helps with timing and risk management."
      },
      {
        term: "IPO",
        definition: "Initial Public Offering - when a private company first sells shares to the public",
        example: "Facebook went public in 2012 at $38 per share, raising $16 billion",
        importance: "IPOs offer early investment opportunities but come with higher volatility."
      }
    ],
    trading: [
      {
        term: "Buy Order",
        definition: "An instruction to purchase shares at current market price or specified price",
        example: "Buy 50 shares of Tesla at market price or Buy 50 shares at $200 limit",
        importance: "Foundation of building your investment portfolio."
      },
      {
        term: "Sell Order",
        definition: "An instruction to sell shares you own at market price or specified price",
        example: "Sell 25 shares of Google at market price or Sell at $2,800 limit",
        importance: "Allows you to lock in profits or cut losses."
      },
      {
        term: "Volume",
        definition: "Number of shares traded in a given period",
        example: "Apple trades 50 million shares daily on average",
        importance: "High volume indicates strong interest and easier buying/selling."
      },
      {
        term: "Bid vs Ask",
        definition: "Bid = highest price buyers offer, Ask = lowest price sellers want",
        example: "Bid: $99.50, Ask: $100.00 - the spread is $0.50",
        importance: "Understanding spread helps with timing entry and exit points."
      },
      {
        term: "Stop Loss",
        definition: "Automatic sell order triggered when stock falls to specified price",
        example: "Buy at $100, set stop loss at $90 to limit losses to 10%",
        importance: "Essential risk management tool to protect your capital."
      },
      {
        term: "Market vs Limit Order",
        definition: "Market order executes immediately at current price, Limit order only at your specified price",
        example: "Market: Buy now at $100.50, Limit: Only buy if price drops to $100.00",
        importance: "Limit orders give price control, market orders guarantee execution."
      },
      {
        term: "Day Trading vs Swing Trading",
        definition: "Day trading = buy/sell same day, Swing trading = hold for days/weeks",
        example: "Day trader buys TSLA at 9am, sells at 3pm. Swing trader holds for 2 weeks",
        importance: "Different strategies require different skills and time commitments."
      }
    ],
    analysis: [
      {
        term: "Support Level",
        definition: "Price level where stock historically stops falling and bounces back",
        example: "Tesla repeatedly bounces off $200 - that's a support level",
        importance: "Helps identify good entry points for buying opportunities."
      },
      {
        term: "Resistance Level",
        definition: "Price level where stock historically stops rising and falls back",
        example: "Amazon struggles to break above $3,500 - that's resistance",
        importance: "Helps identify good exit points and potential selling opportunities."
      },
      {
        term: "Moving Average",
        definition: "Average stock price over specific time period (20-day, 50-day, 200-day)",
        example: "50-day MA smooths daily price fluctuations to show trend direction",
        importance: "Identifies trends - price above MA suggests uptrend, below suggests downtrend."
      },
      {
        term: "RSI (Relative Strength Index)",
        definition: "Momentum indicator measuring speed and magnitude of price changes (0-100)",
        example: "RSI above 70 = potentially overbought, below 30 = potentially oversold",
        importance: "Helps identify when stocks might be due for reversal."
      },
      {
        term: "Candlestick Chart",
        definition: "Chart showing open, high, low, close prices in visual candle format",
        example: "Green candle = price went up, red candle = price went down",
        importance: "Provides detailed price action information for better timing decisions."
      },
      {
        term: "MACD",
        definition: "Moving Average Convergence Divergence - shows relationship between two moving averages",
        example: "When MACD line crosses above signal line, it may indicate upward momentum",
        importance: "Helps identify trend changes and momentum shifts."
      },
      {
        term: "Bollinger Bands",
        definition: "Price channels based on moving average with upper and lower bands",
        example: "Price touching upper band might indicate overbought condition",
        importance: "Shows volatility and potential reversal points."
      }
    ],
    portfolio: [
      {
        term: "Diversification",
        definition: "Spreading investments across different stocks, sectors, and asset types",
        example: "Own tech stocks (Apple), healthcare (J&J), finance (JPM), and bonds",
        importance: "Reduces risk - if one sector falls, others may hold steady or rise."
      },
      {
        term: "Asset Allocation",
        definition: "Percentage breakdown of your portfolio across different investment types",
        example: "60% stocks, 30% bonds, 10% cash for moderate risk tolerance",
        importance: "Balances growth potential with risk management based on your goals."
      },
      {
        term: "Rebalancing",
        definition: "Periodically adjusting portfolio back to target allocation percentages",
        example: "If stocks grow to 70%, sell some and buy bonds to get back to 60/30",
        importance: "Maintains desired risk level and forces disciplined profit-taking."
      },
      {
        term: "Dollar-Cost Averaging",
        definition: "Investing fixed amount regularly regardless of share price",
        example: "Invest $500 monthly in S&P 500 - buy more shares when low, fewer when high",
        importance: "Reduces impact of market volatility and removes emotion from timing."
      },
      {
        term: "Risk Tolerance",
        definition: "Your comfort level with potential investment losses",
        example: "Conservative: 20% stocks, Moderate: 60% stocks, Aggressive: 90% stocks",
        importance: "Determines appropriate investment strategy and asset allocation."
      },
      {
        term: "Beta",
        definition: "Measure of stock's volatility compared to overall market (market beta = 1.0)",
        example: "Beta 1.5 = stock moves 50% more than market, Beta 0.5 = half as volatile",
        importance: "Helps assess risk level and portfolio volatility."
      },
      {
        term: "Expense Ratio",
        definition: "Annual fee charged by mutual funds/ETFs as percentage of investment",
        example: "0.05% expense ratio = $5 annually per $10,000 invested",
        importance: "Lower fees mean more money stays invested and compounds over time."
      }
    ]
  };

  const getCategoryColor = (color, type = 'bg') => {
    const colors = {
      blue: type === 'bg' ? 'bg-blue-100' : 'text-blue-600',
      green: type === 'bg' ? 'bg-green-100' : 'text-green-600',
      purple: type === 'bg' ? 'bg-purple-100' : 'text-purple-600',
      orange: type === 'bg' ? 'bg-orange-100' : 'text-orange-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Learn Stock Market Fundamentals
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Master the terminology and concepts before you start trading
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map(({ id, title, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setSelectedCategory(id)}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedCategory === id
                ? `${getCategoryColor(color)} ${getCategoryColor(color, 'text')} shadow-md`
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
            }`}
          >
            <Icon size={20} className="mr-2" />
            {title}
          </button>
        ))}
      </div>

      {/* Educational Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid gap-6">
          {educationalContent[selectedCategory].map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedTerm(expandedTerm === index ? null : index)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.term}
                    </h3>
                    <p className="text-gray-600">{item.definition}</p>
                  </div>
                  <ChevronRight
                    size={24}
                    className={`text-gray-400 transform transition-transform ${
                      expandedTerm === index ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </button>
              
              {expandedTerm === index && (
                <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                  <div className="pt-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Target size={16} className="mr-2 text-blue-600" />
                        Example:
                      </h4>
                      <p className="text-gray-700 bg-white p-3 rounded border-l-4 border-blue-500">
                        {item.example}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Shield size={16} className="mr-2 text-green-600" />
                        Why It Matters:
                      </h4>
                      <p className="text-gray-700 bg-white p-3 rounded border-l-4 border-green-500">
                        {item.importance}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Put Knowledge into Practice?</h3>
          <p className="mb-4 text-blue-100">
            Start trading with virtual money and apply what you've learned
          </p>
          <button
            onClick={onSignInPrompt}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Trading Now
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">{educationalContent.basics.length}</div>
          <div className="text-sm text-blue-600">Market Basics</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-900">{educationalContent.trading.length}</div>
          <div className="text-sm text-green-600">Trading Terms</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-900">{educationalContent.analysis.length}</div>
          <div className="text-sm text-purple-600">Analysis Tools</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-900">{educationalContent.portfolio.length}</div>
          <div className="text-sm text-orange-600">Portfolio Tips</div>
        </div>
      </div>
    </div>
  );
};

export default EducationalHub;