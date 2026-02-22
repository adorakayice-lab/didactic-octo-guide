/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Head from 'next/head';
import PremiumBadge from '@/components/PremiumBadge';

export default function Premium() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      description: 'Get started with basic features',
      features: [
        'Browse public deals',
        'Basic portfolio tracking',
        'Email support',
        'Limited to 5 deals',
        'Standard 1-2% fees',
      ],
      cta: 'Current Plan',
      isPrimary: false,
    },
    {
      name: 'Premium',
      price: '49',
      period: 'month',
      description: 'Unlock advanced tools and exclusive deals',
      features: [
        'All Free features',
        'Advanced AI analytics',
        'Exclusive pre-IPO deals',
        'Custom risk dashboard',
        'Priority 24/7 support',
        'Unlimited deals',
        'Reduced fees (0.5-1%)',
        'Portfolio insurance',
        'Early access to launches',
        'Quarterly strategy calls',
      ],
      cta: 'Upgrade Now',
      isPrimary: true,
    },
    {
      name: 'Premium+',
      price: '99',
      period: 'month',
      description: 'For serious institutional investors',
      features: [
        'All Premium features',
        'Dedicated account manager',
        'Custom investment strategies',
        'Bulk investment discounts',
        'White-label solutions',
        'API access',
        'Advanced reporting',
        'Tax optimization tools',
        'Custom alerts & webhooks',
        'Quarterly advisory board meeting',
      ],
      cta: 'Contact Sales',
      isPrimary: false,
    },
  ];

  const annualSavings = 49 * 12 * 0.17; // 17% discount

  return (
    <>
      <Head>
        <title>Premium - AssetBridge Nexus</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Upgrade to Premium</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Unlock AI-powered analytics, exclusive deals, and advanced portfolio management tools.
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Billing Toggle */}
          <div className="flex justify-center items-center mb-12">
            <span className="text-gray-600 font-medium">Monthly</span>
            <button className="mx-4 bg-primary text-white px-6 py-2 rounded-full font-semibold">
              Annual Billing
            </button>
            <span className="text-gray-600 font-medium">
              Save ${Math.round(annualSavings)}/year
            </span>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden transition-all ${
                  plan.isPrimary
                    ? 'bg-white shadow-2xl transform scale-105 border-2 border-primary'
                    : 'bg-white shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Plan Header */}
                <div className={`p-8 ${plan.isPrimary ? 'bg-gradient-primary text-white' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    {plan.isPrimary && <PremiumBadge size="medium" />}
                  </div>
                  <p className={`text-sm ${plan.isPrimary ? 'text-blue-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="px-8 py-6 border-b border-gray-200">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    {plan.price !== '0' && (
                      <span className={`text-sm font-medium ml-2 ${
                        plan.isPrimary ? 'text-primary' : 'text-gray-600'
                      }`}>
                        per {plan.period}
                      </span>
                    )}
                  </div>
                  {plan.name !== 'Free' && (
                    <p className="text-xs text-gray-600 mt-2">
                      Or ${(parseFloat(plan.price) * 12 * 0.83).toFixed(0)}/year (save 17%)
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <div className="px-8 py-6">
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all mb-6 ${
                      plan.isPrimary
                        ? 'bg-primary text-white hover:shadow-lg'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>

                {/* Features */}
                <div className="px-8 pb-8">
                  <p className="text-sm font-semibold text-gray-900 mb-4">What's Included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Feature Comparison</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-gray-900">Free</th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-primary">Premium</th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-gray-900">Premium+</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Deal Filtering', free: true, premium: true, premiumPlus: true },
                    { feature: 'Portfolio Tracking', free: true, premium: true, premiumPlus: true },
                    { feature: 'AI Risk Analytics', free: false, premium: true, premiumPlus: true },
                    { feature: 'Exclusive Deals', free: false, premium: true, premiumPlus: true },
                    { feature: 'Custom Dashboard', free: false, premium: true, premiumPlus: true },
                    { feature: 'Priority Support', free: false, premium: true, premiumPlus: true },
                    { feature: 'Dedicated Manager', free: false, premium: false, premiumPlus: true },
                    { feature: 'API Access', free: false, premium: false, premiumPlus: true },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-8 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                      <td className="px-8 py-4 text-center">
                        {row.free ? (
                          <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-8 py-4 text-center">
                        {row.premium ? (
                          <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-8 py-4 text-center">
                        {row.premiumPlus ? (
                          <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  question: 'Can I cancel anytime?',
                  answer: 'Yes, you can cancel your subscription at any time with no penalties or lock-in periods.',
                },
                {
                  question: 'Is there a free trial?',
                  answer: 'We offer a 14-day free trial of Premium so you can experience all features risk-free.',
                },
                {
                  question: 'How secure is my data?',
                  answer: 'We use bank-level encryption and comply with international data protection standards.',
                },
                {
                  question: 'Do you offer team discounts?',
                  answer: 'Yes! Teams of 10+ get special pricing. Contact our sales team for details.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
