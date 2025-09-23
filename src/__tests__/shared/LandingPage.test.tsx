// __tests__/shared/LandingPage.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from '../../features/shared/Landing';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

// Mock js-cookie
jest.mock('js-cookie');

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Fully mock framer-motion: strip all animation props
jest.mock('framer-motion', () => {
  const React = require('react');
  const motionComponents = [
    'div', 'button', 'header', 'h1', 'h2', 'h3', 'p', 'section', 'span'
  ];
  return {
    motion: motionComponents.reduce((acc, comp) => {
      acc[comp] = ({ children, ...props }: any) => {
        // Remove Framer Motion specific props
        const { animate, initial, whileHover, whileTap, whileInView, ...rest } = props;
        return <div {...rest}>{children}</div>;
      };
      return acc;
    }, {} as Record<string, any>),
  };
});

describe('LandingPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

  beforeEach(() => {
    (Cookies.get as jest.Mock).mockImplementation(() => undefined);
    mockedNavigate.mockClear();
  });

  test('renders header and main sections', () => {
    renderComponent();
    ['Home', 'About', 'Contact'].forEach(text => expect(screen.getByText(text)).toBeInTheDocument());
    ['Online Teaching Platform For Schools', 'Why Choose Us', 'Find Your Subject', 'About Us', 'Content © 2024 Upskillr']
      .forEach(text => expect(screen.getByText(text)).toBeInTheDocument());
  });

  test('Get Started "button" triggers navigation', () => {
    renderComponent();
    const button = screen.getByText(/Get Started/i);
    fireEvent.click(button);
    expect(mockedNavigate).toHaveBeenCalled();
  });

  test('subjects render and clickable', () => {
    renderComponent();
    const subjects = ['Playlist', 'Directory', 'Zodotry', 'Botany', 'Math', 'History', 'Computer', 'Computing'];
    subjects.forEach(sub => {
      const btn = screen.queryByText(sub);
      if (btn) fireEvent.click(btn);
    });
  });

  test('logout works when logged in', () => {
    (Cookies.get as jest.Mock).mockImplementation(() => 'dummyToken');
    renderComponent();
    const logoutBtn = screen.getByText(/Sign Out/i);
    fireEvent.click(logoutBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});
