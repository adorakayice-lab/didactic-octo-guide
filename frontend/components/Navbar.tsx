import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    chainId: null,
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if wallet is already connected
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (!window.ethereum) {
        console.log('MetaMask not installed');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        const network = await provider.getNetwork();

        setWallet({
          isConnected: true,
          address,
          balance: ethers.formatEther(balance),
          chainId: Number(network.chainId),
        });
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  };

  const connectWallet = async () => {
    try {
      setError(null);

      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install it to continue.');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        setError('No accounts found. Please connect your wallet.');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      setWallet({
        isConnected: true,
        address,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
      });

      // Log connection for verification
      console.log('✅ Wallet connected:', { address, chainId: network.chainId });
    } catch (err: unknown) {
      const e = err as Error;
      const errorMessage = e?.message || 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Error connecting wallet:', err);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      balance: null,
      chainId: null,
    });
    setError(null);
  };

  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/private-credit', label: 'Private Credit' },
    { href: '/vault', label: 'Vault' },
    { href: '/premium', label: 'Premium' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Ξ</span>
              </div>
              <span className="hidden md:inline text-xl font-bold text-gradient">AssetBridge</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  router.pathname === link.href
                    ? 'text-primary font-semibold'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {wallet.isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full inline-block"></span>
                  <span className="text-sm font-semibold">{formatAddress(wallet.address)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                  title={`Balance: ${wallet.balance} ETH | Chain: ${wallet.chainId}`}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-primary hover:shadow-lg text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>Connect Wallet</span>
              </button>
            )}
            <Link
              href="/login"
              className="text-primary border-2 border-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
            >
              Login
            </Link>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="absolute right-4 top-20 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-xs">
              <p className="text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-700 font-bold text-lg"
              >
                ×
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-gray-600 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-4 border-t border-gray-200 space-y-2">
              {wallet.isConnected ? (
                <>
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-center mb-2">
                    <p className="text-xs font-semibold text-green-600">Connected</p>
                    <p className="text-sm font-bold">{formatAddress(wallet.address)}</p>
                    <p className="text-xs text-green-700">{wallet.balance} ETH</p>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all"
                  >
                    Disconnect Wallet
                  </button>
                </>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Connect Wallet
                </button>
              )}
              <Link
                href="/login"
                className="block w-full text-center text-primary border-2 border-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
