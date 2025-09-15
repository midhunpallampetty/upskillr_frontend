import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { getDynamicDomain, getSubdomain } from './utils/getSubdomain';
import AppRouter from './routes/AppRouter';

const App: React.FC = () => {
  const subdomain = getSubdomain();
  const dynamicSubdomain = getDynamicDomain();
  
  // if subdomain exists (not www or root domain), pass it to AppRouter
  const isSubdomain = dynamicSubdomain && dynamicSubdomain !== "www";

  return (
    <Router>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <AppRouter subdomain={isSubdomain ? subdomain : null} />
      </Suspense>
    </Router>
  );
};

export default App;
