import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star,
  Clock,
  Users,
  Award,
  Target,
  TrendingUp,
  BookOpen,
  Play
} from 'lucide-react';

interface CourseHeaderProps {
  course: any;
  schoolName: string | undefined;
  completionPercentage: number;
  totalDuration: string;
  completedVideos: number;
  totalVideos: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  course,
  schoolName,
  completionPercentage,
  totalDuration,
  completedVideos,
  totalVideos
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Course Thumbnail */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="relative group"
          >
            <img
              src={course?.courseThumbnail || `https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=400`}
              alt="Course Thumbnail"
              className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl object-cover shadow-2xl border-4 border-white/20"
            />
            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Course Info */}
          <div className="flex-1 min-w-0">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl lg:text-4xl font-bold mb-3 leading-tight"
            >
              {course?.courseName || 'Course Title'}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-4 text-indigo-200"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-lg">
                from <span className="font-semibold italic">{schoolName}</span>
              </span>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-5 h-5 text-green-300" />
                </div>
                <div className="text-2xl font-bold">{completionPercentage}%</div>
                <div className="text-sm text-indigo-200">Complete</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-5 h-5 text-blue-300" />
                </div>
                <div className="text-2xl font-bold">{totalDuration}</div>
                <div className="text-sm text-indigo-200">Duration</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="w-5 h-5 text-purple-300" />
                </div>
                <div className="text-2xl font-bold">{completedVideos}/{totalVideos}</div>
                <div className="text-sm text-indigo-200">Videos</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Award className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-2xl font-bold">{course?.sections?.length || 0}</div>
                <div className="text-sm text-indigo-200">Sections</div>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Course Progress</span>
                <span className="font-bold">{completionPercentage}%</span>
              </div>
              <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
              
              {completionPercentage > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex items-center gap-1 text-sm text-indigo-200"
                >
                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                  <span>Great progress! Keep it up!</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Award className="w-16 h-16" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CourseHeader;