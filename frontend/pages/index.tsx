import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import HeroBanner from '@/components/HeroBanner';
import DealCard from '@/components/DealCard';

export default function Home() {
  const featuredDeals = [
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
  ];

  return (
    <>
      <Head>
        <title>AssetBridge Nexus - RWA Platform</title>
        <meta name="description" content="Invest in tokenized private credit and real world assets" />
      </Head>

      {/* Hero Banner */}
      <HeroBanner
        title="Bridge Real Assets to DeFi"
        subtitle="Access institutional-grade private credit and RWA opportunities with transparent yields, secure on-chain settlements, and global liquidity."
        backgroundImage="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop"
        ctaText="Start Investing"
        ctaLink="/private-credit"
      />

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AssetBridge Nexus?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Combining traditional finance expertise with blockchain innovation to unlock real-world asset investing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔐',
                title: 'Secure & Transparent',
                description: 'Full on-chain transparency with blockchain-verified smart contracts and real-time settlement.',
              },
              {
                icon: '💰',
                title: 'High Yields',
                description: 'Access private credit deals with 8-15% APY, significantly higher than traditional savings.',
              },
              {
                icon: '🌍',
                title: 'Global Access',
                description: 'Invest from anywhere with low minimum investments starting from just $250.',
              },
              {
                icon: '⚡',
                title: 'Instant Liquidity',
                description: 'Secondary market access to trade positions and manage your portfolio dynamically.',
              },
              {
                icon: '🛡️',
                title: 'Built-in Safety',
                description: 'Insurance-backed protection, KYC verification, and professional risk management.',
              },
              {
                icon: '🎯',
                title: 'Diversified Portfolio',
                description: 'Spread risk across multiple asset classes and geography with a single account.',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Investment Opportunities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Carefully selected private credit deals with transparent terms and professional underwriting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredDeals.map((deal) => (
              <DealCard key={deal.id} {...deal} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/private-credit"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Explore All Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '$250M+', label: 'Assets Under Management' },
              { number: '5,000+', label: 'Active Investors' },
              { number: '$1.2B+', label: 'Deals Funded' },
              { number: '12.5%', label: 'Average APY' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Preview */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-2 border-yellow-400">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  🌟 Unlock Premium Features
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Access AI-powered analytics, exclusive deals, priority support, and advanced portfolio management tools.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                'AI Risk Analytics & Predictions',
                'Custom Portfolio Dashboard',
                'Exclusive Pre-IPO Deals',
                'Priority Customer Support',
                'Portfolio Insurance (3% APY)',
                'Advanced Trading Tools',
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-600">Just $49/month or $490/year (save 17%)</p>
              </div>
              <Link
                href="/premium"
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Explore Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Investing?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of investors accessing institutional-grade private credit and RWA opportunities.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/private-credit"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Browse Deals
            </Link>
            <Link
              href="/about"
              className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
