/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function About() {
  const teamMembers = [
    {
      name: 'Adanna Okafor',
      role: 'CEO & Co-Founder',
      bio: 'Former investment banker with 12 years of experience in emerging market finance.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      name: 'Chisom Ezeoke',
      role: 'CTO & Co-Founder',
      bio: 'Blockchain engineer with expertise in smart contract development and DeFi protocols.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      name: 'Kofi Mensah',
      role: 'Head of Operations',
      bio: 'Operations specialist managing institutional partnerships and regulatory compliance.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    },
    {
      name: 'Aisha Mohammed',
      role: 'Head of Risk',
      bio: 'Risk management expert with experience at major investment firms across Africa.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
  ];

  const testimonials = [
    {
      quote:
        'AssetBridge Nexus has helped me diversify my portfolio with high-quality alternative assets. The transparency and returns are unmatched.',
      author: 'Eniola Adeyemi',
      role: 'Investor, Lagos',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
      quote:
        'Finally, a platform that bridges traditional finance and blockchain without compromising security. Highly recommended for serious investors.',
      author: 'Kwesi Owusu',
      role: 'Institutional Investor, Accra',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      quote:
        'The premium features and AI analytics have given me a significant edge. Worth every penny for serious portfolio managers.',
      author: 'Zainab Hassan',
      role: 'Portfolio Manager, Nairobi',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
  ];

  return (
    <>
      <Head>
        <title>About Us - AssetBridge Nexus</title>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Mission Section */}
        <section className="py-16 md:py-24 bg-gradient-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">About AssetBridge Nexus</h1>
              <p className="text-xl text-blue-100 mb-6">
                We're building the bridge between traditional real-world assets and decentralized finance, making institutional-grade investments accessible to everyone.
              </p>
              <div className="grid grid-cols-3 gap-8 mt-12">
                {[
                  { number: '2021', label: 'Founded' },
                  { number: '4+', label: 'Years Experience' },
                  { number: '50+', label: 'Team Members' },
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold mb-2">{stat.number}</div>
                    <div className="text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">Our Core Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🎯',
                  title: 'Transparency',
                  description: 'Every deal, fee, and transaction is publicly verifiable on the blockchain.',
                },
                {
                  icon: '🛡️',
                  title: 'Security',
                  description: 'Bank-level security with smart contract audits and insurance protection.',
                },
                {
                  icon: '🌍',
                  title: 'Accessibility',
                  description: 'Democratizing access to premium investments across emerging markets.',
                },
                {
                  icon: '📈',
                  title: 'Excellence',
                  description: 'Delivering institutional-grade returns with professional underwriting.',
                },
                {
                  icon: '🤝',
                  title: 'Community',
                  description: 'Building a global community of responsible, informed investors.',
                },
                {
                  icon: '⚡',
                  title: 'Innovation',
                  description: 'Continuously evolving with cutting-edge blockchain and fintech solutions.',
                },
              ].map((value, index) => (
                <div key={index} className="text-center p-8 hover:shadow-lg rounded-xl transition-all">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">Meet Our Leadership</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center hover:shadow-lg rounded-xl overflow-hidden transition-all">
                      <div className="relative h-64 overflow-hidden bg-gray-300">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                    <p className="text-primary font-semibold text-sm mt-1">{member.role}</p>
                    <p className="text-gray-600 text-sm mt-3">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">What Investors Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gradient-primary text-white p-8 rounded-xl shadow-lg">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-300">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image src={testimonial.image} alt={testimonial.author} width={48} height={48} className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-blue-100 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press & Awards */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">Recognition & Press</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { icon: '🏆', title: 'Best RWA Platform 2024', publication: 'Crypto Awards' },
                {
                  icon: '📰',
                  title: 'Global Fintech Innovation',
                  publication: 'Tech Crunch Africa',
                },
                { icon: '⭐', title: 'Top 10 African Startups', publication: 'Forbes Africa' },
              ].map((award, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="text-5xl mb-4">{award.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{award.title}</h3>
                  <p className="text-gray-600">{award.publication}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-primary text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the AssetBridge Community</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Become part of a growing community of savvy investors bridging real-world assets to DeFi.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Start Investing
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all">
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
