import React, { useState, useEffect } from 'react';
import { LogOut, GraduationCap } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentNavbar from './components/StudentNavbar';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [studentData,setStudentData]=useState()
  const [student, setStudent] = useState({
    _id: '',
    fullName: '',
    email: '',
    password: '',
    image: '',
  });
useEffect(() => {
  const stored = localStorage.getItem('student');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      setStudent({
        _id: parsed._id || '',
        fullName: parsed.fullName || '',
        email: parsed.email || '',
        password: '',
        image: parsed.image || '',
      });
      setImagePreview(parsed.image || null);
    } catch (err) {
      console.error('Error parsing student from localStorage:', err);
    }
  }
}, []);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const dummyCourses = [
    { title: 'JavaScript Basics', school: 'Orange School', duration: '4 Weeks' },
    { title: 'Python for Beginners', school: 'Golden Public School', duration: '6 Weeks' },
  ];

  useEffect(() => {
    const studentData = Cookies.get('student');
    if (studentData) {
      const parsed = JSON.parse(studentData);
      setStudent({
        _id: parsed._id || '',
        fullName: parsed.fullName || '',
        email: parsed.email || '',
        password: '',
        image: parsed.image || '',
      });
      setImagePreview(parsed.image || null);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      uploadToCloudinary(file).then((url) => {
        setStudent((prev) => ({ ...prev, image: url }));
      });
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'upskillr');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dgnjzuwqu/image/upload`,
        formData
      );
      console.log("response.data.secure_url",response.data.secure_url )
      return response.data.secure_url;
    } catch (error) {
      toast.error('Image upload failed!');
      throw error;
    }
  };

  const handleSave = async () => {
    console.log(student.image,'image')
    try {
      const payload = {
        fullName: student.fullName,
        email: student.email,
        ...(student.password && { password: student.password }),
        image: student.image,
      };

      await axios.put(
        `http://student.localhost:5000/api/students/${student._id}`,
        payload
      );
      toast.success('Profile updated!');
      setEditMode(false);

      // Update cookies with new student data
      localStorage.setItem('student', JSON.stringify({
        _id: student._id,
        fullName: student.fullName,
        email: student.email,
        image: student.image,
      }));
      localStorage.setItem('image', JSON.stringify(student.image))
    } catch (error) {
      toast.error('Update failed. Try again!');
    }
  };

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('student');
    Cookies.remove('dbname');
    toast.info('Logged out!');
    navigate('/studentLogin');
  };

  return (
    <>
      {/* Navbar */}
      <StudentNavbar student={student} handleLogout={handleLogout} />

      {/* Banner */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-10 px-6 text-center">
        <h2 className="text-3xl font-bold">Welcome to Your Learning Profile</h2>
        <p className="mt-2 text-sm">Manage your profile and see your learning journey!</p>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">Profile Details</h3>

        <div className="flex gap-6">
          <div className="w-32 h-32 relative">
            <img
              src={imagePreview || student.image || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-purple-400"
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

            <div>
              <label className="block text-gray-600 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={student.password}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Change password"
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <div className="flex gap-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
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

        {/* Purchased Courses */}
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