import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import SchoolRoutes from './SchoolRoutes';
import MarketingPage from '../features/school/MarketingPage';

interface Props {
  subdomain: string | null;
}

const AppRouter: React.FC<Props> = ({ subdomain }) => {
  if (subdomain && subdomain !== '') {
    return (
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        {/* Optional: Fallback for other paths on subdomain */}
      </Routes>
    );
  }

  // Main domain (eduvia.space) uses PublicRoutes
  return (
    <Routes>
      <Route path="*" element={<SchoolRoutes />} /> {/* Or a 404/redirect */}

      <Route path="*" element={<PublicRoutes />} />
    </Routes>
  );
};

export default AppRouter;
