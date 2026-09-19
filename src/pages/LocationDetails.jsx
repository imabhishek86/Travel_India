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
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 text-center max-w-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Location Not Found</h2>
            <p className="text-slate-600 mb-6">
              Please select a location from the map to view its details.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
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
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      
      <main className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-blue-600 font-medium mb-6 transition-colors"
        >
          <span className="mr-2">←</span> Back to Map
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Location Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="text-red-500">📍</span>
                  {name}
                </h1>
              </div>
              <div className="text-slate-500 font-medium flex items-center gap-2 mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Last visited: <span className="text-slate-700">{lastVisited}</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Description</h2>
              {/* TEMPORARY: Placeholder text. Later will be fetched from MongoDB */}
              <p className="text-slate-600 leading-relaxed">
                Explore the memories and experiences from this place. This is a temporary description placeholder that will later be replaced by data stored in your MongoDB database when you connect the backend.
              </p>
            </div>

            {/* Memories Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-6">
                <h2 className="text-xl font-bold text-slate-800">Memories</h2>
                {/* TEMPORARY: Placeholder button. Does not save to MongoDB yet */}
                <button 
                  onClick={() => alert("Memory functionality will be added later when MongoDB is connected!")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-1"
                >
                  <span className="text-lg leading-none">+</span> Add Memory
                </button>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">No memories added yet.</h3>
                <p className="text-slate-500 max-w-sm">
                  Start adding memories from this place to build your travel journal.
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Location Info</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Name</p>
                  <p className="text-slate-800 font-medium">{name}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Coordinates</p>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between bg-slate-50 px-3 py-1.5 rounded text-sm">
                      <span className="text-slate-500">Lat:</span>
                      <span className="text-slate-700 font-mono">{lat.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between bg-slate-50 px-3 py-1.5 rounded text-sm">
                      <span className="text-slate-500">Lng:</span>
                      <span className="text-slate-700 font-mono">{lng.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LocationDetails;
