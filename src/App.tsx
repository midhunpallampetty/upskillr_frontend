import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { getSubdomain } from './utils/getSubdomain';
import AppRouter from './routes/AppRouter';

const App: React.FC = () => {
  const subdomain = getSubdomain();
  
  return (
    <Router>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <AppRouter subdomain={subdomain} />
      </Suspense>
    </Router>
  );
};

export default App;

