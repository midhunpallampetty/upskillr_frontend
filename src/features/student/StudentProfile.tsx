import React, { useState, useEffect } from 'react';
import { LogOut, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentNavbar from './components/Layout/StudentNavbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import useStudentAuthGuard from './hooks/useStudentAuthGuard';
import { getStudentById, updateStudentById } from './api/student.api';
import { uploadToCloudinary } from '../school/api/school.api';
interface UpdateStudentPayload {
  fullName: string;
  email: string;
  image: string;
  currentPassword?: string;  // Optional, since it's only sent if provided
  newPassword?: string;      // Optional, since it's only sent if provided
}

const StudentProfilePage = () => {
  useStudentAuthGuard();
  const [editMode, setEditMode] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [student, setStudent] = useState({
    _id: '',
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    image: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const dummyCourses = [
    { title: 'JavaScript Basics', school: 'Orange School', duration: '4 Weeks' },
    { title: 'Python for Beginners', school: 'Golden Public School', duration: '6 Weeks' },
  ];

  useEffect(() => {
    const cookieData = Cookies.get('student');
    if (cookieData) {
      const parsed = JSON.parse(cookieData);
      const id = parsed._id;

      const fetchStudent = async () => {
        try {
          const student = await getStudentById(id);
          setStudent({
            _id: student._id,
            fullName: student.fullName,
            email: student.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            image: student.image || '',
          });
          setImagePreview(student.image || null);
        } catch (error) {
          console.error('Failed to fetch student', error);
          toast.error('Failed to load profile');
        }
      };


      fetchStudent();
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
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          image: parsed.image || '',
        });
        setImagePreview(parsed.image || null);
      } catch (err) {
        console.error('Error parsing student from localStorage:', err);
      }
    }
  }, []);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
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




  const toggleShowPassword = (field) => {
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

  // Only validate passwords if any password field is filled
  if (student.currentPassword || student.newPassword || student.confirmPassword) {
    if (!student.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!validatePassword(student.newPassword)) {
      toast.error("New password must be at least 8 characters long and contain at least one letter, one number, and one special character");
      return;
    }
    if (student.newPassword !== student.confirmPassword) {
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
    if (student.currentPassword && student.newPassword) {
      payload.currentPassword = student.currentPassword;
      payload.newPassword = student.newPassword;
    }

    await updateStudentById(student._id, payload);

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
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
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

  return (
    <>
      <StudentNavbar student={student} handleLogout={handleLogout} />

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
                    value={student.currentPassword}
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
                    value={student.newPassword}
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
                    value={student.confirmPassword}
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
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
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