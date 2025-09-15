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
      {/* Show MarketingPage only for subdomain root path */}
      {subdomain && <Route path="/" element={<MarketingPage />} />}
      
      {/* Let PublicRoutes handle all other paths */}
      <Route path="/*" element={<PublicRoutes subdomain={subdomain} />} />
    </Routes>
  );
};

export default AppRouter;
