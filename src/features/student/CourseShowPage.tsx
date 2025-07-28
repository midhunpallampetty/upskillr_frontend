import React, { useState } from 'react';
import { BookOpen, Video, ChevronRight, ChevronDown, LogOut, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

type Section = {
  id: number;
  title: string;
  videos: {
    id: number;
    title: string;
    duration: string;
  }[];
};

const dummySections: Section[] = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    videos: [
      { id: 1, title: 'What is Web Development?', duration: '5:34' },
      { id: 2, title: 'Frontend vs Backend', duration: '7:21' },
    ],
  },
  {
    id: 2,
    title: 'HTML Basics',
    videos: [
      { id: 3, title: 'HTML Tags Overview', duration: '9:13' },
      { id: 4, title: 'Semantic HTML', duration: '6:47' },
    ],
  },
];

const CourseShowPage = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (id: number) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  const handleLogout = () => {
    Cookies.remove('studentToken');
    window.location.href = '/student/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Custom Navbar */}
      <nav className="bg-indigo-600 py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white text-lg">
          <div className="flex items-center gap-3 text-2xl font-semibold">
            <GraduationCap className="w-8 h-8" />
            <Link to="/student/dashboard">Student Portal</Link>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-100 text-base flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* School Banner and Info */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 flex items-center gap-6 shadow-md">
        <img
          src="https://via.placeholder.com/120x120?text=Banner"
          alt="School Banner"
          className="w-28 h-28 rounded-xl object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold">Code Academy</h1>
          <p className="text-lg">
            Subdomain: <span className="italic">codeacademy</span>
          </p>
        </div>
      </div>

      {/* Course Info */}
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
          <BookOpen className="text-purple-600" /> Full Stack Web Development
        </h2>

        {/* Sections */}
        {dummySections.map(section => (
          <div key={section.id} className="mb-4 border rounded-lg shadow-sm bg-white">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium text-lg">{section.title}</span>
              {expandedSection === section.id ? <ChevronDown /> : <ChevronRight />}
            </button>
            {expandedSection === section.id && (
              <div className="pl-6 pr-4 pb-4">
                {section.videos.map(video => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <div className="flex items-center gap-2">
                      <Video className="text-gray-500" />
                      <span>{video.title}</span>
                    </div>
                    <span className="text-sm text-gray-400">{video.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseShowPage;
