import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import SchoolRoutes from './SchoolRoutes';
import Contact from '../features/shared/Contact';

interface Props {
  subdomain: string | null;
}

const AppRouter: React.FC<Props> = ({ subdomain }) => {
  return (
    <Routes>
      {subdomain === 'contact' ? (
        <Route path="*" element={<Contact />} />
      ) : subdomain ? (
        <Route path="*" element={<SchoolRoutes />} />
      ) : (
        <Route path="*" element={<PublicRoutes />} />
      )}
    </Routes>
  );
};

export default AppRouter;
