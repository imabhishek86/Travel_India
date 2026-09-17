import React from 'react';
import Header from '../components/Header';
import Map from '../components/Map';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Main Map Section - Takes remaining height */}
      <main className="flex-grow p-4 md:p-6 bg-slate-50 flex flex-col">
        <div className="flex-grow min-h-[70vh] relative rounded-xl overflow-hidden shadow-lg border border-slate-200">
          <Map />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
