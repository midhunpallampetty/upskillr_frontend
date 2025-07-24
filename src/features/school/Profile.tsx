import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { School } from './types/School';
import { getSchoolByDomain, updateSchoolData, uploadToCloudinary } from './api/school.api';
import Swal from 'sweetalert2';
import useSchoolAuthGuard from './hooks/useSchoolAuthGuard';

const SchoolProfilePage = () => {
    useSchoolAuthGuard();

  const [school, setSchool] = useState<School | null>(null);
  const [form, setForm] = useState<Partial<School>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const cookieData = Cookies.get('schoolData');
    if (cookieData) {
      const parsed = JSON.parse(cookieData);
      const subDomain = parsed.subDomain;

      getSchoolByDomain(subDomain)
        .then((res) => {
          const schoolData = res.school;
          setSchool(schoolData);
          setForm({
            name: schoolData.name,
            email: schoolData.email,
            experience: schoolData.experience,
            address: schoolData.address,
            officialContact: schoolData.officialContact,
            image: schoolData.image,
            coverImage: schoolData.coverImage,
          });
        })
        .catch(() => toast.error('Failed to fetch school data'));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleUpdate = async () => {
  setIsUpdating(true);

  try {
    const payload: any = {
      ...form,
      _id: school?._id,
    };

    if (imageFile) {
      payload.image = await uploadToCloudinary(imageFile);
    }

    if (coverFile) {
      payload.coverImage = await uploadToCloudinary(coverFile);
    }

    await updateSchoolData(payload);

    Swal.fire({
      icon: 'success',
      title: 'Profile Updated',
      text: 'Your school profile has been updated successfully!',
      confirmButtonColor: '#3085d6',
    });
  } catch {
    toast.error('Update failed. Try again!');
  } finally {
    setIsUpdating(false);
  }
};


  const handleLogout = () => {
    Cookies.remove('schoolData');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('dbname');
    navigate('/schoolLogin');
  };

  if (!school) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />

      {/* Cover Image Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 relative">
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverPreview || form.coverImage})` }}
        >
          <div className="h-full w-full bg-black/30 flex items-center justify-between px-6 text-white">
            <div>
              <h1 className="text-2xl font-bold">Edit School Profile</h1>
              <p>Manage your details here</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-sm px-4 py-2 rounded shadow"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="p-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCoverFile(file);
                setCoverPreview(URL.createObjectURL(file));
              }
            }}
            className="text-sm"
          />
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={imagePreview || form.image}
              alt="School Logo"
              className="w-20 h-20 rounded-full border-2 border-gray-300 shadow object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="text-xs mt-1"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{form.name}</h2>
            <p className="text-sm text-gray-500">{school.subDomain}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'School Name', name: 'name' },
            { label: 'Email', name: 'email' },
            { label: 'Experience', name: 'experience' },
            { label: 'Address', name: 'address' },
            { label: 'Official Contact', name: 'officialContact' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="text-sm text-gray-600">{label}</label>
              <input
                type="text"
                name={name}
                value={(form as any)[name] || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleUpdate}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default SchoolProfilePage;
