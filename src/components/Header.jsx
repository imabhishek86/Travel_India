import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#faf9f6] border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold font-serif text-stone-800 tracking-tight">
              TravelMap India
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10 items-center">
            <a href="#" className="text-stone-600 hover:text-orange-700 transition-colors font-medium text-sm">Home</a>
            <a href="#" className="text-stone-600 hover:text-orange-700 transition-colors font-medium text-sm">My Travels</a>
            <a href="#" className="text-stone-600 hover:text-orange-700 transition-colors font-medium text-sm">About</a>
            <button className="bg-orange-700 hover:bg-orange-800 text-white px-5 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow">
              Add Memory
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-stone-600 hover:text-orange-700 focus:outline-none transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#faf9f6] border-t border-stone-200 px-4 pt-2 pb-4 space-y-1 shadow-lg absolute w-full">
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-orange-700 hover:bg-orange-50 transition-colors">Home</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-orange-700 hover:bg-orange-50 transition-colors">My Travels</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-orange-700 hover:bg-orange-50 transition-colors">About</a>
          <div className="px-3 py-3">
            <button className="w-full bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm">
              Add Memory
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
