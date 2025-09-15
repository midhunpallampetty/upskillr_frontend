import React, { useReducer, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { loginSchool } from '../../api/school';
import useNavigateToSchool from './hooks/useNavigateIntoSchool';
import {
  loginReducer,
  initialLoginState,
} from './reducers/schoolLogin.reducer';

const SchoolLogin = () => {
  const [state, dispatch] = useReducer(loginReducer, initialLoginState);
  const navigate = useNavigate();
  const location = useLocation();

  useNavigateToSchool();

  useEffect(() => {
    if (location.state?.fromRegistration) {
      dispatch({ type: 'SET_MESSAGE', payload: '✅ Registration completed successfully! Please login.' });
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginSchool(state.email, state.password);
      console.log(data,'school')
      const { accessToken, refreshToken, dbname } = data;
      const expiresIn15Minutes = new Date(new Date().getTime() + 15 * 60 * 1000); 
      Cookies.set('accessToken', accessToken, {
        expires: expiresIn15Minutes,
        secure: true,
        sameSite: 'strict',
      });

      Cookies.set('refreshToken', refreshToken, {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      });

      Cookies.set('schoolData', JSON.stringify(data.school), {
        expires: 1,
        secure: true,
        sameSite: 'strict',
      });

      Cookies.set('dbname', dbname, {
        expires: 1,
        secure: true,
        sameSite: 'strict',
      });

      localStorage.setItem('accessToken', JSON.stringify(accessToken));
      dispatch({ type: 'SET_MESSAGE', payload: `✅ Welcome ${data.school.name}` });

      if (!data.school.subDomain || data.school.subDomain === 'null') {
        navigate('/schoolStatus');
        return;
      }

      let slug = '';
      try {
        const url = new URL(data.school.subDomain);
        slug = url.hostname.split('.')[0];
      } catch {
        slug = data.school.subDomain;
      }

      navigate(`/school/${slug}`);
    } catch (err) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: `❌ ${err.response?.data?.msg || 'Login failed'}`,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-blue-700 p-4">
      <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        <form onSubmit={handleLogin} className="flex-1 p-8 md:p-12 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">School Login</h2>
            <p className="mt-2 text-sm text-gray-500">Sign in with your school credentials</p>
          </div>

          <div className="space-y-4">
            <input
              name="email"
              placeholder="Email"
              value={state.email}
              onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              required
            />

            <div className="relative">
              <input
                name="password"
                placeholder="Password"
                type={state.showPassword ? 'text' : 'password'}
                value={state.password}
                onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors pr-12"
                required
              />
              <span
                onClick={() => dispatch({ type: 'TOGGLE_SHOW_PASSWORD' })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer select-none text-lg"
              >
                {state.showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
              onClick={() => navigate('/school/forgot-password')}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/schoolRegister')}
              className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              Register here
            </button>
          </p>

          {state.message && (
            <p className="mt-4 text-sm text-center text-red-500">{state.message}</p>
          )}
        </form>

        <div className="flex-1 bg-teal-600 flex items-center justify-center p-8">
          <img
            src="/images/teaching.png"
            alt="School illustration"
            className="w-full max-w-xs md:max-w-sm object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SchoolLogin;
