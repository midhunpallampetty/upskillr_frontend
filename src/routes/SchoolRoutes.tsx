import React, { lazy } from 'react';

const VerifiedSchoolHome = lazy(() => import('../features/school/VerifiedSchoolHome'));

const SchoolRoutes = () => <VerifiedSchoolHome />;

export default SchoolRoutes;
