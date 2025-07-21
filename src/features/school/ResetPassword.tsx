import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { resetSchoolPassword } from './api/school.api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');

  const validatePassword = () => {
    if (!password || !confirmPassword) return 'Please fill in all fields';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage('Invalid or expired reset link');
      return;
    }

    const validationError = validatePassword();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      await resetSchoolPassword({ token, password });

      Swal.fire({
        icon: 'success',
        title: 'Password Reset Successful',
        text: 'You can now login with your new password.',
        confirmButtonColor: '#10b981',
      }).then(() => {
        localStorage.removeItem('reset_link_expiry');
        navigate('/schoolLogin');
      });
    } catch (err: any) {
      setMessage(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-800 to-blue-700">
      <div className="flex bg-white rounded-md shadow-lg overflow-hidden w-[90%] max-w-4xl">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h2>
          <p className="text-sm text-gray-500 mb-6">Enter a new password for your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 cursor-pointer select-none"
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500 cursor-pointer select-none"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition"
            >
              Reset Password
            </button>
          </form>

          {message && <p className="text-red-600 mt-4">{message}</p>}
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-blue-500">
          <img
            src="/images/schools/forgot-password.png"
            alt="Reset"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
