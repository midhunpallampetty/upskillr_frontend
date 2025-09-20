import React, { useState, useEffect } from 'react';
import { LogOut, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import useStudentAuthGuard from './hooks/useStudentAuthGuard';
import { getStudentById, updateStudentById } from './api/student.api';
import { uploadToCloudinary } from '../school/api/school.api';
import SchoolMarketingNavbar from '../student/components/Layout/StudentNavbar'; // Adjust import path to match your project structure (using SchoolMarketingNavbar as in MarketingPage)
import { getSchoolBySubdomain } from '../school/api/school.api'; // Import from MarketingPage

interface UpdateStudentPayload {
  fullName: string;
  email: string;
  image: string;
  currentPassword?: string;  // Optional, since it's only sent if provided
  newPassword?: string;      // Optional, since it's only sent if provided
}

// Interface for Student (from MarketingPage)
interface Student {
  _id: string;
  fullName?: string;
  email: string;
  image: string;
  // Add other fields as needed
}

// Embedded utility function to extract subdomain (from MarketingPage, similar to getSchoolNameFromUrl)
const getSubdomain = (url: string = window.location.href): string => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[parts.length - 2] === 'eduvia' && parts[parts.length - 1] === 'space') {
      return parts.slice(0, -2).join('.');
    }
    return '';
  } catch (error) {
    console.error('Error extracting subdomain:', error);
    return '';
  }
};

