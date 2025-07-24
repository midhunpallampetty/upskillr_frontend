import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useSchoolAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    const dbname = Cookies.get('dbname');
    const schoolData = Cookies.get('schoolData');

    if (!accessToken || !refreshToken || !dbname || !schoolData) {
      navigate('/schoolLogin');
    }
  }, [navigate]);
};

export default useSchoolAuthGuard;
