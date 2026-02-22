import React from 'react';
import Head from 'next/head';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  

  const portfolioData = [
    { month: 'Jan', value: 10000, earned: 150 },
    { month: 'Feb', value: 12000, earned: 180 },
    { month: 'Mar', value: 13500, earned: 202 },
    { month: 'Apr', value: 15000, earned: 225 },
    { month: 'May', value: 17000, earned: 255 },
    { month: 'Jun', value: 19000, earned: 285 },
  ];

  const allocationData = [
    { name: 'Tech Startups', value: 35, color: '#0070f3' },
    { name: 'Real Estate', value: 40, color: '#4f46e5' },
    { name: 'Agriculture', value: 20, color: '#10b981' },
    { name: 'Other', value: 5, color: '#f59e0b' },
  ];

  return (
    <>
      <Head>
        <title>Dashboard - AssetBridge Nexus</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your Portfolio</h1>
            <p className="text-gray-600 mt-2">Track your investments and earnings in real-time</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Total Invested',
                value: '$19,000',
                change: '+$9,000 this month',
                icon: '💰',
              },
              {
                label: 'Total Earned',
                value: '$1,297',
                change: '+$30 this month',
                icon: '📈',
              },
              {
                label: 'Active Deals',
                value: '3',
                change: '2 pending',
                icon: '🎯',
              },
              {
                label: 'Avg. Return',
                value: '10.8%',
                change: 'YTD performance',
                icon: '📊',
              },
            ].map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{metric.icon}</span>
                </div>
                <p className="text-gray-600 text-sm">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-sm text-gray-500 mt-2">{metric.change}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Portfolio Value Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Portfolio Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#0070f3" strokeWidth={2} />
                  <Line type="monotone" dataKey="earned" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Asset Allocation Pie */}
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Asset Allocation</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {allocationData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Investments */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Active Investments</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Deal</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">APY</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      deal: 'Tech Startup Series A',
                      amount: '$5,000',
                      apy: 12,
                      status: 'Active',
                      earned: '$300',
                    },
                    {
                      deal: 'Real Estate Development',
                      amount: '$8,000',
                      apy: 10,
                      status: 'Active',
                      earned: '$400',
                    },
                    {
                      deal: 'Agriculture Infrastructure',
                      amount: '$3,500',
                      apy: 8,
                      status: 'Matured',
                      earned: '$140',
                    },
                  ].map((investment, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{investment.deal}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{investment.amount}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary">{investment.apy}%</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            investment.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {investment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{investment.earned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
