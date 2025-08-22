// src/routes/AppRouter.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import SchoolRoutes from './SchoolRoutes';
import MarketingPage from '../features/school/MarketingPage';
import { getDynamicSubdomain } from '../utils/getSubdomain'; // new import

const AppRouter: React.FC = () => {
  // Detect sub-domain locally; no prop required
  const subdomain: string | null = getDynamicSubdomain();

  if (subdomain) {
    return (
      <Routes>
        {/* Marketing page as the default on any sub-domain */}
        <Route path="/" element={<MarketingPage subdomain={subdomain} />} />

        {/* Optional: fall-back for other routes on the same sub-domain */}
        <Route path="*" element={<SchoolRoutes />} />
      </Routes>
    );
  }

  /* Main domain (eduvia.space / localhost) */
  return (
    <Routes>
      <Route path="*" element={<PublicRoutes />} />
    </Routes>
  );
};

export default AppRouter;
