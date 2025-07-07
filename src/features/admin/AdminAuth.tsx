import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('admin');
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const endpoint = isLogin ? 'login' : 'register';
    try {
      const res = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setMessage(data.msg || 'Unexpected response');

      if (res.ok && isLogin) {
        // Redirect to admin dashboard or save token
        console.log('Admin logged in:', data.admin);
        navigate('/dashboard')
        // navigate('/admin/dashboard');
      }
    } catch (err) {
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] font-sans">
      <div className="flex w-[90%] max-w-5xl bg-white rounded-2xl overflow-hidden shadow-lg">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Upskillr</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h2>
          <p className="text-gray-600 mb-6">Join us today!</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              required
            />

            <select
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
              value={accountType}
              disabled
            >
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
            >
              {isLogin ? 'Login' : 'Signup'}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 cursor-pointer"
            >
              {isLogin ? 'Signup' : 'Login'}
            </span>
          </p>

          {message && (
            <div className="mt-4 text-center text-sm text-red-500">{message}</div>
          )}
        </div>

        {/* Right Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400">
          <img
            src="/images/students/student.png" // 👈 replace this with the path to your actual illustration
            alt="Illustration"
            className="w-[80%] max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
