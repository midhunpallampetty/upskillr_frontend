import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentRegister = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://student.localhost:5000/api/register', formData);
      setMessage('✅ ' + res.data.msg);
      navigate('/studentLogin');
    } catch (err: any) {
      setMessage('❌ ' + (err.response?.data?.msg || 'Registration failed'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-900 to-blue-700">
      <div className="flex bg-white rounded-lg overflow-hidden shadow-lg w-[900px]">
        {/* Form */}
        <form onSubmit={handleRegister} className="flex-1 p-10">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Student Register</h2>
          <p className="text-sm text-gray-500 mb-5">Fill in your details to register</p>

          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full mb-3 p-2 border border-gray-300 rounded"
          />
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/studentLogin')}
              className="text-blue-600 hover:underline"
            >
              Login here
            </button>
          </p>

          {message && (
            <p className="mt-4 text-sm text-center text-red-600">{message}</p>
          )}
        </form>

        {/* Right image */}
        <div className="flex-1 bg-blue-500 flex items-center justify-center p-4">
          <img
            src="/student learning.png" // Update with your path
            alt="Student"
            className="w-72 rounded shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
