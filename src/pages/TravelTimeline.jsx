import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DEFAULT_DEMO_LOCATIONS, parseVisitDate } from '../data/locations';

const TravelTimeline = () => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Load locations from the single existing source of truth (localStorage or DEFAULT_DEMO_LOCATIONS)
  const [locations] = useState(() => {
    try {
      const savedLocations = localStorage.getItem('travelMapLocations');
      if (savedLocations) {
        const parsed = JSON.parse(savedLocations);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error reading travelMapLocations from localStorage:', error);
    }
    return DEFAULT_DEMO_LOCATIONS;
  });

  // Separate valid dated locations and undated locations without mutating the original array
  const { datedLocations, undatedLocations } = useMemo(() => {
    const dated = [];
    const undated = [];

    locations.forEach((loc) => {
      const parsed = parseVisitDate(loc.lastVisited);
      if (parsed) {
        dated.push({ ...loc, _parsedDate: parsed });
      } else {
        undated.push(loc);
      }
    });

    return { datedLocations: dated, undatedLocations: undated };
  }, [locations]);

  // Group valid dated locations by year and sort chronologically
  const groupedByYear = useMemo(() => {
    const yearMap = new Map();

    datedLocations.forEach((loc) => {
      const y = loc._parsedDate.year;
      if (!yearMap.has(y)) {
        yearMap.set(y, []);
      }
      yearMap.get(y).push(loc);
    });

    // Sort locations inside each year based on visit date
    for (const [, locs] of yearMap.entries()) {
      locs.sort((a, b) => {
        if (sortOrder === 'newest') {
          return b._parsedDate.timestamp - a._parsedDate.timestamp;
        }
        return a._parsedDate.timestamp - b._parsedDate.timestamp;
      });
    }

    // Sort years list
    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => {
      return sortOrder === 'newest' ? b - a : a - b;
    });

    return sortedYears.map((year) => ({
      year,
      locations: yearMap.get(year)
    }));
  }, [datedLocations, sortOrder]);

  // Navigate back to the map with the selected location active
  const handleViewOnMap = (loc) => {
    try {
      localStorage.setItem('travelMapSelectedLocation', JSON.stringify(loc));
    } catch (err) {
      console.error('Error saving travelMapSelectedLocation:', err);
    }

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'view_on_map',
        location_name: loc.name
      });
    }

    navigate('/', { state: { selectedLocation: loc } });
  };

  // Navigate to existing location details page
  const handleViewDetails = (loc) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'view_location',
        location_name: loc.name
      });
    }

    navigate('/location/details', { state: loc });
  };

  const totalPlaces = locations.length;
  const recordedPlaces = datedLocations.length;

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6]">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 w-full">
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
        <header className="mb-8 md:mb-12 border-b border-stone-200 pb-6 md:pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-orange-700 text-xs font-bold uppercase tracking-widest block mb-1">
                Travel Journal
              </span>
              <h1 className="text-3xl md:text-5xl font-bold font-serif text-stone-800 tracking-tight leading-tight">
                My Travel Journey
              </h1>
              <p className="text-stone-600 mt-2 text-sm md:text-base max-w-2xl">
                A visual chronological timeline of places I have visited.
              </p>
            </div>

            {/* Sort Control */}
            {locations.length > 0 && (
              <div className="flex items-center gap-2 self-start md:self-auto bg-white border border-stone-200 rounded-lg px-3 py-1.5 shadow-2xs">
                <label
                  htmlFor="timeline-sort"
                  className="text-xs font-semibold text-stone-500 uppercase tracking-wider cursor-pointer"
                >
                  Sort:
                </label>
                <select
                  id="timeline-sort"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-stone-800 outline-none cursor-pointer pr-1"
                  aria-label="Sort timeline locations"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          {locations.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 text-xs text-stone-500 font-medium">
              <span>
                Total Places: <strong className="text-stone-800">{totalPlaces}</strong>
              </span>
              <span className="text-stone-300">•</span>
              <span>
                Dated Entries: <strong className="text-stone-800">{recordedPlaces}</strong>
              </span>
              {undatedLocations.length > 0 && (
                <>
                  <span className="text-stone-300">•</span>
                  <span>
                    Undated: <strong className="text-stone-800">{undatedLocations.length}</strong>
                  </span>
                </>
              )}
            </div>
          )}
        </header>

        {/* Empty State */}
        {locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl mb-4 text-orange-700">
              📍
            </div>
            <h2 className="text-xl font-bold font-serif text-stone-800 mb-2">
              No travel locations yet.
            </h2>
            <p className="text-stone-600 text-sm max-w-sm mb-6">
              Start exploring India and your visited places will appear here.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-orange-700 hover:bg-orange-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow cursor-pointer"
            >
              Explore Map
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Chronological Year Groups */}
            {groupedByYear.map(({ year, locations: yearLocs }) => (
              <section key={year} aria-labelledby={`year-heading-${year}`}>
                {/* Year Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span
                    id={`year-heading-${year}`}
                    className="font-serif font-bold text-2xl md:text-3xl text-stone-800 tracking-tight"
                  >
                    {year}
                  </span>
                  <div className="h-px flex-1 bg-stone-200" />
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    {yearLocs.length} {yearLocs.length === 1 ? 'place' : 'places'}
                  </span>
                </div>

                {/* Vertical Timeline Track */}
                <div className="relative pl-6 sm:pl-8 border-l-2 border-orange-200 space-y-6 ml-3 sm:ml-4">
                  {yearLocs.map((loc) => {
                    const key = loc.id || `${loc.lat}-${loc.lng}-${loc.name}`;
                    return (
                      <article
                        key={key}
                        className="relative group"
                        aria-label={`${loc.name}, visited ${loc.lastVisited || 'Date not recorded'}`}
                      >
                        {/* Timeline Node Bullet */}
                        <span
                          className="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full bg-orange-600 border-4 border-[#faf9f6] shadow-2xs group-hover:scale-125 group-hover:bg-orange-700 transition-all"
                          aria-hidden="true"
                        />

                        {/* Location Card */}
                        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col gap-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-bold font-serif text-stone-800 tracking-tight leading-snug">
                                {loc.name}
                              </h3>
                              {loc.stateName && (
                                <p className="text-xs font-medium text-stone-500 mt-0.5">
                                  {loc.stateName}
                                </p>
                              )}
                            </div>

                            {loc.stateName && (
                              <span className="bg-stone-100 text-stone-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-stone-200/60 shrink-0">
                                {loc.stateName}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-stone-600 font-medium flex items-center gap-1.5">
                            <span className="text-stone-400">📅</span>
                            <span>Visited: <strong className="text-stone-800">{loc.lastVisited}</strong></span>
                          </div>

                          {/* Short Description if available */}
                          {loc.description && (
                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-2">
                              {loc.description}
                            </p>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100">
                            <button
                              type="button"
                              onClick={() => handleViewOnMap(loc)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 rounded-lg transition-colors cursor-pointer"
                              aria-label={`View ${loc.name} on map`}
                            >
                              <span>📍</span>
                              <span>View on Map</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleViewDetails(loc)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-orange-700 hover:bg-orange-800 rounded-lg transition-colors shadow-2xs hover:shadow-xs cursor-pointer"
                              aria-label={`View details for ${loc.name}`}
                            >
                              <span>View Details</span>
                              <span>→</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Separate Section for Locations without Recorded Dates */}
            {undatedLocations.length > 0 && (
              <section className="mt-12 pt-8 border-t border-stone-200" aria-labelledby="undated-heading">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    id="undated-heading"
                    className="font-serif font-bold text-xl md:text-2xl text-stone-700 tracking-tight"
                  >
                    Date not recorded
                  </span>
                  <div className="h-px flex-1 bg-stone-200" />
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    {undatedLocations.length} {undatedLocations.length === 1 ? 'place' : 'places'}
                  </span>
                </div>

                <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-300 space-y-6 ml-3 sm:ml-4">
                  {undatedLocations.map((loc) => {
                    const key = loc.id || `${loc.lat}-${loc.lng}-${loc.name}`;
                    return (
                      <article
                        key={key}
                        className="relative group"
                        aria-label={`${loc.name}, date not recorded`}
                      >
                        {/* Timeline Node Bullet */}
                        <span
                          className="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full bg-stone-400 border-4 border-[#faf9f6] shadow-2xs group-hover:scale-125 group-hover:bg-stone-600 transition-all"
                          aria-hidden="true"
                        />

                        {/* Location Card */}
                        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col gap-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-bold font-serif text-stone-800 tracking-tight leading-snug">
                                {loc.name}
                              </h3>
                              {loc.stateName && (
                                <p className="text-xs font-medium text-stone-500 mt-0.5">
                                  {loc.stateName}
                                </p>
                              )}
                            </div>

                            {loc.stateName && (
                              <span className="bg-stone-100 text-stone-600 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-stone-200/60 shrink-0">
                                {loc.stateName}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-stone-400 italic">
                            Date not recorded
                          </div>

                          {/* Short Description if available */}
                          {loc.description && (
                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-2">
                              {loc.description}
                            </p>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100">
                            <button
                              type="button"
                              onClick={() => handleViewOnMap(loc)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 rounded-lg transition-colors cursor-pointer"
                              aria-label={`View ${loc.name} on map`}
                            >
                              <span>📍</span>
                              <span>View on Map</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleViewDetails(loc)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-orange-700 hover:bg-orange-800 rounded-lg transition-colors shadow-2xs hover:shadow-xs cursor-pointer"
                              aria-label={`View details for ${loc.name}`}
                            >
                              <span>View Details</span>
                              <span>→</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TravelTimeline;
