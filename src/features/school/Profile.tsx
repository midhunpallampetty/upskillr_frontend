import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { School } from './types/School';
import { getSchoolByDomain, updateSchoolData, uploadToCloudinary } from './api/school.api';
import Swal from 'sweetalert2';
import useSchoolAuthGuard from './hooks/useSchoolAuthGuard';
import { useGlobalState } from '../../context/GlobalState';
import Header from './components/Layout/Header';
import MainContainer from './components/Layout/MainContainer';
import Card from './components/UI/Card';
import Button from './components/UI/Button';
import InputField from './components/UI/InputField';
import ImageUpload from './components/UI//ImageUpload';
import StatusMessage from './components/UI/StatusMessage';
import { 
  Building2, 
  Mail, 
  MapPin, 
  Phone, 
  Calendar, 
  Save, 
  LogOut, 
  ArrowLeft, 
  Upload, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

const SchoolProfilePage = () => {
  useSchoolAuthGuard();
  
  const { isDarkMode } = useGlobalState();
  const [school, setSchool] = useState<School | null>(null);
  const [form, setForm] = useState<Partial<School>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setUploadingImage(true);
        payload.image = await uploadToCloudinary(imageFile);
        setUploadingImage(false);
      }

      if (coverFile) {
        setUploadingCover(true);
        payload.coverImage = await uploadToCloudinary(coverFile);
        setUploadingCover(false);
      }

      await updateSchoolData(payload);

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your school profile has been updated successfully!',
        confirmButtonColor: '#3085d6',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });

      setSchool(prev => prev ? { ...prev, ...payload } : null);
      setImageFile(null);
      setCoverFile(null);
      setImagePreview(null);
      setCoverPreview(null);
      
    } catch {
      toast.error('Update failed. Try again!');
    } finally {
      setIsUpdating(false);
      setUploadingImage(false);
      setUploadingCover(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove('schoolData');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('dbname');
        navigate('/schoolLogin');
      }
    });
  };

  const handleImageUpload = (file: File | null, type: 'image' | 'cover') => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      if (type === 'image') {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
      }
    }
  };

  if (!school) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Loading Profile
          </h2>
          <p className={`text-lg transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Please wait while we fetch your school information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <ToastContainer 
        position="top-right"
        theme={isDarkMode ? 'dark' : 'light'}
        toastClassName={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
      />
      <Header 
        isDarkMode={isDarkMode}
        onBack={() => navigate(-1)}
        onLogout={handleLogout}
        title="School Profile"
        subtitle="Manage your institution details"
      />
      <MainContainer>
        <Card isDarkMode={isDarkMode}>
          <div className="relative">
            <div
              className="h-40 bg-cover bg-center relative overflow-hidden rounded-t-2xl"
              style={{ 
                backgroundImage: `url(${coverPreview || form.coverImage || ''})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <ImageUpload
                isDarkMode={isDarkMode}
                isUploading={uploadingCover}
                onUpload={(file) => handleImageUpload(file, 'cover')}
                label="Change Cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <img
                      src={imagePreview || form.image || ''}
                      alt="School Logo"
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <ImageUpload
                      isDarkMode={isDarkMode}
                      isUploading={uploadingImage}
                      onUpload={(file) => handleImageUpload(file, 'image')}
                      label=""
                      isProfile
                    />
                  </div>
                  <div className="text-white">
                    <h2 className="text-xl font-bold mb-1">{form.name || 'N/A'}</h2>
                    <p className="text-sm text-white/80">@{school?.subDomain || ''}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                School Information
              </h3>
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Update your school's profile information and settings
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'School Name', name: 'name', icon: <Building2 className="w-5 h-5" />, placeholder: 'Enter school name' },
                { label: 'Email Address', name: 'email', icon: <Mail className="w-5 h-5" />, placeholder: 'school@example.com', type: 'email' },
                { label: 'Years of Experience', name: 'experience', icon: <Calendar className="w-5 h-5" />, placeholder: 'e.g., 5 years' },
                { label: 'Address', name: 'address', icon: <MapPin className="w-5 h-5" />, placeholder: 'School address' },
                { label: 'Official Contact', name: 'officialContact', icon: <Phone className="w-5 h-5" />, placeholder: '+1 (555) 123-4567', type: 'tel' },
              ].map(({ label, name, icon, placeholder, type = 'text' }) => (
                <InputField
                  key={name}
                  label={label}
                  name={name}
                  icon={icon}
                  placeholder={placeholder}
                  type={type}
                  value={(form as any)[name] || ''}
                  onChange={handleChange}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleUpdate}
                disabled={isUpdating || uploadingImage || uploadingCover}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Update Profile</span>
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setForm({
                    name: school?.name,
                    email: school?.email,
                    experience: school?.experience,
                    address: school?.address,
                    officialContact: school?.officialContact,
                    image: school?.image,
                    coverImage: school?.coverImage,
                  });
                  setImagePreview(null);
                  setCoverPreview(null);
                  setImageFile(null);
                  setCoverFile(null);
                }}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <AlertCircle className="w-5 h-5" />
                <span>Reset Changes</span>
              </Button>
            </div>
            {(imageFile || coverFile) && (
              <StatusMessage
                isDarkMode={isDarkMode}
                message={`Files ready for upload: ${imageFile && 'Profile image'}${imageFile && coverFile && ' and '}${coverFile && 'cover image'} will be uploaded when you save changes.`}
              />
            )}
          </div>
        </Card>
      </MainContainer>
    </div>
  );
};

export default SchoolProfilePage;