import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateStudentLogin } from './validations/loginValidation';
import { loginStudent } from './api/student.api';
import { StudentLoginData } from './types/StudentData';
import { Eye, EyeOff } from 'lucide-react';
import useNavigateToStudentHome from './hooks/useNavigateToStudentHome';

const StudentLogin = () => {
  useNavigateToStudentHome()
  const [formData, setFormData] = useState<StudentLoginData>({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run validation
    const validationErrors = validateStudentLogin(formData);

    // If there are validation errors, update state and stop
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear previous errors
    setErrors({});

    try {
      const { student, accessToken, refreshToken } = await loginStudent(formData);

      Cookies.set('studentAccessToken', accessToken, {
        expires: 1,
        secure: true,
        sameSite: 'strict',
      });

      Cookies.set('studentRefreshToken', refreshToken, {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      });

      localStorage.setItem('student', JSON.stringify(student));

      toast.success(`🎉 Welcome ${student.fullName}`, { position: 'top-right' });
      navigate('/studenthome');
    } catch (err: any) {
      const msg = err?.msg || err.message || 'Login failed';
      if (msg.toLowerCase().includes('school')) {
        toast.error('❌ School not found', { position: 'top-right' });
      } else {
        toast.error(`❌ ${msg}`, { position: 'top-right' });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 to-blue-700">
      <ToastContainer />
      <div className="bg-white flex w-[900px] rounded-lg overflow-hidden shadow-lg">
        <form onSubmit={handleLogin} className="flex-1 p-10">
          <h2 className="text-3xl font-bold mb-4">Student Login</h2>
          <p className="mb-6 text-sm text-gray-500">Login using your student credentials</p>

          <div className="mb-4">
            <input
              name="email"
              placeholder="Email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4 relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <p className="text-right text-sm mb-4">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => navigate('/student/forgot-password')}
            >
              Forgot Password?
            </button>
          </p>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Login
          </button>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/studentRegister')}
              className="text-blue-600 hover:underline"
            >
              Register here
            </button>
          </p>
        </form>

        <div className="flex-1 bg-blue-500 flex items-center justify-center">
          <img src="/images/students/student learn.png" alt="illustration" className="w-80" />
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;