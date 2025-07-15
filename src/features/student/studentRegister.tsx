import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { registerStudent } from './api/student.api';
import { validateStudentRegister } from './validations/registerValidation';
import { RegisterFormErrors } from './types/RegisterData';

const StudentRegister = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateStudentRegister(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const data = await registerStudent(formData);

      Swal.fire({
        icon: 'success',
        title: '🎉 Registration Successful!',
        text: 'You will be redirected to login page in 5 seconds.',
        footer: `<a href="/studentLogin" class="text-blue-600 underline">Or click here to go now</a>`,
        timer: 5000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          const content = Swal.getHtmlContainer();
          if (content) {
            const link = content.querySelector('a');
            if (link) {
              link.addEventListener('click', () => navigate('/studentLogin'));
            }
          }
        },
      });

      setTimeout(() => {
        navigate('/studentLogin');
      }, 5000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || 'Registration failed';
      toast.error(`❌ ${errorMsg}`, { position: 'top-right' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-900 to-blue-700">
      <ToastContainer />
      <div className="flex bg-white rounded-lg overflow-hidden shadow-lg w-[900px]">
        <form onSubmit={handleRegister} className="flex-1 p-10">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Student Register</h2>
          <p className="text-sm text-gray-500 mb-5">Fill in your details to register</p>

          <div className="mb-4">
            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
          </div>

          <div className="mb-4">
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/studentLogin')}
              className="text-blue-600 hover:underline"
            >
              Login here
            </button>
          </p>
        </form>

        <div className="flex-1 bg-blue-500 flex items-center justify-center p-4">
          <img
            src="/images/students/student_learning.png"
            alt="Student"
            className="w-72 rounded shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
