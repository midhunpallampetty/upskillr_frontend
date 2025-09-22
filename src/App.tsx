import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { getDynamicDomain, getSubdomain } from './utils/getSubdomain';
import AppRouter from './routes/AppRouter';
import MarketingPage from './features/school/MarketingPage';
import StudentLogin from './features/student/studentLogin';
import StudentRegister from './features/student/studentRegister';
import StudentHomePage from './features/student/StudentHomePage';
import CoursesPage from './features/student/CoursesPage';
import CourseDetailsPage from './features/student/CourseDetailsPage';
import CoursePurchasePage from './features/student/CoursePurchasePage';
import { ExamPage } from './features/student/ExamPage';
import PaymentSuccess from './features/student/PaymentSuccess';
import PurchasedCourses from './features/student/PurchasedCourses';
import CourseShowPage from './features/student/CourseShowPage';
import ForumChatUI from './features/shared/ForumPage';
import StudentProfilePage from './features/student/StudentProfile';
import { getSchoolByDomain } from './features/school/api/school.api';

const SchoolBlockedMessage = () => (
  <div className="text-center mt-10">
    <h2>School is blocked by Admin</h2>
    <p>Please contact the administrator for more information.</p>
  </div>
);

const SubdomainRoutes = ({ subdomain }) => {
  const location = useLocation();
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolStatus = async () => {
      try {
        const hostname = window.location.hostname;
        const schoolData = await getSchoolByDomain(`https://${hostname}`);
        // If isBlocked exists and is true, set blocked; otherwise, not blocked
        setIsBlocked(schoolData?.isBlocked === true);
      } catch (error) {
        console.error('Error fetching school data:', error);
        setIsBlocked(false); // Treat as not blocked on error
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolStatus();
  }, [subdomain]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (isBlocked) {
    return <SchoolBlockedMessage />;
  }

  // Define routes with regex patterns (cleaned up duplicates)
  const routePatterns = [
    { pattern: /^\/studentLogin$/, component: <StudentLogin /> },
    { pattern: /^\/studentRegister$/, component: <StudentRegister /> },
    { pattern: /^\/studenthome$/, component: <StudentHomePage /> },
    { pattern: /^\/school\/[^/]+\/course\/[^/]+$/, component: <CourseDetailsPage /> },
    { pattern: /^\/student\/payment\/[^/]+$/, component: <CoursePurchasePage /> },
    { pattern: /^\/student\/exam\/take-exam$/, component: <ExamPage /> },
    { pattern: /^\/student\/payment-success$/, component: <PaymentSuccess /> },
    { pattern: /^\/school\/[^/]+\/home$/, component: <CoursesPage /> },
    { pattern: /^\/student\/purchased-courses$/, component: <PurchasedCourses /> },
    { pattern: /^\/student\/course-page\/([^/]+)\/([^/]+)$/, component: <CourseShowPage /> },
    { pattern: /^\/forum$/, component: <ForumChatUI /> },
    { pattern: /^\/profile$/, component: <StudentProfilePage /> },
  ];

  for (let route of routePatterns) {
    if (route.pattern.test(location.pathname)) {
      return route.component;
    }
  }

  return <MarketingPage />;
};

const App = () => {
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
