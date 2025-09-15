import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import MarketingPage from '../features/school/MarketingPage';
import LandingPage from '../features/shared/Landing';
import AdminAuth from '../features/admin/AdminAuth';
import StudentLogin from '../features/student/studentLogin';
import SchoolLogin from '../features/school/schoolLogin';
import StudentRegister from '../features/student/studentRegister';
import SchoolRegister from '../features/school/schoolRegister';
import NotFound from '../features/shared/components/Layout/NotFound';

interface Props {
  subdomain: string | null;
}

const AppRouter: React.FC<Props> = ({ subdomain }) => {
  return (
    <Routes>
      {/* Handle root path based on subdomain */}
      <Route 
        path="/" 
        element={subdomain ? <MarketingPage /> : <LandingPage />} 
      />
      
      {/* All other paths go to PublicRoutes - but flatten them */}
      <Route path="/adminLogin" element={<AdminAuth />} />
      <Route path="/studentLogin" element={<StudentLogin />} />
      <Route path="/schoolLogin" element={<SchoolLogin />} />
      <Route path="/studentRegister" element={<StudentRegister />} />
      <Route path="/schoolRegister" element={<SchoolRegister />} />
      {/* Add other important routes here */}
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
