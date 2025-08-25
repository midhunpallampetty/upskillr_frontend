import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '../shared/components/UI/Loader'; // Adjust the path if needed
import { sendStudentResetLink } from './api/student.api'; 
const ForgotStudentPassword = () => {
    const navigate=useNavigate()
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  
const COOLDOWN_PERIOD = 24 * 60 * 60;
  
  useEffect(() => {
    const lastRequestTime = localStorage.getItem('resetLinkTimestamp');
    if (lastRequestTime) {
      const timePassed = Math.floor((Date.now() - parseInt(lastRequestTime)) / 1000);
      const remainingTime = COOLDOWN_PERIOD - timePassed;
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
      }
    }

    // Update timer every second
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('resetLinkTimestamp');
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    
    return () => clearInterval(interval);
  }, []);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setMessage('');
  setError('');

  if (!email) {
    setError('Email is required.');
    return;
  }

  if (!validateEmail(email)) {
    setError('Please enter a valid email address.');
    return;
  }

  if (timeLeft > 0) {
    setError(`Please wait ${formatTime(timeLeft)} before sending another reset link.`);
    return;
  }

  try {
    setIsLoading(true);
    const msg = await sendStudentResetLink(email); // 👈 Use separated API
    setMessage(msg);
    localStorage.setItem('resetLinkTimestamp', Date.now().toString());
    setTimeLeft(COOLDOWN_PERIOD);
  } catch (err: any) {
    setError(err.response?.data?.message || 'Something went wrong.');
  } finally {
    setIsLoading(false);
  }
};


  // Format time in MM:SS
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 to-blue-600">
      <div className="bg-white rounded-lg shadow-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your email to receive reset link</p>

<form onSubmit={handleSubmit}>
  <label className="block text-sm font-medium mb-1">Email</label>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
    placeholder="Enter your email"
    disabled={timeLeft > 0} 
  />

  <LoadingButton
    isLoading={isLoading}
    text="Send Reset Link"
    type="submit"
    className="mt-2"
    disabled={timeLeft > 0}
  />

  {/* 👇 Moved this here for spacing and clarity */}
  <div className="mt-4">
    <button
      type="button"
      onClick={() => navigate('/studentLogin')}
      className="text-blue-600 hover:underline text-sm"
    >
      Back to Login
    </button>
  </div>

  {timeLeft > 0 && (
    <p className="text-sm text-gray-600 mt-3">
      Please wait <span className="font-semibold text-blue-600">{formatTime(timeLeft)}</span> before sending another reset link.
    </p>
  )}

  {message && <p className="text-green-600 mt-3 text-sm">{message}</p>}
  {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
</form>

        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-blue-500 flex items-center justify-center p-4">
          <img
            src="/images/students/forgot-password.png"
            alt="Study illustration"
            className="rounded-lg max-h-80 object-cover"
          />
        </div>
        
      </div>
      
    </div>
  );
};

export default ForgotStudentPassword;