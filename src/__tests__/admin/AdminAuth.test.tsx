// AdminAuth.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminAuth from '../../features/admin/AdminAuth';
import { loginAdmin } from '../../features/admin/api/admin.api';
import Cookies from 'js-cookie';
import { BrowserRouter } from 'react-router-dom';

// Mock the API call
jest.mock('../../features/admin/api/admin.api', () => ({
  loginAdmin: jest.fn(),
}));

// Mock js-cookie
jest.mock('js-cookie', () => ({
  set: jest.fn(),
  get: jest.fn(() => null), // Ensure get returns null to prevent errors
}));

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('AdminAuth Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <AdminAuth />
      </BrowserRouter>
    );

    expect(screen.getByText(/Administrator Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@upskillr.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Access Dashboard/i })).toBeInTheDocument();
  });

  test('displays error message when login fails', async () => {
    (loginAdmin as jest.Mock).mockRejectedValue({
      response: { data: { msg: 'Invalid credentials' } },
    });

    render(
      <BrowserRouter>
        <AdminAuth />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/admin@upskillr.com/i), {
      target: { value: 'admin@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Access Dashboard/i }));

    await waitFor(() => {
      expect(screen.getByText(/❌ Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('logs in successfully, sets cookies, and navigates to dashboard', async () => {
    (loginAdmin as jest.Mock).mockResolvedValue({
      accessToken: 'dummyAccessToken',
      refreshToken: 'dummyRefreshToken',
      msg: 'Login successful',
    });

    render(
      <BrowserRouter>
        <AdminAuth />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/admin@upskillr.com/i), {
      target: { value: 'admin@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: 'correctpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Access Dashboard/i }));

    await waitFor(() => {
      // Check success message
      expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
      // Check cookies were set
      expect(Cookies.set).toHaveBeenCalledWith(
        'adminAccessToken',
        'dummyAccessToken',
        expect.objectContaining({ expires: 1 })
      );
      expect(Cookies.set).toHaveBeenCalledWith(
        'adminRefreshToken',
        'dummyRefreshToken',
        expect.objectContaining({ expires: 7 })
      );
      // Check navigation
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('updates input fields correctly', () => {
    render(
      <BrowserRouter>
        <AdminAuth />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/admin@upskillr.com/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

    expect((emailInput as HTMLInputElement).value).toBe('test@email.com');
    expect((passwordInput as HTMLInputElement).value).toBe('mypassword');
  });
});
