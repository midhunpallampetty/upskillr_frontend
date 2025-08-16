import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  RotateCcw,
  Settings
} from 'lucide-react';

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoUrl: string;
  course: any;
  onTimeUpdate: (videoId: string, position: number) => void;
  onVideoEnd: (videoId: string) => void;
  lastProgressUpdates: Record<string, number>;
  setLastProgressUpdates: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  isFullscreen: boolean;
  onFullscreenChange: (fullscreen: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoRef,
  videoUrl,
  course,
  onTimeUpdate,
  onVideoEnd,
  lastProgressUpdates,
  setLastProgressUpdates,
  playbackSpeed,
  onSpeedChange,
  isFullscreen,
  onFullscreenChange
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(1);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showControls, setShowControls] = React.useState(true);
  const [showSettings, setShowSettings] = React.useState(false);
  const [buffered, setBuffered] = React.useState(0);

  const currentVideo = course?.sections
    .flatMap(s => s.videos)
    .find(v => v.url === videoUrl);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      if (currentVideo && video.currentTime > 0) {
        const now = Date.now();
        const videoId = currentVideo._id;
        if (!lastProgressUpdates[videoId] || now - lastProgressUpdates[videoId] > 10000) {
          setLastProgressUpdates(prev => ({ ...prev, [videoId]: now }));
          onTimeUpdate(videoId, video.currentTime);
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentVideo) {
        onVideoEnd(currentVideo._id);
      }
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('progress', handleProgress);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('progress', handleProgress);
    };
  }, [videoUrl, currentVideo, lastProgressUpdates, setLastProgressUpdates, onTimeUpdate, onVideoEnd]);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, videoRef]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      handleSeek(newTime);
    }
  };

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercentage = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-black rounded-xl overflow-hidden shadow-2xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-96 object-contain"
        src={videoUrl}
        onClick={togglePlay}
      />

      {/* Video Title Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-4 right-4 z-10"
          >
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
              <h3 className="text-white font-semibold text-lg truncate">
                {currentVideo?.videoName || 'Video'}
              </h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isPlaying ? 0 : 1 }}
          className="bg-black/50 rounded-full p-4"
        >
          <Play className="w-12 h-12 text-white" />
        </motion.div>
      </div>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="relative h-2 bg-white/20 rounded-full cursor-pointer group">
                {/* Buffered Progress */}
                <div
                  className="absolute h-full bg-white/40 rounded-full"
                  style={{ width: `${bufferedPercentage}%` }}
                />
                {/* Current Progress */}
                <motion.div
                  className="absolute h-full bg-indigo-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                  layoutId="progress"
                />
                {/* Seek Handle */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progressPercentage}%` }}
                  drag="x"
                  dragMomentum={false}
                  whileDrag={{ scale: 1.2 }}
                />
                {/* Click to seek */}
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                {/* Skip Back */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => skipTime(-10)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </motion.button>

                {/* Play/Pause */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="p-3 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </motion.button>

                {/* Skip Forward */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => skipTime(10)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </motion.button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                {/* Time */}
                <div className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Settings */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </motion.button>

                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-3 min-w-32"
                      >
                        <div className="text-sm font-semibold mb-2">Speed</div>
                        {speedOptions.map((speed) => (
                          <button
                            key={speed}
                            onClick={() => {
                              onSpeedChange(speed);
                              setShowSettings(false);
                            }}
                            className={`block w-full text-left px-2 py-1 rounded text-sm hover:bg-white/20 transition-colors ${
                              playbackSpeed === speed ? 'text-indigo-400' : 'text-white'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fullscreen */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onFullscreenChange(!isFullscreen)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoPlayer;