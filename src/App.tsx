import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { getDynamicDomain, getSubdomain } from './utils/getSubdomain';
import AppRouter from './routes/AppRouter';
import MarketingPage from './features/school/MarketingPage';
import StudentLogin from './features/student/studentLogin';
import StudentRegister from './features/student/studentRegister'; // Assuming correct import
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
import SchoolBlocker from './features/school/components/UI/SchoolBlocked';
import ResetStudentPassword from './features/student/ResetPassword';
import ForgotStudentPassword from './features/student/ForgotPassword';
const SubdomainRoutes: React.FC<{ subdomain: string }> = ({ subdomain }) => {
  const location = useLocation();

  // Define routes with regex patterns
  const routePatterns: { pattern: RegExp; component: React.ReactElement }[] = [
    { pattern: /^\/studentLogin$/, component: <StudentLogin /> },
    { pattern: /^\/studentRegister$/, component: <StudentRegister /> },
   
    { 
  pattern: /^\/school\/[^/]+\/course\/[^/]+$/, 
  component: <CourseDetailsPage /> 
},
    { 
  pattern: /^\/school\/[^/]+\/course\/[^/]+$/, 
  component: <CourseDetailsPage /> 

},
{ pattern: /^\/student\/payment\/[^/]+$/, component: <CoursePurchasePage /> },
{  pattern: /^\/student\/exam\/take-exam$/, component: <ExamPage /> },
{ pattern: /^\/student\/payment-success$/, component: <PaymentSuccess /> },

{ pattern: /^\/school\/[^/]+\/home$/, component: <CoursesPage /> }, // matches /school/:schoolName/home
{ pattern: /^\/student\/purchased-courses$/, component: <PurchasedCourses /> },
{
  pattern: /^\/student\/course-page\/([^/]+)\/([^/]+)$/,
  component: <CourseShowPage />
},
       { pattern: /^\/forum$/, component: <ForumChatUI /> },

 { pattern: /^\/profile$/, component: <StudentProfilePage /> },
   { pattern: /^\/student\/reset-password$/, component: <ResetStudentPassword /> },
  { pattern: /^\/student\/forgot-password$/, component: <ForgotStudentPassword /> },
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
      <SchoolBlocker>
        <Routes>
          {isSubdomain ? (
            <Route path="/*" element={<SubdomainRoutes subdomain={subdomain} />} />
          ) : (
            <Route path="/*" element={<AppRouter subdomain={subdomain} />} />
          )}
        </Routes>
        </SchoolBlocker>
      </Suspense>
    </Router>
  );
};

export default App;
