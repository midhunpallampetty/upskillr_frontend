// src/routes/AppRouter.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import SchoolRoutes from './SchoolRoutes';
import MarketingPage from '../features/school/MarketingPage';


interface Props {
  subdomain: string | null;               // still received from <App />
}

const AppRouter: React.FC<Props> = ({ subdomain }) => {
  // If you prefer, detect again here instead of relying on the prop:
  // const subdomain = getDynamicSubdomain();

  if (subdomain && subdomain !== '') {
    return (
      <Routes>
        {/* render MarketingPage WITHOUT props */}
        <Route path="/" element={<MarketingPage />} />

        {/* optional fallback for any other path on the same sub-domain */}
        <Route path="*" element={<SchoolRoutes />} />
      </Routes>
    );
  }

  /* main domain (eduvia.space / localhost) */
  return (
    <Routes>
      <Route path="*" element={<PublicRoutes />} />
    </Routes>
  );
};

export default AppRouter;
