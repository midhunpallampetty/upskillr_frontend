import React, { useState, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchool, uploadToCloudinary } from '../../api/school';
import type { SchoolFormData } from './types/SchoolForm';
import { useFormReducer } from './reducers/useFormReducer';
import { useRegisterReducer } from './reducers/useRegisterReducer';
import useNavigateToSchool from './hooks/useNavigateIntoSchool';

import { Country, State, City } from 'country-state-city';
import Select from 'react-select';

const LoadingButton = lazy(() => import('../shared/components/UI/Loader'));

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

const SchoolRegister = () => {
  const navigate = useNavigate();
  useNavigateToSchool();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, dispatchForm] = useFormReducer();
  const [state, dispatch] = useRegisterReducer();
  const { imageFile, coverImageFile, fieldErrors, loading, message, isLoading } = state;

  // Country/State/City selections
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedStateVal, setSelectedStateVal] = useState<any>(null);
  const [selectedCityVal, setSelectedCityVal] = useState<any>(null);

  // Show/hide password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const clearFieldError = (field: keyof SchoolFormData) => {
    setTimeout(() => {
      dispatch({ type: 'CLEAR_FIELD_ERROR', field });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files) {
      const file = files[0];
      if (!file) return;

      if (!allowedImageTypes.includes(file.type)) {
        dispatch({
          type: 'SET_FIELD_ERRORS',
          payload: { ...fieldErrors, [name]: '❌ Allowed formats: .jpg, .jpeg, .png, .webp' },
        });
        clearFieldError(name as keyof SchoolFormData);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        dispatch({
          type: 'SET_FIELD_ERRORS',
          payload: { ...fieldErrors, [name]: '❌ File must be less than 2MB' },
        });
        clearFieldError(name as keyof SchoolFormData);
        return;
      }

      if (name === 'image') {
        dispatch({ type: 'SET_IMAGE_FILE', payload: file });
      } else if (name === 'coverImage') {
        dispatch({ type: 'SET_COVER_IMAGE_FILE', payload: file });
      }

      dispatchForm({ type: 'UPDATE_FIELD', field: name as keyof SchoolFormData, value: file.name });
    } else {
      dispatchForm({ type: 'UPDATE_FIELD', field: name as keyof SchoolFormData, value });
    }

    dispatch({
      type: 'SET_FIELD_ERRORS',
      payload: { ...fieldErrors, [name]: '' },
    });
  };

  const validateFields = () => {
    const errors: Partial<SchoolFormData> = {};
    const stepsFields = [
      ['schoolName', 'experience', 'address'],
      ['officialContact', 'city', 'state', 'country'],
      ['image', 'coverImage'],
      ['email', 'password', 'confirmPassword'],
    ];

    const currentFields = stepsFields[currentStep];

    currentFields.forEach((field) => {
      if (!formData[field]?.trim() && field !== 'image' && field !== 'coverImage') {
        errors[field] = 'This field is required';
      }
    });

    if (currentStep === 0) {
      // Custom validation for schoolName
      if (formData.schoolName.trim().length < 3) {
        errors.schoolName = 'School name must be at least 3 characters';
      }

      if (!/^\d+$/.test(formData.experience) || parseInt(formData.experience) <= 0) {
        errors.experience = 'Experience must be a positive number';
      }
      const addressRegex = /^[a-zA-Z0-9\s,'-]{10,}$/;
      if (!addressRegex.test(formData.address)) {
        errors.address = 'Address must be at least 10 characters';
      }
    }

    if (currentStep === 1) {
      if (!/^\d{10}$/.test(formData.officialContact)) {
        errors.officialContact = 'Must be a valid 10-digit phone number';
      }
      if (!formData.country) errors.country = 'Country is required';
      if (!formData.state) errors.state = 'State is required';
      if (!formData.city) errors.city = 'City is required';
    }

    if (currentStep === 2) {
      // No required checks for image and coverImage (now optional)
    }

    if (currentStep === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Must be a valid email address';
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+.{6,}$/;
      if (!passwordRegex.test(formData.password)) {
        errors.password =
          'Password must have 6+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol';
      }
      // Custom message for confirmPassword
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match—please double-check';
      }
    }

    dispatch({ type: 'SET_FIELD_ERRORS', payload: errors });
    Object.keys(errors).forEach((field) => clearFieldError(field as keyof SchoolFormData));

    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateFields()) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_FIELD_ERRORS', payload: {} });
    dispatch({ type: 'SET_MESSAGE', payload: '' });
    dispatch({ type: 'SET_IS_LOADING', payload: true });

    if (!validateFields()) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, CLOUD_NAME, UPLOAD_PRESET);
      }

      let coverImageUrl = '';
      if (coverImageFile) {
        coverImageUrl = await uploadToCloudinary(coverImageFile, CLOUD_NAME, UPLOAD_PRESET);
      }

      await registerSchool({
        ...formData,
        image: imageUrl,
        coverImage: coverImageUrl,
      });

      // Redirect immediately to login with state indicating successful registration
      navigate('/schoolLogin', { state: { fromRegistration: true } });
    } catch (err: any) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: `❌ ${err.response?.data?.msg || 'Registration failed'}`,
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const steps = [
    {
      title: 'School Details',
      fields: [
        { name: 'schoolName', label: 'School Name', type: 'text' },
        { name: 'experience', label: 'Years of Operations', type: 'text' },
        { name: 'address', label: 'Address', type: 'textarea' },
      ],
    },
    {
      title: 'Contact Info',
      fields: [{ name: 'officialContact', label: ' Contact Number', type: 'text' }], // rest via Select components
    },
    {
      title: 'Images',
      fields: [
        { name: 'image', label: 'School Logo', type: 'file' },
        { name: 'coverImage', label: 'Cover Image', type: 'file' },
      ],
    },
    {
      title: 'Credentials',
      fields: [
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
      ],
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-blue-800 px-4 py-6">
      <div className="bg-white w-full max-w-6xl rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-blue-500 flex items-center justify-center p-6">
          <img
            src="/images/schools/schools.png"
            alt="illustration"
            className="w-full max-w-xs rounded-3xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10">
          <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Register School</h1>

          <div className="flex justify-between mb-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 text-center py-2 text-sm ${
                  index <= currentStep ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'
                } ${index === 0 ? 'rounded-l-lg' : ''} ${
                  index === steps.length - 1 ? 'rounded-r-lg' : ''
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>

          {message && (
            <div className="md:col-span-2 text-center text-green-600 font-medium mb-4">{message}</div>
          )}

          <form
            onSubmit={currentStep === steps.length - 1 ? handleRegister : (e) => e.preventDefault()}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {steps[currentStep].fields.map(({ name, label, type }) => (
              <div key={name} className="transition-all duration-300">
                <label className="block mb-1 font-semibold">{label}</label>
                {type === 'textarea' ? (
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                  />
                ) : type === 'file' ? (
                  <input type="file" name={name} onChange={handleChange} className="w-full" />
                ) : type === 'password' ? (
                  <div className="relative">
                    <input
                      type={name === 'password' ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-blue-600"
                    >
                      {name === 'password' ? (showPassword ? 'Hide' : 'Show') : (showConfirmPassword ? 'Hide' : 'Show')}
                    </button>
                  </div>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                )}
                <p className="text-red-600 text-sm mt-1 min-h-[1.25rem]">
                  {fieldErrors[name] || '\u00A0'}
                </p>
              </div>
            ))}

            {/* Dynamic Country/State/City for Step 1 */}
            {currentStep === 1 && (
              <>
                <div>
                  <label className="block mb-1 font-semibold">Country</label>
                  <Select
                    options={Country.getAllCountries().map((c) => ({
                      value: c.isoCode,
                      label: c.name,
                    }))}
                    value={selectedCountry}
                    onChange={(val) => {
                      setSelectedCountry(val);
                      setSelectedStateVal(null);
                      setSelectedCityVal(null);
                      dispatchForm({
                        type: 'UPDATE_FIELD',
                        field: 'country',
                        value: val?.label || '',
                      });
                    }}
                    placeholder="Select Country"
                  />
                  <p className="text-red-600 text-sm mt-1 min-h-[1.25rem]">
                    {fieldErrors.country || '\u00A0'}
                  </p>
                </div>

                <div>
                  <label className="block mb-1 font-semibold">State</label>
                  <Select
                    options={
                      selectedCountry
                        ? State.getStatesOfCountry(selectedCountry.value).map((s) => ({
                            value: s.isoCode,
                            label: s.name,
                          }))
                        : []
                    }
                    value={selectedStateVal}
                    onChange={(val) => {
                      setSelectedStateVal(val);
                      setSelectedCityVal(null);
                      dispatchForm({
                        type: 'UPDATE_FIELD',
                        field: 'state',
                        value: val?.label || '',
                      });
                    }}
                    placeholder="Select State"
                    isDisabled={!selectedCountry}
                  />
                  <p className="text-red-600 text-sm mt-1 min-h-[1.25rem]">
                    {fieldErrors.state || '\u00A0'}
                  </p>
                </div>

                <div>
                  <label className="block mb-1 font-semibold">City</label>
                  <Select
                    options={
                      selectedCountry && selectedStateVal
                        ? City.getCitiesOfState(
                            selectedCountry.value,
                            selectedStateVal.value
                          ).map((city) => ({
                            value: city.name,
                            label: city.name,
                          }))
                        : []
                    }
                    value={selectedCityVal}
                    onChange={(val) => {
                      setSelectedCityVal(val);
                      dispatchForm({
                        type: 'UPDATE_FIELD',
                        field: 'city',
                        value: val?.label || '',
                      });
                    }}
                    placeholder="Select City"
                    isDisabled={!selectedStateVal}
                  />
                  <p className="text-red-600 text-sm mt-1 min-h-[1.25rem]">
                    {fieldErrors.city || '\u00A0'}
                  </p>
                </div>
              </>
            )}

            <div className="md:col-span-2 flex justify-between mt-4">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
                >
                  Back
                </button>
              )}

              <button
                type={currentStep === steps.length - 1 ? 'submit' : 'button'}
                onClick={currentStep < steps.length - 1 ? handleNext : undefined}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? (
                  <Suspense fallback={<span>Loading...</span>}>
                    <LoadingButton type="submit" isLoading={isLoading} text="Submit" />
                  </Suspense>
                ) : currentStep === steps.length - 1 ? 'Register' : 'Next'}
              </button>
            </div>
          </form>

          <div className="md:col-span-2 text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/schoolLogin" className="text-blue-600 hover:underline font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegister;

