// __tests__/SchoolLogin.test.tsx
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

// --------------------- MOCKS ---------------------
jest.mock('../../features/school/api/school.api', () => ({
  loginSchool: jest.fn(),
}));

import SchoolLogin from '../../features/school/schoolLogin';
import * as api from '../../features/school/api/school.api';
const mockedLoginSchool = api.loginSchool as jest.MockedFunction<typeof api.loginSchool>;

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedNavigate,
}));

// --------------------- TESTS ---------------------
describe('SchoolLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('schoolData');
    Cookies.remove('dbname');
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

  test('shows success message after login', async () => {
    renderComponent();

    mockedLoginSchool.mockResolvedValue({
      accessToken: 'dummyAccessToken',
      refreshToken: 'dummyRefreshToken',
      dbname: 'dummyDB',
      school: { name: 'Test School', subDomain: 'testschool.eduvia.space' },
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getAllByText(/sign in/i)[1]);

    await waitFor(() => {
      expect(mockedLoginSchool).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(screen.getByText(/✅ Welcome Test School/i)).toBeInTheDocument();
    });
  });

  test('shows error message on failed login', async () => {
    renderComponent();

    mockedLoginSchool.mockRejectedValue({
      response: { data: { msg: 'Invalid credentials' } },
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getAllByText(/sign in/i)[1]);

    await waitFor(() => {
      expect(screen.getByText(/❌ Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
