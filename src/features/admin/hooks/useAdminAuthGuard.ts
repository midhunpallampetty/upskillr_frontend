import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useAdminAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get('adminAccessToken');
    const refreshToken = Cookies.get('adminRefreshToken');

    if (!accessToken || !refreshToken) {
      navigate('/adminLogin');
    }
  }, [navigate]);
};

export default useAdminAuthGuard;
