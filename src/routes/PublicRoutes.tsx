import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ResetPassword from '../features/school/ResetPassword';
import ForgotPassword from '../features/school/ForgotPassword';
import ResetStudentPassword from '../features/student/ResetPassword';
import ForgotStudentPassword from '../features/student/ForgotPassword';

const LandingPage = lazy(() => import('../features/shared/Landing'));
const AdminAuth = lazy(() => import('../features/admin/AdminAuth'));
const SchoolRegister = lazy(() => import('../features/school/schoolRegister'));
const SchoolLogin = lazy(() => import('../features/school/schoolLogin'));
const LoginSelection = lazy(() => import('../features/shared/LoginSelection'));
const SignupSelection = lazy(() => import('../features/shared/SignupSelection'));
const VerificationStatus = lazy(() => import('../features/shared/VerificationStatus'));
const StudentLogin = lazy(() => import('../features/student/studentLogin'));
const StudentRegister = lazy(() => import('../features/student/studentRegister'));
const AdminDashboard = lazy(() => import('../features/admin/components/Layout/Dashboard'));
const CoursesPage = lazy(() => import('../features/student/CoursesPage'));
const StudentHomePage = lazy(() => import('../features/student/StudentHomePage'));
const AddCoursePage = lazy(() => import('../features/course/AddCoursePage'));
const VerifiedSchoolHome = lazy(() => import('../features/school/VerifiedSchoolHome'));
const AddVideoToSectionWrapper = lazy(() => import('../features/school/components/UI/AddVideoToSectionWrapper'));

const PublicRoutes = () => (
  <Routes>
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
    <Route path="/school/:schoolName/courses" element={<CoursesPage />} />
    <Route path="/studenthome" element={<StudentHomePage />} />
    <Route path="/addCourse" element={<AddCoursePage />} />
    <Route path="/school/:verifiedSchool" element={<VerifiedSchoolHome />} />
    <Route path="/school/:verifiedSchool/addCourse" element={<AddCoursePage />} />
    <Route path="/school/reset-password" element={<ResetPassword />} />
    <Route path='/school/forgot-password'element={<ForgotPassword/>}/>
    <Route path="/school/:verifiedSchool/section/:sectionId/add-video" element={<AddVideoToSectionWrapper />} />
    <Route path='/student/reset-password'element={<ResetStudentPassword/>}/>
    <Route path='/student/forgot-password'element={<ForgotStudentPassword/>}/>

  </Routes>
);

export default PublicRoutes;
