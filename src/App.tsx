import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminAuth from './pages/AdminAuth';
import SchoolRegister from './pages/schoolRegister';
import SchoolLogin from './pages/schoolLogin';
import LandingPage from './pages/Landing';
import LoginSelection from './pages/LoginSelection';
import SignupSelection from './pages/signupSelection';
import VerificationStatus from './pages/VerificationStatus';
import StudentLogin from './pages/studentLogin';
import StudentRegister from './pages/studentRegister';
import AdminDashboard from './pages/adminDashboard';
import VerifiedSchoolHome from './pages/VerifiedSchoolHome';
import AddCoursePage from './pages/AddCourse';

// ✅ Subdomain extractor
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
            <Route path="/addCourse" element={<AddCoursePage />} />
            <Route path="/school/:verifiedSchool" element={<VerifiedSchoolHome />} />
            <Route path='/school/:verifiedSchool/addCourse' element={<AddCoursePage/>}/>
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
