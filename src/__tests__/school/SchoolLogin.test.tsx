// __tests__/SchoolLogin.test.tsx
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import SchoolLogin from '../../features/school/schoolLogin';

const mockedNavigate = jest.fn();
let mockedLocationState: any = null;

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedNavigate,
  useLocation: () => ({
    state: mockedLocationState,
  }),
}));

describe('SchoolLogin (stable tests only)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedLocationState = null;
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <SchoolLogin />
      </BrowserRouter>
    );

  test('renders login form correctly', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getAllByText(/sign in/i).length).toBeGreaterThan(0);
  });

  test('toggles password visibility', () => {
    renderComponent();
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleButton = screen.getByText('👁️');

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('navigates to forgot password and register pages', () => {
    renderComponent();
    fireEvent.click(screen.getByText(/forgot password/i));
    fireEvent.click(screen.getByText(/register here/i));
    expect(mockedNavigate).toHaveBeenCalled();
  });

  test('shows registration success message when navigated from registration', () => {
    mockedLocationState = { fromRegistration: true };
    renderComponent();
    expect(
      screen.getByText(/✅ Registration completed successfully!/i)
    ).toBeInTheDocument();
  });
});
