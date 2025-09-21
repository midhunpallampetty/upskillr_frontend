// ViewRenderer.tsx
import React, { useReducer } from 'react';
import { viewReducer ,type ViewState } from '../../reducers/ViewReducer'; // Adjust path as needed

interface ViewRendererProps {
  initialView: ViewState;
  renderDashboard: (dispatchView: React.Dispatch<any>) => React.ReactNode; // Pass dispatchView
  renderStudents: (dispatchView: React.Dispatch<any>) => React.ReactNode; // No schoolData param; pass dispatchView
}

const ViewRenderer: React.FC<ViewRendererProps> = ({ initialView, renderDashboard, renderStudents }) => {
  const [activeView, dispatchView] = useReducer(viewReducer, initialView);

  return (
    <>
      {activeView === 'dashboard' && renderDashboard(dispatchView)}
      {activeView === 'students' && renderStudents(dispatchView)}
    </>
  );
};

export default ViewRenderer;
