import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { getDynamicDomain, getSubdomain } from './utils/getSubdomain';
import AppRouter from './routes/AppRouter';
import MarketingPage from './features/school/MarketingPage';
import StudentLogin from './features/student/studentLogin';
import StudentRegister from './features/student/studentRegister'; // Assuming correct import
import StudentHomePage from './features/student/StudentHomePage';
import CoursesPage from './features/student/CoursesPage';

const SubdomainRoutes: React.FC<{ subdomain: string }> = ({ subdomain }) => {
  const location = useLocation();

  // Define routes with regex patterns
  const routePatterns: { pattern: RegExp; component: React.ReactElement }[] = [
    { pattern: /^\/studentLogin$/, component: <StudentLogin /> },
    { pattern: /^\/studentRegister$/, component: <StudentRegister /> },
    { pattern: /^\/studenthome$/, component: <StudentHomePage /> },
    
    { pattern: /^\/school\/[^/]+\/home$/, component: <CoursesPage /> }, // matches /school/:schoolName/home
  ];

  for (let route of routePatterns) {
    if (route.pattern.test(location.pathname)) {
      return route.component;
    }
  }

  return <MarketingPage />;
};


const App: React.FC = () => {
  const subdomain = getSubdomain();
  const dynamicSubdomain = getDynamicDomain();
  const isSubdomain = dynamicSubdomain && dynamicSubdomain !== "www";

  return (
    <Router>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <Routes>
          {isSubdomain ? (
            <Route path="/*" element={<SubdomainRoutes subdomain={subdomain} />} />
          ) : (
            <Route path="/*" element={<AppRouter subdomain={subdomain} />} />
          )}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
