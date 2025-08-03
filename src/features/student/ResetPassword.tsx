import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {resetStudentPassword} from "./api/student.api";
const ResetStudentPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage('');

    if (!newPassword || !confirmPassword) {
      setMessage('Please fill all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage(
        'Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
      );
      return;
    }

    try {
         await resetStudentPassword(email as string, token as string, newPassword);

Swal.fire({
  icon: 'success',
  title: 'Password Reset',
  text: 'Password reset successfully. You can now login.',
  confirmButtonColor: '#3085d6',
});    
localStorage.removeItem("resetLinkTimestamp");
navigate('/studentlogin');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-800 to-blue-600">
      <div className="flex flex-col md:flex-row bg-white rounded-md shadow-lg overflow-hidden max-w-3xl w-full">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
          <p className="text-sm text-gray-600 mb-4">Set your new password below.</p>

          {message && <p className="text-red-500 text-sm mb-3">{message}</p>}

          <form onSubmit={handleReset}>
            <div className="relative mb-3">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New Password"
                className="w-full p-2 border rounded"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2 text-sm text-gray-600"
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="relative mb-3">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="w-full p-2 border rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2 text-sm text-gray-600"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
            >
              Set New Password
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-blue-500 flex items-center justify-center p-4">
          <img
            src="/images/students/forgot-password.png"
            alt="Student studying"
            className="rounded-md max-h-64"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetStudentPassword;
