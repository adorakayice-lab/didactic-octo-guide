import React, { useState } from 'react';
import Head from 'next/head';

export default function Vault() {
  const [activeTab, setActiveTab] = useState('deposit');
  const [depositAmount, setDepositAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const vaultStrategies = [
    {
      name: 'Conservative',
      allocation: 'Tech (30%) | Real Estate (40%) | Agriculture (30%)',
      apy: 8.5,
      risk: 'Low',
    },
    {
      name: 'Balanced',
      allocation: 'Tech (40%) | Real Estate (35%) | Agriculture (25%)',
      apy: 10.2,
      risk: 'Medium',
    },
    {
      name: 'Aggressive',
      allocation: 'Tech (50%) | Real Estate (30%) | Agriculture (20%)',
      apy: 12.8,
      risk: 'High',
    },
  ];

  const handleDeposit = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Deposit of $${depositAmount} initiated!`);
      setDepositAmount('');
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>RWA Vault - AssetBridge Nexus</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-secondary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">RWA Vault Management</h1>
            <p className="text-green-100 text-lg max-w-2xl">
              Deposit your assets and let our AI-powered strategies maximize your yields across multiple opportunities.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Deposit/Withdraw Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Your Vault</h2>

                {/* Tab Switch */}
                <div className="flex space-x-4 mb-6 border-b border-gray-200">
                  {['deposit', 'withdraw'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 font-semibold transition-colors ${
                        activeTab === tab
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Deposit Form */}
                {activeTab === 'deposit' && (
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Amount to Deposit (USD)
                      </label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-sm text-gray-600 mt-2">Minimum: $250 | Maximum: $100,000</p>
                    </div>

                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Estimated Monthly Yield:</span>
                        {depositAmount ? ` $${(parseFloat(depositAmount) * 0.85 / 12).toFixed(2)}` : ' $0.00'}
                      </p>
                    </div>

                    <button
                      onClick={handleDeposit}
                      disabled={isLoading || !depositAmount}
                      className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : 'Confirm Deposit'}
                    </button>
                  </div>
                )}

                {/* Withdraw Form */}
                {activeTab === 'withdraw' && (
                  <div>
                    <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
                      <p className="text-sm text-yellow-700">
                        ⚠️ Withdrawals require 7-day notice for processing.
                      </p>
                    </div>
                    <button className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                      Request Withdrawal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Vault Strategies */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Strategies</h2>

                <div className="space-y-6">
                  {vaultStrategies.map((strategy, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 p-6 rounded-xl hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{strategy.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{strategy.allocation}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{strategy.apy}%</p>
                          <p className="text-xs text-gray-600">APY</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            strategy.risk === 'Low'
                              ? 'bg-green-100 text-green-800'
                              : strategy.risk === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {strategy.risk} Risk
                        </span>
                        <button className="text-primary font-semibold hover:underline">
                          Select Strategy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vault Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                  {[
                    { label: 'Total Vault AUM', value: '$250M+' },
                    { label: 'Active Participants', value: '12K+' },
                    { label: 'Avg. Returns', value: '10.2%' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-lg font-bold text-primary">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
