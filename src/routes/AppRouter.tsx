import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import SchoolRoutes from './SchoolRoutes';

interface Props {
  subdomain: string | null;
}


const AppRouter: React.FC<Props> = ({ subdomain }) => {
  return (
    <Routes>
      {subdomain ? (
        <Route path="*" element={<SchoolRoutes />} />
      ) : (
        <Route path="*" element={<PublicRoutes />} />
      )}
    </Routes>
  );
};


export default AppRouter;
