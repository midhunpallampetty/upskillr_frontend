import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerSchool, uploadToCloudinary } from '../../api/school';

const LoadingButton = lazy(() => import('../shared/components/Loader'));

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

const SchoolRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    schoolName: '',
    experience: '',
    coursesOffered: '',
    address: '',
    officialContact: '',
    image: '',
    coverImage: '',
    email: '',
    password: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const clearFieldError = (field: string) => {
    setTimeout(() => {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setFieldErrors((prev) => ({ ...prev, image: '❌ Logo must be an image file' }));
        clearFieldError('image');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFieldErrors((prev) => ({ ...prev, image: '❌ Logo must be less than 2MB' }));
        clearFieldError('image');
        return;
      }
      setImageFile(file);
      setFieldErrors((prev) => ({ ...prev, image: '' }));
    } else if (name === 'coverImage' && files) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setFieldErrors((prev) => ({ ...prev, coverImage: '❌ Cover must be an image file' }));
        clearFieldError('coverImage');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFieldErrors((prev) => ({ ...prev, coverImage: '❌ Cover must be less than 2MB' }));
        clearFieldError('coverImage');
        return;
      }
      setCoverImageFile(file);
      setFieldErrors((prev) => ({ ...prev, coverImage: '' }));
    } else {
      setFormData({ ...formData, [name]: value });
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateFields = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.schoolName.trim()) errors.schoolName = 'School name is required';
    if (!formData.experience.trim()) errors.experience = 'Experience is required';
    if (!formData.coursesOffered.trim()) errors.coursesOffered = 'Courses offered are required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.officialContact.trim()) errors.officialContact = 'Official contact is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password.trim()) errors.password = 'Password is required';
    if (!imageFile) errors.image = 'School logo/image is required';
    if (!coverImageFile) errors.coverImage = 'Cover image is required';

    setFieldErrors(errors);
    Object.keys(errors).forEach((field) => clearFieldError(field));

    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setMessage('');
    if (!validateFields()) return;

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(imageFile!, CLOUD_NAME, UPLOAD_PRESET);
      const coverImageUrl = await uploadToCloudinary(coverImageFile!, CLOUD_NAME, UPLOAD_PRESET);

      await registerSchool({
        ...formData,
        image: imageUrl,
        coverImage: coverImageUrl,
        coursesOffered: formData.coursesOffered.split(',').map((c) => c.trim()),
      });

      setMessage('✅ Registered successfully! You can now log in.');
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
            <div key={field} className="mb-4">
              <input
                name={field}
                placeholder={field.split(/(?=[A-Z])/).join(' ')}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors[field] && <p className="text-sm text-red-600 mt-1">{fieldErrors[field]}</p>}
            </div>
          ))}

          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.email && <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>}
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.password && <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-600">School Logo/Image</label>
            <input type="file" name="image" onChange={handleChange} accept="image/*" />
            {fieldErrors.image && <p className="text-sm text-red-600 mt-1">{fieldErrors.image}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-600">Cover Image</label>
            <input type="file" name="coverImage" onChange={handleChange} accept="image/*" />
            {fieldErrors.coverImage && <p className="text-sm text-red-600 mt-1">{fieldErrors.coverImage}</p>}
          </div>

          {/* ✅ Modular Loading Button */}
          <Suspense fallback={<button className="w-full p-2 bg-blue-500 text-white rounded">Loading...</button>}>
            <LoadingButton isLoading={loading} text="Register" type="submit" />
          </Suspense>

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

          {message && (
            <p className={`mt-4 text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </form>

        <div className="flex-1 bg-blue-500 flex items-center justify-center">
          <img src="/images/schools/schools.png" alt="illustration" className="w-80 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

export default SchoolRegister;
