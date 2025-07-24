import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, registerAdmin } from './api/admin.api';
import {
  adminAuthReducer,
  initialAdminAuthState,
} from './reducers/adminAuthReducer';
import Cookies from 'js-cookie';
import useAdminAuthGuard from './hooks/useAdminAuthGuard';

const AdminAuth: React.FC = () => {
  useAdminAuthGuard()
  const [state, dispatch] = useReducer(adminAuthReducer, initialAdminAuthState);
  const navigate = useNavigate();
  const accountType = 'admin';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  dispatch({ type: 'SET_MESSAGE', payload: '' });

  if (!state.isLogin && state.password !== state.confirmPassword) {
    dispatch({ type: 'SET_MESSAGE', payload: '❌ Passwords do not match' });
    return;
  }

  try {
    const data = state.isLogin
      ? await loginAdmin(state.email, state.password)
      : await registerAdmin(state.email, state.password);

    dispatch({ type: 'SET_MESSAGE', payload: data.msg || 'Success' });
console.log(data)
    if (state.isLogin) {
      // 🍪 Set tokens as cookies
      Cookies.set('adminAccessToken', data.accessToken, {
        expires: 1, // 1 day
        secure: true,
        sameSite: 'strict',
      });

      Cookies.set('adminRefreshToken', data.refreshToken, {
        expires: 7, // 7 days
        secure: true,
        sameSite: 'strict',
      });

      console.log('Admin logged in:', data.accessToken);
      navigate('/dashboard');
    }
  } catch (error: any) {  
    const errMsg = error.response?.data?.msg || 'Something went wrong';
    dispatch({ type: 'SET_MESSAGE', payload: `❌ ${errMsg}` });
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
              value={state.email}
              onChange={(e) =>
                dispatch({ type: 'SET_EMAIL', payload: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={state.password}
              onChange={(e) =>
                dispatch({ type: 'SET_PASSWORD', payload: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              required
            />

            {!state.isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={state.confirmPassword}
                onChange={(e) =>
                  dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                required
              />
            )}

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
              {state.isLogin ? 'Login' : 'Signup'}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            {state.isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span
              onClick={() => dispatch({ type: 'TOGGLE_LOGIN' })}
              className="text-blue-500 cursor-pointer"
            >
              {state.isLogin ? 'Signup' : 'Login'}
            </span>
          </p>

          {state.message && (
            <div className="mt-4 text-center text-sm text-red-500">
              {state.message}
            </div>
          )}
        </div>

        {/* Right Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400">
          <img
            src="/images/students/student.png"
            alt="Illustration"
            className="w-[80%] max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
