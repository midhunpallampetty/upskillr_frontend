import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get('adminAccessToken');
    const refreshToken = Cookies.get('adminRefreshToken');

    if (accessToken && refreshToken) {
      navigate('/dashboard');
    }
  }, [navigate]);
};

export default useAdminRedirect;
