// New component: ViewRenderer.tsx
import React, { useReducer } from 'react';
import { viewReducer, type ViewState } from '../../reducers/ViewReducer';

interface ViewRendererProps {
  initialView: ViewState;
  renderDashboard: () => React.ReactNode;
  renderStudents: (schoolData: any) => React.ReactNode; // Adjust type based on your School type
}

const ViewRenderer: React.FC<ViewRendererProps> = ({ initialView, renderDashboard, renderStudents }) => {
  const [activeView, dispatchView] = useReducer(viewReducer, initialView);

  return (
    <>
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'students' && renderStudents(/* pass props like schoolData */)}
    </>
  );
};

export default ViewRenderer;