const StudentProfilePage = () => {
  useStudentAuthGuard();
  const [editMode, setEditMode] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [student, setStudent] = useState<Student>({
    _id: '',
    fullName: '',
    email: '',
    image: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const dummyCourses = [
    { title: 'JavaScript Basics', school: 'Orange School', duration: '4 Weeks' },
    { title: 'Python for Beginners', school: 'Golden Public School', duration: '6 Weeks' },
  ];

  // States from MarketingPage
  const [schoolData, setSchoolData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    foundedYear: '',
    studentsGraduated: '',
    successRate: '',
    subDomain: '', // Note: This is 'subDomain' to match API casing, but we'll use 'subdomain' for consistency
    experience: '',
    image: '',
    coverImage: '',
    coursesOffered: [] // Keep empty initially; will be set from API
  });

  // New state for subdomain (computed once on mount)
  const [subdomain, setSubdomain] = useState<string>(getSubdomain());

  // State to check if user is logged in (since using useStudentAuthGuard, assume true)
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to true due to auth guard

  // Function to extract schoolName from the current URL (e.g., gamersclub from gamersclub.eduvia.space)
  const getSchoolNameFromUrl = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    // Assuming the base domain is 'eduvia.space', the subdomain is the first part if present
    return parts.length > 2 ? parts[0] : '';
  };

  useEffect(() => {
    const cookieData = Cookies.get('student');
    if (cookieData) {
      const parsed = JSON.parse(cookieData);
      const id = parsed._id;
      const schoolName = getSchoolNameFromUrl(); // Dynamically get schoolName from URL

      const fetchStudent = async () => {
        try {
          const fetchedStudent = await getStudentById(id, schoolName); // Adjusted order to match API definition
          setStudent({
            _id: fetchedStudent._id,
            fullName: fetchedStudent.fullName,
            email: fetchedStudent.email,
            image: fetchedStudent.image || '',
          });
          setImagePreview(fetchedStudent.image || null);
        } catch (error) {
          console.error('Failed to fetch student', error);
          toast.error('Failed to load profile');
        }
      };

      if (schoolName) {
        fetchStudent();
      } else {
        toast.error('Unable to determine school name from URL');
      }
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('student');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStudent({
          _id: parsed._id || '',
          fullName: parsed.fullName || '',
          email: parsed.email || '',
          image: parsed.image || '',
        });
        setImagePreview(parsed.image || null);
      } catch (err) {
        console.error('Error parsing student from localStorage:', err);
      }
    }
  }, []);

  // Fetch school data based on subdomain (from MarketingPage)
  useEffect(() => {
    if (subdomain) {
      const fetchSchoolData = async () => {
        try {
          // Replace with actual token retrieval (e.g., from auth context, localStorage, etc.)
          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NGQ4YjI5NDRhMzg4N2E4MjJkNTg2YiIsImVtYWlsIjoieWljZXdhYjkzOUBsaXRlcGF4LmNvbSIsInJvbGUiOiJzY2hvb2wiLCJzdWJEb21haW4iOiJodHRwOi8vZ2FtZXJzY2x1Yi5lZHV2aWEuc3BhY2UiLCJpYXQiOjE3NTU5NjMyMjUsImV4cCI6MTc1NTk2MzI4NX0.1GcqFwkWRABUA6RvFdNjTZaRZHCQY-djW8SIeslT4es'; // Implement proper token handling
          console.log(subdomain, 'subdomain');

          const response = await getSchoolBySubdomain(subdomain, token);
          console.log(response.data.school, 'response');

          const data = response.data.school; // Adjust based on axios response structure

          // Check if school data exists; if not, redirect
          if (!data) {
            window.location.href = 'https://eduvia.space';
            return;
          }

          const updatedData = {
            id: data._id || '',
            name: data.name || '',
            email: data.email || '',
            phone: data.officialContact || '',
            address: data.address || '',
            description: data.description || '', // If not provided by API, remains empty
            foundedYear: data.createdAt ? new Date(data.createdAt).getFullYear().toString() : '',
            studentsGraduated: data.studentsGraduated || '', // If not provided, empty
            successRate: data.successRate || '', // If not provided, empty
            experience: data.experience || '',
            image: data.image || '',
            subDomain: data.subDomain || '', // API provides 'subDomain'
            coverImage: data.coverImage || '',
            coursesOffered: [] // Initialize empty; will be updated if needed
          };

          setSchoolData(updatedData);
          console.log(updatedData, 'data'); // Log after setting state (note: state update is async, use callback if needed for immediate logging)
        } catch (error) {
          console.error('Error fetching school data:', error);
          // Optionally handle error by redirecting as well
          window.location.href = 'https://eduvia.space';
        }
      };
      fetchSchoolData();
    } else {
      // If no subdomain, redirect
      window.location.href = 'https://eduvia.space';
    }
  }, [subdomain]); // Depend on subdomain state

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setIsImageUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        setStudent((prev) => ({ ...prev, image: url }));
      } catch (err) {
        toast.error("Image upload failed!");
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  const toggleShowPassword = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async () => {
    if (isImageUploading) {
      toast.warning("Please wait for image to finish uploading...");
      return;
    }

    const tempStudent = { ...student, currentPassword: '', newPassword: '', confirmPassword: '' }; // Temporary to avoid TS errors, adjust as needed

    // Only validate passwords if any password field is filled
    if (tempStudent.currentPassword || tempStudent.newPassword || tempStudent.confirmPassword) {
      if (!tempStudent.currentPassword) {
        toast.error("Please enter your current password");
        return;
      }
      if (!validatePassword(tempStudent.newPassword)) {
        toast.error("New password must be at least 8 characters long and contain at least one letter, one number, and one special character");
        return;
      }
      if (tempStudent.newPassword !== tempStudent.confirmPassword) {
        toast.error("New password and confirm password must match");
        return;
      }
    }

    try {
      // Explicitly type payload with the interface
      const payload: UpdateStudentPayload = {
        fullName: student.fullName,
        email: student.email,
        image: student.image,
      };

      // Only include password fields if they are filled
      if (tempStudent.currentPassword && tempStudent.newPassword) {
        payload.currentPassword = tempStudent.currentPassword;
        payload.newPassword = tempStudent.newPassword;
      }

      const schoolName = getSchoolNameFromUrl(); // Dynamically get schoolName from URL
      if (!schoolName) {
        toast.error('Unable to determine school name from URL');
        return;
      }

      await updateStudentById(student._id, payload, schoolName);

      toast.success('Profile updated!');
      setEditMode(false);

      // Update localStorage
      localStorage.setItem('student', JSON.stringify({
        _id: student._id,
        fullName: student.fullName,
        email: student.email,
        image: student.image,
      }));

      // Reset password fields
      setStudent((prev) => ({
        ...prev,
        // currentPassword: '', // Comment out or remove unused fields
        // newPassword: '',
        // confirmPassword: '',
      }));
    } catch (error) {
      toast.error('Update failed. Try again!');
    }
  };

  const handleLogout = () => {
    Cookies.remove('studentAccessToken');
    Cookies.remove('studentRefreshToken');
    Cookies.remove('student');
    Cookies.remove('dbname');
    toast.info('Logged out!');
    navigate('/studentLogin');
  };

  const handleLogin = () => {
    // Redirect to login page
    window.location.href = '/studentLogin'; // Adjust the login URL as needed
  };

  return (
    <>
      {/* Navbar (updated to use SchoolMarketingNavbar with all props from MarketingPage) */}
      <div className="shadow bg-white sticky top-0 z-50">
        <SchoolMarketingNavbar 
          schoolData={schoolData} 
          subdomain={subdomain} 
          student={student} 
          isLoggedIn={isLoggedIn} 
          handleLogout={handleLogout} 
          handleLogin={handleLogin} 
        />
      </div>

      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-10 px-6 text-center">
        <h2 className="text-3xl font-bold">Welcome to Your Learning Profile</h2>
        <p className="mt-2 text-sm">Manage your profile and see your learning journey!</p>
      </section>

      <main className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">Profile Details</h3>

        <div className="flex gap-6">
          <div className="w-32 h-32 relative">
            <img
              src={student.image || 'https://as1.ftcdn.net/jpg/01/68/80/20/1000_F_168802075_Il6LeUG0NCK4JOELmkC7Ki81g0CiLpxU.jpg'}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-purple-400"
              onError={(e) => {
                e.currentTarget.src = 'https://as1.ftcdn.net/jpg/01/68/80/20/1000_F_168802075_Il6LeUG0NCK4JOELmkC7Ki81g0CiLpxU.jpg';
              }}
            />

            {editMode && (
              <input
                type="file"
                accept="image/*"
                className="absolute bottom-0 left-0 w-full opacity-70"
                onChange={handleImageChange}
              />
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-gray-600 font-medium">Name</label>
              <input
                type="text"
                name="fullName"
                value={student.fullName}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={student.email}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            {editMode && (
              <>
                <div className="relative">
                  <label className="block text-gray-600 font-medium">Current Password</label>
                  <input
                    type={showPasswords.currentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    // value={student.currentPassword} // Comment out unused
                    onChange={handleChange}
                    placeholder="Enter current password (optional)"
                    className="w-full border border-gray-300 rounded p-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('currentPassword')}
                    className="absolute right-2 top-9 text-gray-600"
                  >
                    {showPasswords.currentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-gray-600 font-medium">New Password</label>
                  <input
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    name="newPassword"
                    // value={student.newPassword} // Comment out unused
                    onChange={handleChange}
                    placeholder="Enter new password (optional)"
                    className="w-full border border-gray-300 rounded p-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('newPassword')}
                    className="absolute right-2 top-9 text-gray-600"
                  >
                    {showPasswords.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-gray-600 font-medium">Confirm New Password</label>
                  <input
                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    // value={student.confirmPassword} // Comment out unused
                    onChange={handleChange}
                    placeholder="Confirm new password (optional)"
                    className="w-full border border-gray-300 rounded p-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('confirmPassword')}
                    className="absolute right-2 top-9 text-gray-600"
                  >
                    {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </>
            )}

            <div className="flex gap-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className={`px-4 py-2 rounded text-white ${isImageUploading ? 'bg-gray-400' : 'bg-purple-600'}`}
                    disabled={isImageUploading}
                  >
                    {isImageUploading ? 'Uploading...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setStudent((prev) => ({
                        ...prev,
                        // currentPassword: '', // Comment out unused
                        // newPassword: '',
                        // confirmPassword: '',
                      }));
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Purchased Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dummyCourses.map((course, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="text-lg font-semibold text-purple-700">{course.title}</div>
                <div className="text-sm text-gray-600">{course.school}</div>
                <div className="text-xs text-gray-500">{course.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <ToastContainer />
    </>
  );
};

export default StudentProfilePage;
