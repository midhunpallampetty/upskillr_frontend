import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import SchoolCourses from './components/SchoolCourses';

interface School {
  _id: string;
  name: string;
  email: string;
  subDomain: string;
  image: string;
  coverImage: string;
  [key: string]: any;
}

const SchoolHome: React.FC = () => {
  const navigate = useNavigate();
  const { verifiedSchool } = useParams(); // comes from /school/:verifiedSchool
  console.log(verifiedSchool,'verified')
  const [school, setSchool] = useState<School | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState({
    accessToken: Cookies.get('accessToken') || null,
    refreshToken: Cookies.get('refreshToken') || null,
  });
console.log(verifiedSchool,'hai');
useEffect(() => {
  const createSchoolDatabase = async () => {
    if (!school) return;

    try {
      const res = await axios.post('http://school.localhost:5000/api/create-database', {
        schoolName: verifiedSchool,
      });
let schoolName=verifiedSchool || "";
      console.log('✅ Database creation successful:', res.data);
      Cookies.set('dbname',schoolName);
    } catch (err) {
      console.error('❌ Error creating database:', err);
    }
  };

  createSchoolDatabase();
}, [school]);

  useEffect(() => {
    const fetchSchoolAndTokens = async () => {
      try {
        if (!verifiedSchool) {
          setError('❌ School identifier is missing in URL.');
          return;
        }

        const res = await axios.get(
          `http://school.localhost:5000/api/getSchoolBySubDomain?subDomain=http://${verifiedSchool}.localhost:5173`
        );
        

        const schoolData = res.data.school;
        setSchool(schoolData);
        Cookies.set('schoolData', JSON.stringify(schoolData), { expires: 1 });

        // const tokenRes = await axios.get(
        //   `http://school.localhost:5000/api/get-tokens?subDomain=${schoolData.subDomain}`
        // );

        // const { accessToken, refreshToken } = tokenRes.data.data;

        // if (!Cookies.get('accessToken') && accessToken) {
        //   Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'Strict' });
        // }
        // if (!Cookies.get('refreshToken') && refreshToken) {
        //   Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'Strict' });
        // }

        // setTokens({ accessToken, refreshToken });
      } catch (err) {
        console.error('❌ Error fetching school:', err);
        setError('Unable to fetch school details. Please try again.');
      }
    };

    fetchSchoolAndTokens();
  }, [verifiedSchool]);
  useEffect(() => {
    const interval = setInterval(() => {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');
      const schoolData = Cookies.get('schoolData');
  
      if (accessToken && refreshToken && schoolData) {
        clearInterval(interval); // ✅ All set
      } else {
        console.log('⏳ Waiting for cookies...');
      }
    }, 100); // Check every 100ms
  
    // If not set within 3 seconds, redirect
    setTimeout(() => {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');
      const schoolData = Cookies.get('schoolData');
  
      if (!accessToken || !refreshToken || !schoolData) {
        navigate('/schoolLogin');
      }
    }, 3000);
  
    return () => clearInterval(interval);
  }, []);
  
  const handleLogout = async () => {
    try {
      if (school?.subDomain) {
        await axios.delete("http://school.localhost:5000/api/delete-tokens", {
          data: { subDomain: school.subDomain },
        });
      }
    } catch (err) {
      console.error("⚠️ Failed to delete tokens from server:", err);
    }

    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('schoolData');
    setTokens({ accessToken: null, refreshToken: null });
    setSchool(null);

    navigate('/schoolLogin');
  };

  if (error) {
    return <div className="p-10 text-center text-red-600 text-lg">{error}</div>;
  }

  if (!school) {
    return <p className="p-10 text-center text-lg text-gray-700">Loading school info...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">School Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Banner and Avatar */}
      <div className="relative">
        <img src={school.coverImage} alt="Cover" className="w-full h-60 object-cover" />
        <div className="absolute -bottom-12 left-6">
          <img src={school.image} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
        </div>
      </div>

      {/* Welcome and Cards */}
      <div className="mt-16 px-6">
        <h1 className="text-3xl font-bold mb-6">Welcome, {school.name}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"   onClick={() => navigate(`/school/${verifiedSchool}/addCourse`)}>
            <h2 className="text-xl font-semibold mb-2">Add Course</h2>
            <p className="text-gray-600">Create and publish new courses.</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2">Enrolled Students</h2>
            <p className="text-gray-600">View and manage your students.</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2">Payments</h2>
            <p className="text-gray-600">Track course payments and dues.</p>
          </div>
        </div>
      </div>
      <div>
        <SchoolCourses/>
      </div>
    </div>
  );
};

export default SchoolHome;
