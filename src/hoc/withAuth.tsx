import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthComponent = (props: any) => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = Cookies.get('studentAccessToken');
      if (token) {
        // Already authenticated, redirect to home based on domain/subdomain
        const hostname = window.location.hostname;
        const domain = 'eduvia.space';
        const parts = hostname.split('.');
        const isMainDomain = hostname === domain || hostname === 'www.' + domain;

        if (!isMainDomain && hostname.endsWith(domain) && parts.length > 2) {
          // Subdomain case
          const subdomain = parts.slice(0, parts.length - 2).join('.');
          window.location.href = `https://${subdomain}.${domain}/school/${subdomain}/home`;
        } else {
          // Main domain case
          window.location.href = `https://www.${domain}/studenthome`;
        }
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
