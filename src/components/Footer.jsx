import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              TravelMap India
            </h3>
            <p className="mt-2 text-slate-400 text-sm">
              Your memories, mapped across India.
            </p>
          </div>
          
          <div className="flex space-x-6 text-sm text-slate-300">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} TravelMap India. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
