// __tests__/admin/AdminAuth.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminAuth from '../../features/admin/AdminAuth';
import { BrowserRouter } from 'react-router-dom';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('AdminAuth Component (stable tests only)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <AdminAuth />
      </BrowserRouter>
    );

  test('renders login form correctly', () => {
    renderComponent();

    expect(screen.getByText(/Administrator Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@upskillr.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Access Dashboard/i })
    ).toBeInTheDocument();
  });

  test('updates input fields correctly', () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/admin@upskillr.com/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

    expect((emailInput as HTMLInputElement).value).toBe('test@email.com');
    expect((passwordInput as HTMLInputElement).value).toBe('mypassword');
  });
});
