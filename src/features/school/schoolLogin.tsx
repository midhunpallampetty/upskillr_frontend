import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { loginSchool } from '../../api/school'; 

const SchoolLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const extractSchoolName = (subDomainUrl: string): string => {
    try {
      const cleaned = subDomainUrl.replace(/^https?:\/\//, ''); 
      const hostPart = cleaned.split('.')[0]; 
      return hostPart;
    } catch (err) {
      console.error('Error extracting school name from subdomain:', err);
      return '';
    }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const school = await loginSchool(email, password);
      const { accessToken, refreshToken } = school;
  console.log(school,'response')
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
    
      localStorage.setItem('accessToken', JSON.stringify(accessToken));
      setMessage(`✅ Welcome ${school.name}`);
  
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
      setMessage(`❌ ${err.response?.data?.msg || 'Login failed'}`);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            required
          />
          <input
            name="password"
            placeholder=" Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            required
          />

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

          {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
        </form>

        <div className="flex-1 bg-blue-500 flex items-center justify-center">
          <img src="/images/teaching.png" alt="illustration" className="w-80" />
        </div>
      </div>
    </div>
  );
};

export default SchoolLogin;
