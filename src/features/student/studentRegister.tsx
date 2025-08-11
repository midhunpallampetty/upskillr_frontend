import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { registerStudent, verifyStudentOtp } from './api/student.api';
import { validateStudentRegister } from './validations/registerValidation';
import { RegisterFormErrors } from './types/RegisterData';
import useNavigateToStudentHome from './hooks/useNavigateToStudentHome';

const StudentRegister = () => {
  useNavigateToStudentHome();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [otp, setOtp] = useState('');
  const [isOtpPhase, setIsOtpPhase] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({} as RegisterFormErrors);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  const validationErrors = validateStudentRegister(formData);
  if (formData.password !== formData.confirmPassword) {
    validationErrors.confirmPassword = "Passwords do not match";
  }
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  try {
    setIsRegisterLoading(true);
    await registerStudent(formData);
    setIsOtpPhase(true);
    toast.success("🎉 Registration successful. Please check your email for the OTP.", {
      position: 'top-right',
      autoClose: 3000,
    });
  } catch (err: any) {
    toast.error(`❌ ${err.message}`, {
      position: 'top-right',
      autoClose: 3000,
    });
  } finally {
    setIsRegisterLoading(false);
  }
};


  const handleOtpSubmit = async () => {
    try {
      setIsOtpLoading(true);
      await verifyStudentOtp(formData.email, otp);

      Swal.fire({
        icon: 'success',
        title: '✅ OTP Verified!',
        text: 'You will be redirected to login now.',
        showConfirmButton: false,
        timer: 3000,
      });

      setTimeout(() => {
        navigate('/studentLogin');
      }, 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || 'OTP verification failed';
      toast.error(`❌ ${errorMsg}`, { position: 'top-right', autoClose: 3000 });
    } finally {
      setIsOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        {!isOtpPhase ? (
          <div className="flex-1 p-8 md:p-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600 mb-8">Join our learning community by registering below</p>

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  disabled={isRegisterLoading}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  disabled={isRegisterLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  disabled={isRegisterLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-3 right-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={isRegisterLoading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  disabled={isRegisterLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute top-3 right-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={isRegisterLoading}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                onClick={handleRegister}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 font-medium flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={isRegisterLoading}
              >
                {isRegisterLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Register Now'
                )}
              </button>
                  <ToastContainer theme="colored" />

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/studentLogin')}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                  disabled={isRegisterLoading}
                >
                  Sign in
                </button>
                
              </p>
            </div>

          </div>
          
        ) : (
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">
              An OTP has been sent to <strong>{formData.email}</strong>
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 mb-6"
              disabled={isOtpLoading}
            />

            <button
              onClick={handleOtpSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 font-medium flex items-center justify-center disabled:bg-green-400 disabled:cursor-not-allowed"
              disabled={isOtpLoading}
            >
              {isOtpLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>

            <p className="mt-6 text-sm text-gray-600 text-center">
              Didn't receive OTP? Check spam or{' '}
              <span className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium">
                Resend
              </span>{' '}
              (not implemented).
            </p>
          </div>
        )}

        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center p-6">
          <img
            src="/images/students/student_learning.png"
            alt="Student Learning"
            className="w-80 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
          />
          
        </div>
        
      </div>
      
    </div>
  );
};

export default StudentRegister;