// src/components/public/PublicLandingPage.js
import React, { useState } from 'react';
import { TrendingUp, BookOpen, PieChart, Shield, Users, ArrowRight } from 'lucide-react';
import { useStockData } from '../../hooks/useStockData';
import LiveMarketData from './LiveMarketData';
import EducationalHub from './EducationalHub';
import FeaturesPreview from './FeaturesPreview';
import StockChart from './StockChart';
import DataSourceIndicator from '../common/DataSourceIndicator';

const PublicLandingPage = ({ onSignIn }) => {
  const { stockData, loading, dataInfo, refreshStockData } = useStockData();
  const [selectedStock, setSelectedStock] = useState('AAPL');

  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Trading",
      description: "Practice trading with live market data and build your investment skills"
    },
    {
      icon: PieChart,
      title: "Portfolio Management",
      description: "Track your investments and analyze performance with detailed insights"
    },
    {
      icon: BookOpen,
      title: "Learn & Grow",
      description: "Access educational content and master stock market fundamentals"
    },
    {
      icon: Shield,
      title: "Risk-free Practice",
      description: "Simulate trading without real money to perfect your strategy"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">StockSim</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Data Source Indicator */}
              {dataInfo && (
                <DataSourceIndicator 
                  dataInfo={dataInfo} 
                  onRefresh={refreshStockData}
                  compact={true}
                />
              )}
              
              <button
                onClick={onSignIn}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Start Trading Free
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Master Stock Trading
                <span className="block text-blue-200">Risk-Free</span>
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Practice trading with real market data, build your portfolio, and learn 
                investment strategies without risking real money.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onSignIn}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  Start Trading Now
                  <ArrowRight className="ml-2" size={20} />
                </button>
                <div className="flex items-center text-blue-200">
                  <Users size={20} className="mr-2" />
                  <span>Join now to be an active trader</span>
                </div>
              </div>
              
              {/* Data Status for Hero */}
              {dataInfo && (
                <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="text-sm text-blue-100">
                    {dataInfo.hasRealData ? (
                      <>
                        ✅ <strong>Live with real prices:</strong> Started with authentic market data for {dataInfo.realDataCount} stocks
                      </>
                    ) : (
                      <>
                        🎮 <strong>Simulation mode:</strong> Realistic price movements based on market patterns
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Featured Stock</h3>
              <StockChart 
                stock={stockData[selectedStock]} 
                loading={loading}
                compact={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Data Source Info Section */}
      {dataInfo && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DataSourceIndicator 
              dataInfo={dataInfo} 
              onRefresh={refreshStockData}
              compact={false}
            />
          </div>
        </section>
      )}

      {/* Live Market Data */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Live Market Data
            </h2>
            <p className="text-xl text-gray-600">
              {dataInfo?.hasRealData 
                ? `Real-time prices starting from authentic market data (${dataInfo.realDataCount} stocks)`
                : 'Real-time stock simulation with authentic market movements'
              }
            </p>
          </div>
          
          <LiveMarketData 
            stockData={stockData}
            loading={loading}
            onStockSelect={setSelectedStock}
            selectedStock={selectedStock}
            onSignInPrompt={onSignIn}
          />
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Professional trading tools and educational resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div key={index} className="text-center group">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Icon className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Hub */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EducationalHub onSignInPrompt={onSignIn} />
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturesPreview onSignInPrompt={onSignIn} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users who are learning to trade and building wealth through smart investing.
          </p>
          
          <button
            onClick={onSignIn}
            className="bg-white text-blue-600 px-12 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Create Free Account
            <ArrowRight className="ml-2" size={24} />
          </button>
          
          <p className="mt-4 text-blue-200 text-sm">
            No credit card required • Start with $10,000 virtual money
          </p>
          
          {dataInfo && (
            <div className="mt-6 text-sm text-blue-200">
              {dataInfo.hasRealData ? (
                `🚀 Experience real market movements with ${dataInfo.realDataCount} authentic stock prices`
              ) : (
                '🎮 Realistic market simulation - perfect for learning without limits'
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="text-blue-400" size={24} />
                <span className="text-xl font-bold">StockSim</span>
              </div>
              <p className="text-gray-400">
                Learn stock trading through simulation with real market data.
              </p>
              {dataInfo && (
                <div className="mt-3 text-sm text-gray-400">
                  {dataInfo.hasRealData ? 'Powered by real market data' : 'Realistic market simulation'}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Real-time Data</li>
                <li>Portfolio Tracking</li>
                <li>Educational Content</li>
                <li>Risk-free Trading</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Learn</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Stock Market Basics</li>
                <li>Trading Strategies</li>
                <li>Technical Analysis</li>
                <li>Risk Management</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StockSim. Built for educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLandingPage;