import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const withAdminAuth = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const navigate = useNavigate();
    const accessToken = Cookies.get('adminAccessToken');

    React.useEffect(() => {
      if (!accessToken) {
        navigate('/admin-login'); // Redirect to your AdminAuth path
      }
    }, [accessToken, navigate]);

    if (!accessToken) {
      return null; // Or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
