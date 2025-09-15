import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import MarketingPage from '../features/school/MarketingPage';

interface Props {
  subdomain: string | null;
}

const AppRouter: React.FC<Props> = ({ subdomain }) => {
  return (
    <Routes>
      {/* Specific root route - must come BEFORE wildcard */}
      <Route 
        path="/" 
        element={subdomain ? <MarketingPage /> : <PublicRoutes subdomain={subdomain} />} 
      />
      
      {/* All other paths go to PublicRoutes */}
      <Route path="/*" element={<PublicRoutes subdomain={subdomain} />} />
    </Routes>
  );
};

export default AppRouter;
