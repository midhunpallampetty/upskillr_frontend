import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddCoursePage from '../features/course/AddCoursePage';
import axios from 'axios';
import '@testing-library/jest-dom';
import Cookies from 'js-cookie';

// Mock cookies
jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AddCoursePage', () => {
  beforeEach(() => {
    // Mock Cookie values
    (Cookies.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'dbname') return 'mockSchool';
      if (key === 'schoolData') return JSON.stringify({ _id: 'school123' });
      return '';
    });
  });

  it('renders all form fields', () => {
    render(<AddCoursePage />);

    expect(screen.getByLabelText(/course name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/is preliminary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/course thumbnail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of lessons/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/course fee/i)).toBeInTheDocument();
    expect(screen.getByText(/add section/i)).toBeInTheDocument();
  });

  it('adds a course with mocked image and API calls', async () => {
    // Mock image file
    const mockImage = new File(['dummy content'], 'thumbnail.png', {
      type: 'image/png',
    });

    // Mock Cloudinary upload
    mockedAxios.post.mockResolvedValueOnce({
      data: { secure_url: 'https://mock-image.com/image.jpg' },
    });

    // Mock course add API
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, message: 'Course added' },
    });

    render(<AddCoursePage />);

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/course name/i), {
      target: { value: 'React Testing 101' },
    });

    fireEvent.change(screen.getByLabelText(/number of lessons/i), {
      target: { value: 10 },
    });

    fireEvent.change(screen.getByLabelText(/course fee/i), {
      target: { value: 500 },
    });

    // Upload image
    const thumbnailInput = screen.getByLabelText(/course thumbnail/i);
    fireEvent.change(thumbnailInput, {
      target: { files: [mockImage] },
    });

    // Change section title
    const sectionInput = screen.getByPlaceholderText(/section 1/i);
    fireEvent.change(sectionInput, { target: { value: 'Introduction' } });

    // Submit form
    fireEvent.click(screen.getByText(/submit course/i));

    // Wait for API call
    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/school/mockSchool/add-course'),
        expect.objectContaining({
          courseName: 'React Testing 101',
          isPreliminaryRequired: false,
          courseThumbnail: 'https://mock-image.com/image.jpg',
          noOfLessons: 10,
          fee: 500,
          sections: [{ title: 'Introduction' }],
          forum: null,
          school: 'school123',
        })
      )
    );
  });

  it('shows error if schoolData is missing', async () => {
    (Cookies.get as jest.Mock).mockImplementation(() => '');

    render(<AddCoursePage />);
    fireEvent.click(screen.getByText(/submit course/i));

    await waitFor(() =>
      expect(screen.getByText(/school data missing/i)).toBeInTheDocument()
    );
  });
});
