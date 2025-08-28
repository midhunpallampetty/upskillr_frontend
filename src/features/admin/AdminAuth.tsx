import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin /*, registerAdmin */ } from './api/admin.api';
import {
  adminAuthReducer,
  initialAdminAuthState,
} from './reducers/adminAuthReducer';
import Cookies from 'js-cookie';
import useAdminAuthGuard from './hooks/useAdminAuthGuard';
import useAdminRedirect from './hooks/useAdminRedirect';

const AdminAuth: React.FC = () => {
  useAdminRedirect();
  const [state, dispatch] = useReducer(adminAuthReducer, initialAdminAuthState);
  const navigate = useNavigate();
  const accountType = 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_MESSAGE', payload: '' });
    
    // Commented out registration logic
    /*
    if (!state.isLogin && state.password !== state.confirmPassword) {
      dispatch({ type: 'SET_MESSAGE', payload: '❌ Passwords do not match' });
      return;
    }
    */

    try {
      // Only login functionality
      const data = await loginAdmin(state.email, state.password);
      dispatch({ type: 'SET_MESSAGE', payload: data.msg || 'Success' });
      console.log(data);

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
    } catch (error: any) {
      const errMsg = error.response?.data?.msg || 'Something went wrong';
      dispatch({ type: 'SET_MESSAGE', payload: `❌ ${errMsg}` });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md mx-4">
        {/* Admin Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Upskillr Admin</h1>
              <p className="text-indigo-100 text-sm mt-1">Administrative Access Portal</p>
            </div>
          </div>

          {/* Login Form */}
          <div className="px-8 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 text-center">Administrator Login</h2>
              <p className="text-gray-600 text-sm text-center mt-1">Enter your credentials to access the admin dashboard</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="admin@upskillr.com"
                    value={state.email}
                    onChange={(e) =>
                      dispatch({ type: 'SET_EMAIL', payload: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={state.password}
                    onChange={(e) =>
                      dispatch({ type: 'SET_PASSWORD', payload: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Account Type Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Account Type</label>
                <div className="flex items-center px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                  <span className="text-indigo-800 font-medium">Administrator</span>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Access Dashboard
              </button>
            </form>

            {/* Message Display */}
            {state.message && (
              <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
                state.message.includes('❌') 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-green-50 text-green-600 border border-green-200'
              }`}>
                {state.message}
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Protected by enterprise-grade security
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            🔒 This is a secure administrative area. All activities are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
