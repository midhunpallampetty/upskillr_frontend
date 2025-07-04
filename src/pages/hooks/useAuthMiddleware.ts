// hooks/useAuthMiddleware.ts
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const useAuthMiddleware = () => {
  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    const schoolData = Cookies.get('schoolData');
console.log(accessToken+"accessToken",refreshToken+"refreshToken",schoolData,'all data here');
    // if (  !schoolData) {
    //   const rootDomain = window.location.hostname.replace(/^.*?\./, '');
    //   window.location.href = `${window.location.protocol}//${rootDomain}:5173/schoolLogin`;
    // }
  }, []);
};

export default useAuthMiddleware;
