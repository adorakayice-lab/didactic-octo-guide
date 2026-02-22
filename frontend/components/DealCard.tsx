import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DealCardProps {
  id: string;
  title: string;
  apy: number;
  term: number;
  minInvestment: number;
  currentRaised: number;
  targetAmount: number;
  status: 'open' | 'coming' | 'closed';
  description: string;
  image?: string;
}

const DealCard: React.FC<DealCardProps> = ({
  id,
  title,
  apy,
  term,
  minInvestment,
  currentRaised,
  targetAmount,
  status,
  description,
  image,
}) => {
  const progress = (currentRaised / targetAmount) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'coming':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:translate-y-1">
      {/* Card Image */}
      {image && (
        <div className="h-48 bg-gradient-primary overflow-hidden relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 flex-1">{title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* APY and Term */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Annual Yield</p>
            <p className="text-2xl font-bold text-primary">{apy}%</p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Term</p>
            <p className="text-2xl font-bold text-secondary">{term}M</p>
          </div>
        </div>

        {/* Min Investment */}
        <div className="mb-4">
          <p className="text-xs text-gray-600 mb-1">Minimum Investment</p>
          <p className="text-lg font-semibold text-gray-900">${minInvestment.toLocaleString()}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-gray-600">Funding Progress</p>
            <p className="text-xs font-semibold text-gray-900">{progress.toFixed(0)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            ${currentRaised.toLocaleString()} of ${targetAmount.toLocaleString()}
          </p>
        </div>

        {/* Action Button */}
        <Link
          href={`/private-credit/${id}`}
          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default DealCard;
