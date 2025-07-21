import React, { useEffect, useState } from 'react';
import { sendForgotPasswordLink } from './api/school.api';
import { useNavigate } from 'react-router-dom';

const EXPIRY_KEY = 'reset_link_expiry';
const COOLDOWN_DURATION = 60 * 1000*5; // 1 minute
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedExpiry = localStorage.getItem(EXPIRY_KEY);
    if (storedExpiry) {
      const expiryTime = new Date(storedExpiry).getTime();
      const now = Date.now();
      if (expiryTime > now) {
        setTimeLeft(Math.floor((expiryTime - now) / 1000));
      } else {
        localStorage.removeItem(EXPIRY_KEY); // Expired
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            localStorage.removeItem(EXPIRY_KEY);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLeft > 0) return;

    setLoading(true);
    setMessage('');
    try {
      await sendForgotPasswordLink(email);
      const expiry = new Date(Date.now() + COOLDOWN_DURATION);
      localStorage.setItem(EXPIRY_KEY, expiry.toISOString());
      setTimeLeft(COOLDOWN_DURATION / 1000);
      setMessage('✅ Reset link sent to your email.');
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.msg || 'Something went wrong'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-indigo-700">
      <div className="bg-white w-[500px] p-10 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">Enter your email to receive a reset link</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || timeLeft > 0}
          >
            {loading ? 'Sending...' : timeLeft > 0 ? `Wait ${formatTime(timeLeft)}` : 'Send Reset Link'}

          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}

        <p className="mt-6 text-center text-sm">
          <button
            onClick={() => navigate('/schoolLogin')}
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
