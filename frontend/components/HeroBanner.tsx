import React from 'react';
import Image from 'next/image';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  overlay?: boolean;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  ctaText = 'Get Started',
  ctaLink = '/dashboard',
  backgroundImage = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
  overlay = true,
}) => {
  return (
    <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image src={backgroundImage} alt="Hero background" fill className="object-cover" />
      </div>

      {/* Overlay */}
      {overlay && <div className="absolute inset-0 bg-black bg-opacity-50"></div>}

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4 md:px-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-slide-in-right">
            {subtitle}
          </p>
          <a
            href={ctaLink}
            className="inline-block bg-primary hover:shadow-lg text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
