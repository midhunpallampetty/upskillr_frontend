import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getSchoolByDomain } from './features/school/api/school.api'; // adjust the import path

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

const BlockedPage: React.FC = () => (
  <div className="flex h-screen items-center justify-center text-center">
    <h1 className="text-3xl font-bold text-red-600">🚫 This school is blocked</h1>
  </div>
);

const SubdomainRoutes: React.FC<{ subdomain: string }> = ({ subdomain }) => {
  const location = useLocation();
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const data = await getSchoolByDomain(subdomain);
        console.log("Fetched school data: in rooot", data);
        setIsBlocked(data?.school?.isBlocked ?? false);
      } catch (err) {
        console.error("Error fetching school by subdomain:", err);
        setIsBlocked(false);
      }
    };
    fetchSchool();
  }, [subdomain]);

  if (isBlocked === null) {
    return <div className="text-center mt-10">Checking school status...</div>;
  }

  if (isBlocked) {
    return <BlockedPage />;
  }

  const routePatterns: { pattern: RegExp; component: React.ReactElement }[] = [
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

export default SubdomainRoutes;
