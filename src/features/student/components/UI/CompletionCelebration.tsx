import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Star,
  Download,
  Sparkles,
  Award,
  Target,
  TrendingUp,
  Gift,
  RefreshCw  // NEW: Icon for update
} from 'lucide-react';

interface CompletionCelebrationProps {
  course: any;
  onCertificateRequest: () => void;
  onAddCertificate: () => void;  // NEW: Handler for add
  onUpdateCertificate: (dateIssued: string) => void;  // NEW: Handler for update with data
  certificateUrl: string | null;
  progressLoading: boolean;
  onReviewCourse: () => void;
}

const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  course,
  onCertificateRequest,
  onAddCertificate,  // NEW
  onUpdateCertificate,  // NEW
  certificateUrl,
  progressLoading,
  onReviewCourse
}) => {
  const [showConfetti, setShowConfetti] = React.useState(true);
  const [showUpdateForm, setShowUpdateForm] = React.useState(false);  // NEW: Toggle for update input
  const [newDate, setNewDate] = React.useState('');  // NEW: State for update data

  React.useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const achievements = [
    { icon: Target, label: "Course Completed", color: "text-green-400" },
    { icon: TrendingUp, label: "Knowledge Gained", color: "text-blue-400" },
    { icon: Award, label: "Skills Mastered", color: "text-purple-400" },
    { icon: Gift, label: "Certificate Earned", color: "text-yellow-400" }
  ];

  const handleUpdateSubmit = () => {
    if (newDate) {
      onUpdateCertificate(newDate);
      setShowUpdateForm(false);
      setNewDate('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              opacity: 0
            }}
            animate={showConfetti ? {
              y: -100,
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0]
            } : {}}
            transition={{
              duration: 3,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          {/* Trophy Animation */}
          <motion.div
            initial={{ y: -100, rotate: -180 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="mb-8 relative"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Trophy className="w-32 h-32 text-yellow-400 mx-auto" />
              </motion.div>
              
              {/* Sparkles around trophy */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-80px)`
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
              ))}
            </div>

            {/* Star Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center gap-2 mt-6"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2 + i * 0.1, type: "spring", stiffness: 500 }}
                >
                  <Star className="w-8 h-8 fill-yellow-300 text-yellow-300" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Congratulations Text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h1 className="text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Congratulations!
            </h1>
            <h2 className="text-3xl lg:text-4xl font-semibold mb-6">
              You've mastered the course!
            </h2>
          </motion.div>

          {/* Course Name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl lg:text-3xl font-bold text-yellow-200 mb-2">
                {course?.courseName}
              </h3>
              <div className="text-lg text-gray-300">
                Course completed with excellence!
              </div>
            </div>
          </motion.div>

          {/* Achievements Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7 + index * 0.1, type: "spring", stiffness: 300 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <achievement.icon className={`w-8 h-8 ${achievement.color} mx-auto mb-2`} />
                <div className="text-sm font-medium">{achievement.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            You've successfully completed all sections and mastered every concept in this course.
            Your dedication and hard work have paid off. Ready to showcase your achievement?
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onCertificateRequest}
              disabled={progressLoading}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl"
            >
              <Download className="w-6 h-6" />
              {progressLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Generating Certificate...
                </div>
              ) : (
                'Get Your Certificate'
              )}
            </motion.button>

            {/* NEW: Button to Add New Certificate */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddCertificate}
              className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-300 hover:to-purple-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl"
            >
              <Award className="w-6 h-6" />
              Add New Certificate
            </motion.button>

            {/* NEW: Button to Update Certificate (toggles form) */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUpdateForm(!showUpdateForm)}
              disabled={!certificateUrl}  // Disable if no existing certificate
              className="bg-gradient-to-r from-green-400 to-teal-400 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-300 hover:to-teal-300 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl"
            >
              <RefreshCw className="w-6 h-6" />
              Update Certificate
            </motion.button>
          </motion.div>

          {/* NEW: Update Form (simple date input) */}
          <AnimatePresence>
            {showUpdateForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-md mx-auto"
              >
                <h3 className="text-xl font-bold mb-4">Update Certificate Details</h3>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
                  placeholder="New Issue Date"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateSubmit}
                    disabled={!newDate}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Submit Update
                  </button>
                  <button
                    onClick={() => setShowUpdateForm(false)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Certificate Download */}
          <AnimatePresence>
            {certificateUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mb-8"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-400 transition-colors shadow-2xl"
                >
                  <Download className="w-5 h-5" />
                  Download Your Certificate
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/student/purchased-courses"
              className="inline-flex items-center justify-center bg-white text-indigo-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl"
            >
              Back to Dashboard
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReviewCourse}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-900 transition-colors"
            >
              Review Course Content
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompletionCelebration;
