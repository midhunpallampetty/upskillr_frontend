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

  // List of exception paths where MarketingPage should not be shown
  const exceptionPaths = ["/studentLogin", "/studentRegister","/studenthome","/school/:schoolName/home"];

  if (exceptionPaths.includes(location.pathname)) {
    switch(location.pathname) {
      case "/studentLogin":
        return <StudentLogin />;
      case "/studentRegister":
        return <StudentRegister />;
        case "/studenthome":
          return<StudentHomePage/>
          case "/school/:schoolName/home":
            return <CoursesPage/>;
      default:
        return null;
    }
  }

  // All other paths show MarketingPage
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
