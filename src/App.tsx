import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getDynamicDomain, getSubdomain } from './utils/getSubdomain';
import AppRouter from './routes/AppRouter';
import MarketingPage from './features/school/MarketingPage'; // make sure this path is correct

const App: React.FC = () => {
  const subdomain = getSubdomain();
  const rootDomain = "eduvia.space"; // change to your domain
const dynamicSubdomain = getDynamicDomain();
  // if subdomain exists (not www or root domain), show MarketingPage
  const isSubdomain = dynamicSubdomain && dynamicSubdomain !== "www";

  return (
    <Router>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <Routes>
          {isSubdomain ? (
            <Route path="/*" element={<MarketingPage />} />
          ) : (
            <Route path="/*" element={<AppRouter subdomain={subdomain} />} />
          )}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
