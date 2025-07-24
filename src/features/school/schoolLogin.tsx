import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
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

  useNavigateToSchool();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const school = await loginSchool(state.email, state.password);
      const { accessToken, refreshToken, dbname } = school;

      Cookies.set('accessToken', accessToken, {
        expires: 1,
        secure: true,
        sameSite: 'strict',
      });

      Cookies.set('refreshToken', refreshToken, {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      });

      Cookies.set('schoolData', JSON.stringify(school), {
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
      dispatch({ type: 'SET_MESSAGE', payload: `✅ Welcome ${school.name}` });

      if (!school.subDomain || school.subDomain === 'null') {
        navigate('/schoolStatus');
        return;
      }

      let slug = '';
      try {
        const url = new URL(school.subDomain);
        slug = url.hostname.split('.')[0];
      } catch {
        slug = school.subDomain;
      }

      navigate(`/school/${slug}`);
    } catch (err: any) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: `❌ ${err.response?.data?.msg || 'Login failed'}`,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-blue-800">
      <div className="bg-white flex w-[900px] rounded-lg overflow-hidden shadow-lg">
        <form onSubmit={handleLogin} className="flex-1 p-10">
          <h2 className="text-3xl font-bold mb-4">School Login</h2>
          <p className="mb-6 text-sm text-gray-500">Login using your credentials</p>

          <input
            name="email"
            placeholder=" Email"
            value={state.email}
            onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            required
          />

          <div className="relative mb-3">
            <input
              name="password"
              placeholder=" Password"
              type={state.showPassword ? 'text' : 'password'}
              value={state.password}
              onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded pr-10"
              required
            />
            <span
              onClick={() => dispatch({ type: 'TOGGLE_SHOW_PASSWORD' })}
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer select-none"
            >
              {state.showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <p className="text-right text-sm mb-4">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => navigate('/school/forgot-password')}
            >
              Forgot Password?
            </button>
          </p>

          <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">
            Login
          </button>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/schoolRegister')}
              className="text-blue-600 hover:underline"
            >
              Register here
            </button>
          </p>

          {state.message && <p className="mt-4 text-sm text-red-600">{state.message}</p>}
        </form>

        <div className="flex-1 bg-blue-500 flex items-center justify-center">
          <img src="/images/teaching.png" alt="illustration" className="w-80" />
        </div>
      </div>
    </div>
  );
};

export default SchoolLogin;
