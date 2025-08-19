import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, RefreshCw, LogOut, Shield, Bell } from 'lucide-react';
import Swal from 'sweetalert2';
import { checkSchoolStatus } from './api/shared.api'; // Adjust path if needed (e.g., relative to your component's location)

const VerificationStatus = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [progress, setProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    navigate('/schoolLogin');
  };

  const handleRefresh = async () => {
    if (isRefreshing) return; // prevent double trigger
    setIsRefreshing(true);
    setProgress(0);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const schoolData = Cookies.get('schoolData');
      if (!schoolData) throw new Error('School data not found in cookies');
      const parsedSchoolData = JSON.parse(schoolData);
      const schoolId = parsedSchoolData.id;

      const data = await checkSchoolStatus(schoolId);

      clearInterval(progressInterval);
      setProgress(100);
      setLastChecked(new Date());
      setIsRefreshing(false);

      if (data.success && data.subDomain) {
        // Extract school name from subdomain
        const urlObj = new URL(data.subDomain);
        const hostParts = urlObj.hostname.split('.');
        const name = hostParts[0];

        if (!isVerified) {
          Swal.fire({
            title: 'Congratulations!',
            text: 'Your school has been successfully approved and a subdomain has been allotted by the admin.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }

        setSchoolName(name);
        setIsVerified(true);
        setShowNotification(true);
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setIsRefreshing(false);
      setProgress(0);
      console.error("Failed to check status:", error);
    }
  };

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (!accessToken && !refreshToken) {
      navigate('/schoolLogin');
      return;
    }

    // Initial load (first check can be manual or automatic)
    setTimeout(() => {
      setIsLoading(false);
      setLastChecked(new Date());
      handleRefresh(); // run initial check once loaded
    }, 1500);
  }, [navigate]);

  useEffect(() => {
    if (isVerified) return;

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (!isRefreshing) {
        handleRefresh();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isRefreshing, isVerified]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-slideIn">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span className="font-medium">Verification Complete!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Verification Center</h1>
        </div>
        
        <button
          onClick={handleLogout}
          className="group bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md">
          {isLoading ? (
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 text-center border border-white/20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Status...</h2>
              <p className="text-gray-600">Please wait while we check your verification status</p>
            </div>
          ) : !isVerified ? (
            <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 text-center border border-white/20 transform transition-all duration-500 hover:shadow-3xl">
              <div className="mb-6">
                <div className="relative">
                  <Clock className="h-20 w-20 text-amber-500 mx-auto mb-4 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-30"></div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">Verification Pending</h1>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Your application is currently under review. We'll notify you once the process is complete.
                </p>
              </div>

              {/* Progress bar for refresh */}
              {isRefreshing && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Checking status...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Status info */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-amber-600 flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                    In Review
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Est. Time:</span>
                  <span className="font-medium text-gray-800">2-3 business days</span>
                </div>
                {lastChecked && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Checked:</span>
                    <span className="font-medium text-gray-800">{formatTime(lastChecked)}</span>
                  </div>
                )}
              </div>

              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="group w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`h-5 w-5 transition-transform ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                <span>{isRefreshing ? 'Checking...' : 'Check Status'}</span>
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-2xl rounded-3xl p-8 text-center transform transition-all duration-500 hover:shadow-3xl border border-white/20">
              <div className="relative mb-6">
                <CheckCircle className="h-24 w-24 mx-auto mb-4 animate-bounce" />
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse"></div>
              </div>
              
              <h2 className="text-3xl font-bold mb-3">Verification Complete!</h2>
              <p className="text-green-100 mb-6 leading-relaxed">
                Congratulations! Your account has been successfully verified. 
                You now have full access to all features.
              </p>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <CheckCircle className="h-5 w-5" />
                  <span>Verified on {lastChecked ? lastChecked.toLocaleDateString() : 'Today'}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/school/${schoolName}`)}
                className="w-full bg-white text-green-600 py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;
