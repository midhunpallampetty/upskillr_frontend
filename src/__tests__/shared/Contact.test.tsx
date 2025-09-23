// __tests__/Contact.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Contact from '../../features/shared/Contact'; // adjust the path
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

describe('Contact Page', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );

  test('renders main headings correctly', () => {
    renderComponent();
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    expect(screen.getByText(/We're Here to Help with Your Online Teaching Needs/i)).toBeInTheDocument();
  });

  test('renders contact information', () => {
    renderComponent();
    expect(screen.getByText(/📧 Email: support@upskillr.com/i)).toBeInTheDocument();
    expect(screen.getByText(/📞 Phone: \+1 \(123\) 456-7890/i)).toBeInTheDocument();
    expect(screen.getByText(/📍 Address: 123 Education Lane, Tech City, USA/i)).toBeInTheDocument();
  });

  test('renders navigation buttons', () => {
    renderComponent();
    const homeButton = screen.getByRole('link', { name: /🏠 Back to Home/i });
    const forumButton = screen.getByRole('link', { name: /❓ Support Center/i });

    expect(homeButton).toHaveAttribute('href', '/');
    expect(forumButton).toHaveAttribute('href', '/forum');
  });
});
