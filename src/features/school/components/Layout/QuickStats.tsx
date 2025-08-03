import React from 'react';
import { GraduationCap, BookOpen, Users, FileText } from 'lucide-react';
import StatCard from '../UI/StatCard';

interface QuickStatsProps {
  isDarkMode: boolean;
}

const QuickStats: React.FC<QuickStatsProps> = ({ isDarkMode }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <StatCard
      title="Dashboard"
      value="Active"
      icon={<GraduationCap className="w-6 h-6" />}
      gradient="from-blue-500 to-blue-600"
      isDarkMode={isDarkMode}
    />
    <StatCard
      title="Courses"
      value="Ready"
      icon={<BookOpen className="w-6 h-6" />}
      gradient="from-green-500 to-green-600"
      isDarkMode={isDarkMode}
    />
    <StatCard
      title="Students"
      value="Enrolled"
      icon={<Users className="w-6 h-6" />}
      gradient="from-purple-500 to-purple-600"
      isDarkMode={isDarkMode}
    />
    <StatCard
      title="Exams"
      value="Managed"
      icon={<FileText className="w-6 h-6" />}
      gradient="from-orange-500 to-orange-600"
      isDarkMode={isDarkMode}
    />
  </div>
);

export default QuickStats;