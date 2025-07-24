import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useNavigateToSchool = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const schoolData = Cookies.get('schoolData');
    const dbname = Cookies.get('dbname');
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (schoolData && dbname && accessToken && refreshToken) {
      navigate(`/school/${dbname}`);
    }
  }, [navigate]);
};

export default useNavigateToSchool;
