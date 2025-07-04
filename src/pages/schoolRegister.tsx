import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const CLOUD_NAME = 'dgnjzuwqu';
const UPLOAD_PRESET = 'upskillr';

const SchoolRegister = () => {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    schoolName: '',
    experience: '',
    coursesOffered: '',
    address: '',
    officialContact: '',
    image: '',
    coverImage: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files) setImageFile(files[0]);
    else if (name === 'coverImage' && files) setCoverImageFile(files[0]);
    else setFormData({ ...formData, [name]: value });
  };

  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data);
    return res.data.secure_url;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '';
      let coverImageUrl = '';

      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);
      if (coverImageFile) coverImageUrl = await uploadToCloudinary(coverImageFile);

      const res = await axios.post('http://school.localhost:5000/api/register', {
        ...formData,
        image: imageUrl,
        coverImage: coverImageUrl,
        coursesOffered: formData.coursesOffered.split(','),
      });

      setMessage(`✅ Registered! Your temp email: ${res.data.school.email}, password: ${res.data.school.tempPassword}`);
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.msg || 'Registration failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-blue-800">
      <div className="bg-white flex w-[900px] rounded-lg overflow-hidden shadow-lg">
        <form onSubmit={handleRegister} className="flex-1 p-10">
          <h2 className="text-3xl font-bold mb-4">School Registration</h2>
          <p className="mb-6 text-sm text-gray-500">Join the Upskillr Network!</p>

          {['schoolName', 'experience', 'coursesOffered', 'address', 'officialContact'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.split(/(?=[A-Z])/).join(' ')}
              onChange={handleChange}
              className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          ))}

          {/* File Inputs */}
          <label className="block mb-2 text-sm text-gray-600">School Logo/Image</label>
          <input type="file" name="image" onChange={handleChange} className="mb-4" accept="image/*" />

          <label className="block mb-2 text-sm text-gray-600">Cover Image</label>
          <input type="file" name="coverImage" onChange={handleChange} className="mb-4" accept="image/*" />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already Registered?{' '}
            <button
              type="button"
              onClick={() => navigate('/schoolLogin')}
              className="text-blue-600 hover:underline"
            >
              Login here
            </button>
          </p>
          {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
        </form>

        <div className="flex-1 bg-blue-500 flex items-center justify-center">
          <img src="/schools.png" alt="illustration" className="w-80 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

export default SchoolRegister;
