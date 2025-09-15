import React, { lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MarketingPage from '../features/school/MarketingPage';

const StudentLogin = lazy(() => import('../features/student/studentLogin'));
const VerifiedSchoolHome = lazy(() => import('../features/school/VerifiedSchoolHome'));

const SchoolRoutes = () => {
  const location = useLocation();
  
  // Show MarketingPage only for root path
  if (location.pathname === '/') {
    return <MarketingPage />;
  }
  
  // Handle specific routes
  if (location.pathname === '/studentLogin') {
    return <StudentLogin />;
  }
  
  // Default fallback
  return <VerifiedSchoolHome />;
};

export default SchoolRoutes;
