import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  CheckCircle,
  Lock,
  Play,
  Video,
  Clock,
  Trophy,
  Target,
  Award
} from 'lucide-react';

interface CourseSidebarProps {
  course: any;
  expandedSection: string | null;
  completedVideos: Set<string>;
  currentVideoUrl: string;
  collapsed: boolean;
  onToggleSection: (id: string) => void;
  onSelectVideo: (url: string) => void;
  onMarkComplete: (videoId: string) => void;
  onToggleCollapse: () => void;
  isSectionUnlocked: (index: number) => boolean;
  isSectionCompleted: (section: any) => boolean;
  progressLoading: boolean;
  hoveredVideo: string | null;
  onVideoHover: (videoId: string | null) => void;
  passedSections: Set<string>;
  onTakeExam: (sectionId: string) => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  expandedSection,
  completedVideos,
  currentVideoUrl,
  collapsed,
  onToggleSection,
  onSelectVideo,
  onMarkComplete,
  onToggleCollapse,
  isSectionUnlocked,
  isSectionCompleted,
  progressLoading,
  hoveredVideo,
  onVideoHover,
  passedSections,
  onTakeExam
}) => {
  // Filter sections to only include those with videos
  const filteredSections = course?.sections?.filter(section => section.videos.length > 0) || [];

  // Calculate progress based on filtered sections
  const totalVideos = filteredSections.reduce((acc, section) => acc + section.videos.length, 0) || 0;
  const completedCount = completedVideos.size;
  const progressPercentage = totalVideos > 0 ? (completedCount / totalVideos) * 100 : 0;

  return (
    <motion.div
      animate={{ width: collapsed ? 64 : 320 }}
      className="bg-white border-r border-gray-200 shadow-sm fixed left-0 top-16 bottom-0 z-30 overflow-hidden"
    >
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-gray-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Course Content</span>
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            {/* Progress Summary */}
            <div className="p-4 border-b border-gray-200">
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{completedCount} completed</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Target className="w-4 h-4" />
                  <span>{totalVideos} total</span>
                </div>
              </div>
            </div>

            {/* Sections List */}
            <div className="flex-1 overflow-y-auto">
              {filteredSections.length ? (
                <div className="p-2">
                  {filteredSections.map((section, sectionIndex) => {
                    const isUnlocked = isSectionUnlocked(sectionIndex);
                    const isVideosCompleted = isSectionCompleted(section);
                    const completedInSection = section.videos.filter(v => completedVideos.has(v._id)).length;
                    const hasExam = !!section.exam;
                    const isExamPassed = passedSections.has(section._id);
                    const isCompleted = isVideosCompleted && (!hasExam || isExamPassed);
                    const isExpanded = expandedSection === section._id;

                    return (
                      <motion.div
                        key={section._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sectionIndex * 0.1 }}
                        className={`mb-2 rounded-lg border ${
                          isUnlocked ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
                        } ${isCompleted ? 'ring-2 ring-green-200' : ''}`}
                      >
                        {/* Section Header */}
                        <motion.button
                          whileHover={{ backgroundColor: isUnlocked ? '#f9fafb' : undefined }}
                          onClick={() => isUnlocked && onToggleSection(section._id)}
                          disabled={!isUnlocked}
                          className={`w-full p-3 text-left flex items-center justify-between rounded-lg transition-colors ${
                            !isUnlocked ? 'cursor-not-allowed' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {!isUnlocked ? (
                              <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            ) : isCompleted ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              </motion.div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            
                            <div className="min-w-0 flex-1">
                              <div className={`font-medium text-sm truncate ${
                                isUnlocked ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                                {section.sectionName}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {completedInSection}/{section.videos.length} videos
                                {hasExam ? ' + Exam' : ''}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {isCompleted && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <Trophy className="w-3 h-3 text-yellow-500" />
                              </motion.div>
                            )}
                            {isUnlocked && (
                              <motion.div
                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>

                        {/* Videos List */}
                        <AnimatePresence>
                          {isExpanded && isUnlocked && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="border-t border-gray-100"
                            >
                              <div className="p-2">
                                {section.videos.length > 0 ? (
                                  section.videos.map((video, videoIndex) => {
                                    const isVideoCompleted = completedVideos.has(video._id);
                                    const isCurrentVideo = currentVideoUrl === video.url;
                                    const isHovered = hoveredVideo === video._id;

                                    return (
                                      <motion.div
                                        key={video._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: videoIndex * 0.05 }}
                                        className={`group relative rounded-lg p-2 mb-1 cursor-pointer transition-all duration-200 ${
                                          isCurrentVideo
                                            ? 'bg-indigo-50 border border-indigo-200'
                                            : isHovered
                                            ? 'bg-gray-50'
                                            : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => onSelectVideo(video.url)}
                                        onMouseEnter={() => onVideoHover(video._id)}
                                        onMouseLeave={() => onVideoHover(null)}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="flex-shrink-0">
                                            {isVideoCompleted ? (
                                              <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                              >
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                              </motion.div>
                                            ) : isCurrentVideo ? (
                                              <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                              >
                                                <Play className="w-4 h-4 text-indigo-500" />
                                              </motion.div>
                                            ) : (
                                              <Video className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                            )}
                                          </div>
                                          
                                          <div className="flex-1 min-w-0">
                                            <div className={`text-sm font-medium truncate ${
                                              isVideoCompleted 
                                                ? 'text-green-700 line-through' 
                                                : isCurrentVideo 
                                                ? 'text-indigo-700' 
                                                : 'text-gray-900'
                                            }`}>
                                              {video.videoName}
                                            </div>
                                            {video.duration && (
                                              <div className="flex items-center gap-1 mt-0.5">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                  {video.duration}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Mark Complete Button */}
                                        <AnimatePresence>
                                          {!isVideoCompleted && (isHovered || isCurrentVideo) && (
                                            <motion.button
                                              initial={{ opacity: 0, scale: 0.8 }}
                                              animate={{ opacity: 1, scale: 1 }}
                                              exit={{ opacity: 0, scale: 0.8 }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onMarkComplete(video._id);
                                              }}
                                              disabled={progressLoading}
                                              className="absolute top-1 right-1 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                            >
                                              {progressLoading ? '...' : '✓'}
                                            </motion.button>
                                          )}
                                        </AnimatePresence>
                                      </motion.div>
                                    );
                                  })
                                ) : (
                                  <p className="text-sm text-gray-400 italic p-2">
                                    No videos available
                                  </p>
                                )}

                                {/* Exam Section */}
                                {hasExam && isVideosCompleted && (
                                  <div className="mt-2 p-2 border-t border-gray-100">
                                    {isExamPassed ? (
                                      <div className="flex items-center gap-2 text-green-600">
                                        <Award className="w-4 h-4" />
                                        <span className="text-sm font-medium">Exam Passed!</span>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => onTakeExam(section._id)}
                                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                        disabled={!isVideosCompleted} // Ensure videos are completed before enabling exam
                                      >
                                        <Award className="w-4 h-4" />
                                        Take Exam
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Locked Section Message */}
                        {!isUnlocked && (
                          <div className="px-4 pb-3 text-xs text-gray-500 italic">
                            Complete the previous section to unlock
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No course content available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed State Icons */}
      <AnimatePresence>
        {collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-2 space-y-2"
          >
            {filteredSections.slice(0, 8).map((section, index) => {
              const isUnlocked = isSectionUnlocked(index);
              const isVideosCompleted = isSectionCompleted(section);
              const hasExam = !!section.exam;
              const isExamPassed = passedSections.has(section._id);
              const isCompleted = isVideosCompleted && (!hasExam || isExamPassed);
              
              return (
                <motion.div
                  key={section._id}
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    !isUnlocked 
                      ? 'bg-gray-100' 
                      : isCompleted 
                      ? 'bg-green-100' 
                      : 'bg-indigo-100 hover:bg-indigo-200'
                  } transition-colors cursor-pointer`}
                  onClick={() => isUnlocked && onToggleSection(section._id)}
                  title={section.sectionName}
                >
                  {!isUnlocked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Video className="w-5 h-5 text-indigo-600" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CourseSidebar;