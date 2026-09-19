import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LocationDetails from './pages/LocationDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* TEMPORARY: This route uses generic navigation state for now. 
            When MongoDB is added, this should be updated to /location/:locationId */}
        <Route path="/location/details" element={<LocationDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
