import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://student.localhost:5000/api/login', formData);

      const { student, accessToken, refreshToken } = res.data;

      // Store tokens in cookies
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

      setMessage(`✅ Welcome ${student.fullName}`);
      navigate('/studenthome');
    } catch (err: any) {
      setMessage('❌ ' + (err.response?.data?.msg || 'Login failed'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 to-blue-700">
      <div className="bg-white flex w-[900px] rounded-lg overflow-hidden shadow-lg">
        <form onSubmit={handleLogin} className="flex-1 p-10">
          <h2 className="text-3xl font-bold mb-4">Student Login</h2>
          <p className="mb-6 text-sm text-gray-500">Login using your student credentials</p>

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full mb-3 p-2 border border-gray-300 rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full mb-3 p-2 border border-gray-300 rounded"
          />

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

          {message && <p className="mt-4 text-sm text-red-600 text-center">{message}</p>}
        </form>

        <div className="flex-1 bg-blue-500 flex items-center justify-center">
          <img
            src="/images/students/student learn.png"
            alt="illustration"
            className="w-80"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
