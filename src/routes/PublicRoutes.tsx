import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ResetPassword from '../features/school/ResetPassword';
import ForgotPassword from '../features/school/ForgotPassword';
import ResetStudentPassword from '../features/student/ResetPassword';
import ForgotStudentPassword from '../features/student/ForgotPassword';
import ProfilePage from '../features/school/Profile';
import SchoolProfilePage from '../features/school/Profile';
import StudentProfilePage from '../features/student/StudentProfile';
import NotFound from '../features/shared/components/Layout/NotFound';
import CourseDetailsPage from '../features/student/CourseDetailsPage';
import CoursePurchasePage from '../features/student/CoursePurchasePage';
import PaymentSuccess from '../features/student/PaymentSuccess';
import PaymentCancel from '../features/student/PaymentCancel';
import PurchasedCourses from '../features/student/PurchasedCourses';
import CoursesShowPage from '../features/student/CourseShowPage';
import ExamManager from '../features/school/ExamManager';
import { ExamPage } from '../features/student/ExamPage';
import ForumPage from '../features/shared/ForumPage';
import About from '../features/shared/About';
import Contact from '../features/shared/Contact';
import MarketingPage from '../features/school/MarketingPage';
import { HelmetProvider } from 'react-helmet-async';
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
    <Route path="/adminLogin" element={<AdminAuth />} />
    <Route path="/school/:schoolname/profile" element={<SchoolProfilePage />} />
    <Route path='/student/profile'element={<StudentProfilePage/>}/>
    <Route path="*" element={<NotFound />} />
   <Route path="/schoolRegister" element={<SchoolRegister />} />
    <Route path="/student/payment/:courseId" element={<CoursePurchasePage />} />
    <Route path="/school/:schoolName/course/:courseId" element={<CourseDetailsPage />} />
<Route path='/forum'element={<ForumPage/>}/>
    <Route path="/schoolLogin" element={<SchoolLogin />} />
    <Route path="/loginSelection" element={<LoginSelection />} />
    <Route path="/signupSelection" element={<SignupSelection />} />
    <Route path="/schoolStatus" element={<VerificationStatus />} />
    <Route path="/studentLogin" element={<StudentLogin />} />
    <Route path="/studentRegister" element={<StudentRegister />} />
    <Route path="/dashboard" element={<AdminDashboard />} />
   <Route path="/school/:schoolName/home" element={<CoursesPage />} />
   <Route path="/studenthome" element={<StudentHomePage />} />
    <Route path="/addCourse" element={<AddCoursePage />} />
    <Route path="/school/:verifiedSchool" element={<VerifiedSchoolHome />} />
    <Route path="/school/:verifiedSchool/addCourse" element={<AddCoursePage />} />
    <Route path="/school/reset-password" element={<ResetPassword />} />
    <Route path='/school/forgot-password'element={<ForgotPassword/>}/>
    <Route path="/school/:verifiedSchool/section/:sectionId/add-video" element={<AddVideoToSectionWrapper />} />
    <Route path='/student/reset-password'element={<ResetStudentPassword/>}/>
    <Route path='/student/forgot-password'element={<ForgotStudentPassword/>}/>
    <Route path="/student/payment-success" element={<PaymentSuccess />} />
    <Route path='/student/payment-cancelled'element={<PaymentCancel/>}/>
    <Route path='/student/purchased-courses'element={<PurchasedCourses/>}/>
    <Route path='/student/course-page/:schoolName/:courseId'element={<CoursesShowPage/>}/>
    <Route path='/school/:verifiedSchool/manage-exam'element={<ExamManager/>}/>
    <Route path='/student/exam/take-exam' element={<ExamPage />} />
    <Route path='/about'element={<About/>}/>
    <Route path='/contact'element={<Contact/>}/>
    
    <Route path='/subdomainpage'element={<MarketingPage/>}/>
  </Routes>
);

export default PublicRoutes;
