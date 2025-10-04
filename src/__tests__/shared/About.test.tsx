// __tests__/About.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '../../features/shared/About';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

describe('About Page', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

  test('renders main headings', () => {
    renderComponent();
    expect(screen.getByText(/About Upskillr/i)).toBeInTheDocument();
    expect(screen.getByText(/The Ultimate Online Teaching Platform for Schools/i)).toBeInTheDocument();
  });

  test('renders description paragraph', () => {
    renderComponent();
    expect(
      screen.getByText(/Upskillr empowers schools, teachers, and students/i)
    ).toBeInTheDocument();
  });
});
