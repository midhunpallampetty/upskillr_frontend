import React, { useEffect } from 'react';
import Cookies  from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const VerificationStatus = () => {
  const isVerified = false; // Set to `true` to test verified UI
const navigate=useNavigate()
  const handleLogout = () => {
    // Add your logout logic here
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    navigate('/schoolLogin')
    console.log('User logged out');
  };
useEffect(()=>{
const accessToken=Cookies.get('accessToken');
const refreshToken=Cookies.get('refreshToken');
if(!accessToken && !refreshToken){
  navigate('/schoolLogin')
}
},[])
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative">
      {/* Logout button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center h-full px-4">
        {!isVerified ? (
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">⏳ Response is Pending</h1>
            <p className="text-gray-600">
              Your verification is still in progress. Please check back later.
            </p>
          </div>
        ) : (
          <div className="bg-green-100 text-green-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center animate-fade-in">
            <h2 className="text-2xl font-semibold">✅ You are verified!</h2>
            <p className="mt-2 text-green-700">Thanks for your patience.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationStatus;
