import React from 'react';
import Header from '../components/Header';
import Map from '../components/Map';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Main Map Section - Full width and calculated height */}
      <main className="w-full relative h-[calc(100vh-64px)]">
        <Map />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
