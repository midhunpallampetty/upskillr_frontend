import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const HOC: React.FC = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = Cookies.get('studentAccessToken');
      if (token) {
        // already logged in, don’t show login page
        navigate('/studenthome');
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

export default withAuth;
