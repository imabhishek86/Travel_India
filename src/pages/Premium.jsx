import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FREE_FEATURES = [
  'India travel map',
  'Location search',
  'Travel timeline',
  'Basic location journal',
  'Basic travel statistics',
];

const PLUS_FEATURES = [
  'Unlimited travel memories',
  'Advanced travel statistics',
  'Premium journal experience',
  'Photo gallery',
  'Custom travel themes',
  'More features coming soon',
];

const Premium = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowDemoModal(false);
      }
    };

    if (showDemoModal) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDemoModal]);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6]">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-orange-700 transition-colors group"
          >
            <span className="mr-1.5 transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Map
          </Link>
        </div>

        {/* Page Header */}
        <header className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="text-orange-700 text-xs font-bold uppercase tracking-widest block mb-2">
            Journal Membership
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-stone-800 tracking-tight leading-tight">
            TravelMap Plus
          </h1>
          <p className="text-stone-600 mt-3 text-base sm:text-lg leading-relaxed">
            Unlock more ways to preserve and explore your travel memories.
          </p>
        </header>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* FREE PLAN */}
          <section
            aria-labelledby="plan-free-title"
            className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-stone-300 transition-all"
          >
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <h2
                  id="plan-free-title"
                  className="text-xl sm:text-2xl font-bold font-serif text-stone-800 tracking-tight"
                >
                  Free
                </h2>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Standard
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl sm:text-5xl font-bold font-serif text-stone-800">
                  ₹0
                </span>
                <span className="text-sm text-stone-500 font-medium">/ forever</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                Essential tools to document your personal journey across India.
              </p>

              <div className="border-t border-stone-100 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
                  Included Features
                </h3>
                <ul className="space-y-3">
                  {FREE_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-stone-700">
                      <svg
                        className="w-5 h-5 text-stone-500 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-full py-3 px-4 rounded-xl font-medium text-sm text-stone-400 bg-stone-100 border border-stone-200 cursor-not-allowed select-none text-center"
              >
                Current Plan
              </button>
            </div>
          </section>

          {/* TRAVELMAP PLUS PLAN */}
          <section
            aria-labelledby="plan-plus-title"
            className="relative bg-white border-2 border-orange-600 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-md hover:shadow-lg transition-all"
          >
            {/* Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-700 text-white text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
              Most Popular
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-4">
                <h2
                  id="plan-plus-title"
                  className="text-xl sm:text-2xl font-bold font-serif text-stone-800 tracking-tight"
                >
                  TravelMap Plus
                </h2>
                <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200 uppercase tracking-wider">
                  Premium
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl sm:text-5xl font-bold font-serif text-stone-800">
                  ₹99
                </span>
                <span className="text-sm text-stone-600 font-medium">/ month</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                Preserve every journey beautifully with unlimited entries and themes.
              </p>

              <div className="border-t border-stone-100 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-orange-800 mb-4">
                  Everything in Free, plus
                </h3>
                <ul className="space-y-3">
                  {PLUS_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-stone-800 font-medium">
                      <svg
                        className="w-5 h-5 text-orange-600 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => setShowDemoModal(true)}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-orange-700 hover:bg-orange-800 active:bg-orange-900 transition-all shadow-sm hover:shadow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                aria-label="Upgrade to Plus"
              >
                Upgrade to Plus
              </button>
            </div>
          </section>
        </div>

        {/* Travel Note */}
        <div className="mt-12 text-center text-xs text-stone-500 max-w-md mx-auto">
          Crafted for travelers who want to cherish every mile, monument, and memory across India.
        </div>
      </main>

      {/* Temporary Demo Modal */}
      {showDemoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs"
          onClick={() => setShowDemoModal(false)}
        >
          <div
            className="bg-[#faf9f6] border border-stone-300 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:outline-none cursor-pointer"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-xl mb-4 text-orange-700">
              ✨
            </div>

            <h3
              id="demo-modal-title"
              className="text-xl font-bold font-serif text-stone-800 mb-2 tracking-tight"
            >
              Demo Checkout
            </h3>

            <p className="text-base text-stone-700 font-medium mb-2">
              Demo checkout will open here.
            </p>

            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mb-6">
              This is a frontend demonstration for TravelMap Plus. Real payment processing via Razorpay will be added in a future update.
            </p>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowDemoModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:outline-none"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Premium;
