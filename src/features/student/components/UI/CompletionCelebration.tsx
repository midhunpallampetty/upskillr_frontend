import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Star, Download, Sparkles, Award, Target, TrendingUp, Gift } from 'lucide-react';
import { getCertificate } from '../../api/course.api'; // Adjust import path

interface CompletionCelebrationProps {
  course: any;
  onCertificateRequest: () => void;
  certificateUrl: string | null; // Certificate passed from parent (after generating)
  progressLoading: boolean;
  onReviewCourse: () => void;
}

const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  course,
  onCertificateRequest,
  certificateUrl: propCertificateUrl,
  progressLoading,
  onReviewCourse,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [localCertificateUrl, setLocalCertificateUrl] = useState<string | null>(propCertificateUrl);
  const [isLoading, setIsLoading] = useState(true);

  const getStudentId = () => {
    try {
      const studentData = localStorage.getItem('student');
      if (!studentData) return null;
      const parsed = JSON.parse(studentData);
      return parsed.id || parsed._id || null;
    } catch (error) {
      console.error("Error parsing student from localStorage:", error);
      return null;
    }
  };

  // Fetch certificate only if not already passed from parent
  useEffect(() => {
    if (localCertificateUrl) {
      setIsLoading(false);
      return;
    }

    const fetchExistingCertificate = async () => {
      try {
        setIsLoading(true);
        const schoolName = course?.schoolName || '';
        const courseId = course?._id || '';
        const studentId = getStudentId();
        if (!schoolName || !courseId || !studentId) return;

        const response = await getCertificate(schoolName, courseId, studentId);
        if (response?.certificateUrl) {
          setLocalCertificateUrl(response.certificateUrl);
        }
      } catch (error) {
        console.error("Error fetching certificate:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingCertificate();

    // Stop confetti after 3s
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [course, localCertificateUrl]);

  // Update localCertificateUrl if parent prop changes
  useEffect(() => {
    if (propCertificateUrl) {
      setLocalCertificateUrl(propCertificateUrl);
    }
  }, [propCertificateUrl]);

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${course?.courseName || 'certificate'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const achievements = [
    { icon: Target, label: "Course Completed", color: "text-green-400" },
    { icon: TrendingUp, label: "Knowledge Gained", color: "text-blue-400" },
    { icon: Award, label: "Skills Mastered", color: "text-purple-400" },
    { icon: Gift, label: "Certificate Earned", color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Confetti */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: window.innerHeight + 100, opacity: 0 }}
            animate={showConfetti ? { y: -100, opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] } : {}}
            transition={{ duration: 3, delay: Math.random() * 2, ease: "easeOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          {/* Trophy + Sparkles */}
          <motion.div initial={{ y: -100, rotate: -180 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.3 }} className="mb-8 relative">
            <div className="relative inline-block">
              <motion.div animate={{ rotate: [0, -5, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}>
                <Trophy className="w-32 h-32 text-yellow-400 mx-auto" />
              </motion.div>
              {[...Array(8)].map((_, i) => (
                <motion.div key={i} className="absolute" style={{ top: '50%', left: '50%', transform: `rotate(${i * 45}deg) translateY(-80px)` }}
                  animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}>
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Text */}
          <h1 className="text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Congratulations!
          </h1>
          <h2 className="text-3xl lg:text-4xl font-semibold mb-6">You've mastered the course!</h2>

          {/* Course Name */}
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-yellow-200 mb-2">{course?.courseName}</h3>
            <div className="text-lg text-gray-300">Course completed with excellence!</div>
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {achievements.map((ach, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <ach.icon className={`w-8 h-8 ${ach.color} mx-auto mb-2`} />
                <div className="text-sm font-medium">{ach.label}</div>
              </div>
            ))}
          </div>

          {/* Certificate Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {isLoading ? (
              <div className="flex items-center gap-2 text-white">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Checking certificate...
              </div>
            ) : localCertificateUrl ? (
              <a
                href={localCertificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-400 transition-colors shadow-2xl"
              >
                <Download className="w-5 h-5" /> Download Your Certificate
              </a>
            ) : (
              <button
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
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/student/purchased-courses" className="inline-flex items-center justify-center bg-white text-indigo-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl">
              Back to Dashboard
            </Link>
            <button
              onClick={onReviewCourse}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-900 transition-colors"
            >
              Review Course Content
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompletionCelebration;
