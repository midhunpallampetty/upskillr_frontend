// __tests__/LoginSelection.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginSelection from '../../features/shared/LoginSelection'; // adjust the path
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

describe('LoginSelection Page', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <LoginSelection />
      </BrowserRouter>
    );

  test('renders main headings and login options', () => {
    renderComponent();

    // Check main heading
    expect(screen.getByText(/Upskillr/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose your login type/i)).toBeInTheDocument();

    // Check Student Login option
    expect(screen.getByText(/Student Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Access courses, exams, and learning material/i)).toBeInTheDocument();

    // Check School Login option
    expect(screen.getByText(/School Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage courses, track students, and view reports/i)).toBeInTheDocument();
  });
});
