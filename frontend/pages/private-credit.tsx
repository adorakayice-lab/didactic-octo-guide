import React, { useState } from 'react';
import Head from 'next/head';
import DealCard from '@/components/DealCard';

export default function PrivateCredit() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('apy');

  const allDeals = [
    {
      id: '1',
      title: 'Tech Startup Series A',
      apy: 12,
      term: 24,
      minInvestment: 500,
      currentRaised: 750000,
      targetAmount: 1000000,
      status: 'open' as const,
      description: 'Innovative fintech solutions for emerging markets with strong growth potential.',
    },
    {
      id: '2',
      title: 'Real Estate Development',
      apy: 10,
      term: 36,
      minInvestment: 1000,
      currentRaised: 500000,
      targetAmount: 2000000,
      status: 'open' as const,
      description: 'Premium property development in Lagos with high rental yield expectations.',
    },
    {
      id: '3',
      title: 'Agriculture Infrastructure',
      apy: 8,
      term: 12,
      minInvestment: 250,
      currentRaised: 1500000,
      targetAmount: 1500000,
      status: 'closed' as const,
      description: 'Sustainable farming solutions supporting small-holder farmers in Africa.',
    },
    {
      id: '4',
      title: 'Supply Chain Fintech',
      apy: 14,
      term: 18,
      minInvestment: 1000,
      currentRaised: 200000,
      targetAmount: 500000,
      status: 'open' as const,
      description: 'Blockchain-based supply chain financing for African exporters.',
    },
    {
      id: '5',
      title: 'Green Energy Project',
      apy: 9,
      term: 48,
      minInvestment: 2000,
      currentRaised: 1000000,
      targetAmount: 3000000,
      status: 'open' as const,
      description: 'Solar and wind energy infrastructure across sub-Saharan Africa.',
    },
    {
      id: '6',
      title: 'E-commerce Platform',
      apy: 13,
      term: 20,
      minInvestment: 750,
      currentRaised: 300000,
      targetAmount: 800000,
      status: 'coming' as const,
      description: 'Large-scale e-commerce platform connecting African merchants globally.',
    },
  ];

  const filteredDeals = allDeals.filter((deal) => {
    if (filterStatus === 'all') return true;
    return deal.status === filterStatus;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'apy':
        return b.apy - a.apy;
      case 'term':
        return a.term - b.term;
      case 'progress':
        return (b.currentRaised / b.targetAmount) - (a.currentRaised / a.targetAmount);
      default:
        return 0;
    }
  });

  return (
    <>
      <Head>
        <title>Private Credit Deals - AssetBridge Nexus</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Private Credit Opportunities</h1>
            <p className="text-blue-100 text-lg max-w-2xl">
              Invest in carefully vetted credit deals with transparent underwriting and competitive returns.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filters and Sort */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Filter by Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'open', 'coming', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filterStatus === status
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="apy">Highest APY</option>
                  <option value="term">Shortest Term</option>
                  <option value="progress">Recently Added</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{sortedDeals.length}</span> of{' '}
                <span className="font-semibold">{allDeals.length}</span> deals
              </p>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedDeals.map((deal) => (
              <DealCard key={deal.id} {...deal} />
            ))}
          </div>

          {/* Empty State */}
          {sortedDeals.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No deals match your filters.</p>
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setSortBy('apy');
                }}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
