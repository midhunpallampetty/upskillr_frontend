import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import SchoolRoutes from './SchoolRoutes';
import MarketingPage from '../features/school/MarketingPage'; // Adjust import path

interface Props {
  subdomain: string | null;
}

const AppRouter: React.FC<Props> = ({ subdomain }) => {
  // Check for any dynamic subdomain (non-null and non-empty)
  if (subdomain && subdomain !== '') {
    return (
      <Routes>
        <Route path="/" element={<MarketingPage subdomain={subdomain} />} />
        {/* Optional: Fallback for other paths on subdomain */}
        <Route path="*" element={<SchoolRoutes />} /> {/* Or a 404/redirect */}
      </Routes>
    );
  }

  // Main domain (eduvia.space) uses PublicRoutes
  
  return (
    <Routes>
      <Route path="*" element={<PublicRoutes />} />
    </Routes>
  );
};

export default AppRouter;
