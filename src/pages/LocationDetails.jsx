import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LocationDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // If page is accessed directly without location state, show error state
  if (!state) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold font-serif text-stone-800 mb-4 tracking-tight">Location Not Found</h2>
            <p className="text-stone-600 mb-8">
              Please select a location from the map to view its details.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-orange-700 hover:bg-orange-800 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-sm"
            >
              ← Back to Map
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { lat, lng, name, lastVisited } = state;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow px-4 py-8 md:py-12 max-w-4xl mx-auto w-full">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center text-stone-500 hover:text-orange-700 font-medium mb-10 transition-colors text-sm"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> Back to Map
        </button>

        {/* Header Section */}
        <header className="mb-12 border-b border-stone-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-stone-800 mb-4 tracking-tight leading-tight">
            {name}
          </h1>
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm">
            <span className="text-stone-500 font-medium tracking-wide uppercase">
              Visited: <span className="text-stone-800 ml-1">{lastVisited}</span>
            </span>
            <span className="hidden md:inline text-stone-300">|</span>
            <span className="text-stone-500 font-medium tracking-wide uppercase">
              Lat: <span className="text-stone-800 font-mono ml-1">{lat.toFixed(4)}</span>
            </span>
            <span className="text-stone-500 font-medium tracking-wide uppercase">
              Lng: <span className="text-stone-800 font-mono ml-1">{lng.toFixed(4)}</span>
            </span>
          </div>
        </header>

        <div className="space-y-16">
          {/* Description Section */}
          <section>
            <h2 className="text-2xl font-bold font-serif text-stone-800 mb-4 tracking-tight">About this place</h2>
            <p className="text-stone-600 leading-relaxed max-w-3xl text-lg">
              Explore the memories and experiences from this place. This is a temporary description placeholder that will later be replaced by data stored in your MongoDB database when you connect the backend.
            </p>
          </section>

          {/* Memories Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-serif text-stone-800 tracking-tight">Journal Entries</h2>
              <button 
                onClick={() => alert("Memory functionality will be added later when MongoDB is connected!")}
                className="bg-orange-700 hover:bg-orange-800 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow flex items-center gap-2"
              >
                <span>+</span> Write a Memory
              </button>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-stone-100 shadow-sm px-4">
              <div className="bg-[#faf9f6] p-4 rounded-full mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">No entries yet</h3>
              <p className="text-stone-500 max-w-sm mb-6">
                Start adding memories from {name} to build your travel journal.
              </p>
              <button 
                onClick={() => alert("Memory functionality will be added later when MongoDB is connected!")}
                className="text-orange-700 hover:text-orange-800 font-medium transition-colors border-b border-orange-200 hover:border-orange-800 pb-0.5"
              >
                Write your first memory
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LocationDetails;
