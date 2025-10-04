// __tests__/SignupSelection.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import SignupSelection from '../../features/shared/SignupSelection'; // adjust the path
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

describe('SignupSelection Page', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <SignupSelection />
      </BrowserRouter>
    );

  test('renders main headings and registration options', () => {
    renderComponent();

    // Check main heading
    expect(screen.getByText(/Upskillr/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose your login type/i)).toBeInTheDocument();

    // Check Student Register option
    expect(screen.getByText(/Student Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Access courses, exams, and learning material/i)).toBeInTheDocument();

    // Check School Register option
    expect(screen.getByText(/School Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage courses, track students, and view reports/i)).toBeInTheDocument();
  });
});
