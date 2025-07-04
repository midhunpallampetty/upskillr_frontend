import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      localStorage.setItem('student', JSON.stringify(res.data.student));
      setMessage(`✅ Welcome ${res.data.student.fullName}`);
      navigate('/verificationStatus');
    } catch (err: any) {
      setMessage('❌ ' + (err.response?.data?.msg || 'Login failed'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 to-blue-700">
      <div className="bg-white flex w-[900px] rounded-lg overflow-hidden shadow-lg">
        {/* Left form section */}
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

          {/* Register Option */}
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

        {/* Right image section */}
        <div className="flex-1 bg-blue-500 flex items-center justify-center">
          <img
            src="/student learn.png"
            alt="illustration"
            className="w-80"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
