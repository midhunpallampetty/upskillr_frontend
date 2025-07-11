import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminAuth from './features/admin/AdminAuth';
import SchoolRegister from './features/school/schoolRegister';
import SchoolLogin from './features/school/schoolLogin';
import LandingPage from './features/shared/Landing';
import LoginSelection from './features/shared/LoginSelection';
import SignupSelection from './features/shared/SignupSelection';
import VerificationStatus from './features/shared/VerificationStatus';
import StudentLogin from './features/student/studentLogin';
import StudentRegister from './features/student/studentRegister';
import AdminDashboard from './features/admin/Dashboard';
import VerifiedSchoolHome from './features/school/VerifiedSchoolHome';
import AddCoursePage from './features/course/AddCoursePage';
import StudentHomePage from './features/student/StudentHomePage';
import AddVideoToSectionWrapper from './features/school/components/AddVideoToSectionWrapper';
export const getSubdomain = (): string | null => {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length >= 2 && parts[1] === 'localhost') {
    return parts[0];
  }
  return null;
};

const App: React.FC = () => {
  const subdomain = getSubdomain();

  return (
    <Router>
      <Routes>
        {subdomain ? (
          // ✅ If subdomain exists: serve school-specific routes (wildcard route)
          <Route path="*" element={<VerifiedSchoolHome />} />
        ) : (
          // ✅ Else, serve normal application routes
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/adminRegister" element={<AdminAuth />} />
            <Route path="/schoolRegister" element={<SchoolRegister />} />
            <Route path="/schoolLogin" element={<SchoolLogin />} />
            <Route path="/loginSelection" element={<LoginSelection />} />
            <Route path="/signupSelection" element={<SignupSelection />} />
            <Route path="/schoolStatus" element={<VerificationStatus />} />
            <Route path="/studentLogin" element={<StudentLogin />} />
            <Route path="/studentRegister" element={<StudentRegister />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path='/studenthome'element={<StudentHomePage/>}/>
            <Route path="/addCourse" element={<AddCoursePage />} />
            <Route path="/school/:verifiedSchool" element={<VerifiedSchoolHome />} />
            <Route path='/school/:verifiedSchool/addCourse' element={<AddCoursePage/>}/>
            <Route path="/school/:verifiedSchool/section/:sectionId/add-video"element={<AddVideoToSectionWrapper/>}
        />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
