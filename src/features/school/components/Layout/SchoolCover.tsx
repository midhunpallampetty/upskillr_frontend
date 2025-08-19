import React from 'react';
import { Users, BookOpen, TrendingUp } from 'lucide-react';
import { useGlobalState } from '../../../../context/GlobalState';
import { SchoolCoverProps } from '../../types/SchoolCoverProps';


const SchoolCover: React.FC<SchoolCoverProps> = ({ school }) => {
  const { isDarkMode } = useGlobalState();
  const defaultCoverImage = 'https://via.placeholder.com/1200x320';
  const defaultLogoImage = 'https://via.placeholder.com/128';

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>
      <img
        src={school.coverImage || defaultCoverImage}
        alt="School Cover"
        className="w-full h-80 object-cover"
        loading="lazy"
      />

      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-7xl mx-auto flex items-end space-x-6">
          <div className="relative">
            <img
              src={school.image || defaultLogoImage}
              alt="School Logo"
              className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl"
              loading="lazy"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="flex-1 text-white mb-4">
            <h1 className="text-4xl font-bold mb-2">{school.name}</h1>
            <p className="text-lg text-white/90 mb-4">Excellence in Education</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Active Institution</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Quality Education</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Growing Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolCover;