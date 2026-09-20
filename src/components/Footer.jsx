import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#faf9f6] border-t border-stone-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold font-serif text-stone-800 tracking-tight">
              TravelMap India
            </h3>
            <p className="mt-1 text-stone-500 text-sm">
              Your memories, mapped across India.
            </p>
          </div>
          
          <div className="flex space-x-8 text-sm font-medium text-stone-600">
            <a href="#" className="hover:text-orange-700 transition-colors">About</a>
            <a href="#" className="hover:text-orange-700 transition-colors">Contact</a>
            <a href="#" className="hover:text-orange-700 transition-colors">Privacy Policy</a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 text-center text-xs text-stone-400">
          &copy; {new Date().getFullYear()} TravelMap India. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
