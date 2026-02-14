'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#080805]/80 border-b border-[#ffd700]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <img
                src="logo.png"
                alt="Solvify Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-white to-[#ffd700] bg-clip-text text-transparent">
                Solvify
              </span>
            </div>

            {/* Center Text - Byte Battle 3.0 */}
            <div className="hidden md:block">
              <h2 className="text-3xl font-black bg-linear-to-r from-[#ffd700] via-yellow-300 to-[#ffd700] bg-clip-text text-transparent animate-gradient bg-size-[200%_100%]">
                Byte Battle 3.0
              </h2>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="px-5 py-2 text-sm font-medium text-white hover:text-[#ffd700] transition-colors duration-300">
                Sign In
              </button>
              <button className="relative px-6 py-2.5 text-sm font-bold text-[#080805] bg-[#ffd700] overflow-hidden group">
                <span className="relative z-10 group-hover:text-[#080805]">Sign Up</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
            >
              <span className={`w-6 h-0.5 bg-[#ffd700] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-[#ffd700] transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-[#ffd700] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="py-4 space-y-4 border-t border-[#ffd700]/10">
              <div className="text-center">
                <h2 className="text-2xl font-black bg-linear-to-r from-[#ffd700] via-yellow-300 to-[#ffd700] bg-clip-text text-transparent animate-gradient bg-size-[200%_100%]">
                  Byte Battle 3.0
                </h2>
              </div>
              <div className="pt-4 space-y-3 border-t border-[#ffd700]/10">
                <button className="w-full px-5 py-2 text-sm font-medium text-white hover:text-[#ffd700] transition-colors duration-300 text-left">
                  Sign In
                </button>
                <button className="w-full px-6 py-2.5 text-sm font-bold text-[#080805] bg-[#ffd700] hover:bg-white transition-colors duration-300">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}