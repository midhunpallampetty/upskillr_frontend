import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import SchoolRoutes from './SchoolRoutes';
import MarketingPage from '../features/school/MarketingPage';
import { getDynamicSubdomain} from "../utils/getSubdomain"; // Import the production-ready function

interface Props {
  subdomain: string | null;
}

const AppRouter: React.FC<Props> = ({ subdomain: propSubdomain }) => {
  // Use getDynamicSubdomain for reliable detection (overrides prop if needed)
  const detectedSubdomain: string | null = getDynamicSubdomain() || propSubdomain; // Fallback to prop if detection fails

  if (detectedSubdomain && detectedSubdomain !== '') {
    return (
      <Routes>
        <Route path="/" element={<MarketingPage subdomain={detectedSubdomain} />} /> {/* Pass detected value */}
        <Route path="*" element={<SchoolRoutes />} />
      </Routes>
    );
  }

  // Main domain fallback
  return (
    <Routes>
      <Route path="*" element={<PublicRoutes />} />
    </Routes>
  );
};

export default AppRouter;
