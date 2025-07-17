// components/AddVideoToSectionWrapper.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import AddVideoToSection from '../../AddVideoPage';

const AddVideoToSectionWrapper: React.FC = () => {
  const { sectionId, verifiedSchool } = useParams();

  if (!sectionId || !verifiedSchool) {
    return <p className="text-center text-red-500 mt-10">Invalid URL parameters.</p>;
  }

  return (
    <AddVideoToSection
      sectionId={sectionId}
      schoolDb={verifiedSchool}
    />
  );
};

export default AddVideoToSectionWrapper;
