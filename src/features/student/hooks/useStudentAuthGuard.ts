import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useStudentAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get('studentAccessToken');
    const refreshToken = Cookies.get('studentRefreshToken');

    if (!accessToken || !refreshToken) {
      navigate('/studentLogin');
    }
  }, [navigate]);
};

export default useStudentAuthGuard;
