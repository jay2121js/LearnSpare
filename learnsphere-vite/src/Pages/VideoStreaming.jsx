import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { BookOpen, List, CheckCircle, Play, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from './videoPlayer';
import CourseCard from '../components/CourseCard';
import courseService from '../Services/courseService';
import { useAuth } from '../components/AuthContext';

// Animation variants
const FADE_IN_UP = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.2 },
  },
};

const ITEM_FADE = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const TOGGLE_VARIANTS = {
  off: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  on: { x: 16, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

// Utility function to format duration from seconds to MM:SS
const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

function VideoStreamingPage({ isSidebarOpen = false, isSidebarMini = false }) {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { isLoggedIn, user, fetchSession } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerInstance, setPlayerInstance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(() => {
    return JSON.parse(localStorage.getItem('autoPlayEnabled') ?? 'true');
  });
  const [showDescription, setShowDescription] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const sessionCallCount = useRef(0); // Debug counter for fetchSession calls

  // Fetch course data, check enrollment/ownership, and related courses
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsCheckingAccess(true);
      setError(null);

      // Debug fetchSession calls
      sessionCallCount.current += 1;
      console.log(`fetchSession call count: ${sessionCallCount.current}`);

      // Check authentication
      if (!isLoggedIn) {
        const isAuthenticated = await fetchSession();
        if (isMounted && !isAuthenticated) {
          setError('Please login to view this page.');
          setIsCheckingAccess(false);
          setTimeout(() => navigate('/login', { replace: true }), 2000);
          return;
        }
      }

      if (!courseId) {
        if (isMounted) {
          setError('No course ID provided.');
          setIsCheckingAccess(false);
        }
        return;
      }

      // Check enrollment or ownership
      try {
        const [isEnrolled, isOwner] = await Promise.all([
          courseService.isCourseEnrolled(courseId),
          user?.email ? courseService.checkCourseOwnership(courseId, user.email) : false,
        ]);
        if (isMounted && !isEnrolled && !isOwner) {
          setError('You are not enrolled in or do not own this course.');
          setIsCheckingAccess(false);
          setTimeout(() => navigate(`/courses/${courseId}`, { replace: true }), 2000);
          return;
        }
      } catch (err) {
        console.error(`Error checking access for course ${courseId}:`, err);
        if (isMounted) {
          setError('Failed to verify course access. Please try again.');
          setIsCheckingAccess(false);
          setTimeout(() => navigate(`/courses/${courseId}`, { replace: true }), 2000);
        }
        return;
      }
      

      try {
        const data = await courseService.getCourse(courseId);
        if (!isMounted) return;

        const transformedData = {
          title: data.courseName || 'Untitled Course',
          description: data.description || 'No description available',
          category: data.category || '',
          chapters: Array.isArray(data.videos) && data.videos.length > 0
            ? data.videos.map((video) => ({
                id: video.id,
                title: video.title || 'Untitled Video',
                duration: formatDuration(video.duration),
                description: video.description || '',
                url: video.hlsUrl || '',
                completed: false,
              }))
            : [], // Handle no videos
        };
        setCourseData(transformedData);

        // Fetch related courses by category
        if (transformedData.category) {
          const relatedResponse = await courseService.getFilteredCourses({
            category: transformedData.category,
            page: 0,
            size: 4,
          });
          if (!isMounted) return;

          console.log('Related courses response:', relatedResponse); // Debug response

          // Handle paginated response
          const relatedCoursesArray = Array.isArray(relatedResponse)
            ? relatedResponse
            : relatedResponse.content || [];

          if (!relatedCoursesArray.length) {
            setRelatedCourses([]);
            setIsCheckingAccess(false);
            return;
          }

          // Check enrollment status for each related course
          const relatedWithEnrollment = await Promise.all(
            relatedCoursesArray
              .filter((course) => course.courseId !== parseInt(courseId))
              .map(async (course) => {
                if (!isLoggedIn) {
                  return { ...course, isEnrolled: false };
                }
                try {
                  const isEnrolled = await courseService.isCourseEnrolled(course.courseId);
                  return { ...course, isEnrolled };
                } catch {
                  return { ...course, isEnrolled: false };
                }
              })
          );
          setRelatedCourses(relatedWithEnrollment);
        } else {
          setRelatedCourses([]);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load course data or related courses. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsCheckingAccess(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [courseId, isLoggedIn, user, fetchSession, navigate]);

  useEffect(() => {
    localStorage.setItem('autoPlayEnabled', JSON.stringify(isAutoPlayEnabled));
  }, [isAutoPlayEnabled]);

  const videoOptionsRef = useRef({
    autoplay: true,
    controls: true,
    responsive: true,
    sources: [],
  });

  // Update videoOptionsRef when courseData is loaded
  useEffect(() => {
    if (courseData?.chapters?.length > 0 && courseData.chapters[0].url) {
      videoOptionsRef.current = {
        ...videoOptionsRef.current,
        sources: [{ src: courseData.chapters[0].url, type: 'application/x-mpegURL' }],
      };
    } else {
      videoOptionsRef.current = {
        ...videoOptionsRef.current,
        sources: [],
      };
    }
  }, [courseData]);

  const getSidebarPadding = () => {
    if (isSidebarOpen) {
      return window.innerWidth < 640 ? 'pl-0' : isSidebarMini ? 'pl-24' : 'pl-72';
    }
    return 'pl-0';
  };

  const handleReady = (player) => {
    setPlayerInstance(player);
    player.on('play', () => {
      setIsPlaying(true);
      setError(null);
    });
    player.on('pause', () => {
      setIsPlaying(false);
    });
    player.on('error', () => {
      setError('Failed to load video. Please try again.');
    });
  };

  useEffect(() => {
    if (playerInstance && courseData?.chapters?.length > 0) {
      const handleEnded = () => {
        setIsPlaying(false);
        setCourseData((prev) => {
          if (!prev) return prev;
          const updatedChapters = prev.chapters.map((chapter, index) =>
            index === currentIndex ? { ...chapter, completed: true } : chapter
          );
          if (isAutoPlayEnabled && currentIndex < updatedChapters.length - 1) {
            setCurrentIndex(currentIndex + 1);
          }
          return { ...prev, chapters: updatedChapters };
        });
      };
      playerInstance.on('ended', handleEnded);
      return () => {
        playerInstance.off('ended', handleEnded);
      };
    }
  }, [playerInstance, isAutoPlayEnabled, currentIndex, courseData]);

  useEffect(() => {
    if (playerInstance && courseData?.chapters?.length > 0) {
      const newOptions = {
        ...videoOptionsRef.current,
        sources: [
          {
            src: courseData.chapters[currentIndex].url || '',
            type: 'application/x-mpegURL',
          },
        ],
      };
      const currentSrc = playerInstance.currentSource()?.src || '';
      if (currentSrc !== newOptions.sources[0].src && newOptions.sources[0].src) {
        videoOptionsRef.current = newOptions;
        playerInstance.src(newOptions.sources);
        setError(null);
      }
    }
  }, [playerInstance, currentIndex, courseData]);

  const handleLectureChange = (index) => {
    if (courseData?.chapters?.length > index) {
      setCurrentIndex(index);
      setError(null);
      setShowDescription(false);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlayEnabled((prev) => !prev);
  };

  // Render loading, error, or redirect state
  if (isCheckingAccess || !courseData) {
    return (
      <section
        className={`relative bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 min-h-screen pt-16 pb-12 px-4 sm:px-8 lg:px-12 ${getSidebarPadding()} transition-all duration-300 font-sans`}
      >
        <div className="w-full max-w-8xl mx-auto text-center">
          {isCheckingAccess ? (
            <div className="text-gray-400">Checking course access...</div>
          ) : error ? (
            <>
              <div className="text-red-400">{error}</div>
              {error.includes('not enrolled') && (
                <button
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="mt-4 px-4 py-2 bg-indigo-600 rounded-full text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-300"
                >
                  View Course Details
                </button>
              )}
              {error.includes('login') && (
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 px-4 py-2 bg-indigo-600 rounded-full text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-300"
                >
                  Go to Login
                </button>
              )}
            </>
          ) : (
            <div className="text-gray-400">Loading course data...</div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 min-h-screen pt-16 pb-12 px-4 sm:px-8 lg:px-12 ${getSidebarPadding()} transition-all duration-300 font-sans`}
    >
      <div className="w-full max-w-8xl mx-auto">
        <motion.div variants={FADE_IN_UP} initial="initial" animate="animate" className="mb-6">
          <nav className="text-sm text-gray-400 flex items-center gap-2">
            <BookOpen size={16} className="text-teal-400" />
            <a href="/CoursePage" className="hover:text-teal-400 transition-colors">Courses</a> /{' '}
            <span className="text-gray-200">{courseData.title}</span>
          </nav>
        </motion.div>

        <motion.div variants={FADE_IN_UP} initial="initial" animate="animate" className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4 bg-gray-800/30 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">
            <div className="relative w-full" style={{ height: 'clamp(400px, 50vw, 600px)', backgroundColor: '#000' }}>
              {error ? (
                <div className="flex items-center justify-center h-full bg-gray-900 text-red-400 text-sm">{error}</div>
              ) : courseData.chapters.length === 0 ? (
                <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400 text-sm">
                  No videos available for this course.
                </div>
              ) : (
                <VideoPlayer options={videoOptionsRef.current} onReady={handleReady} />
              )}
            </div>
            <motion.div
              variants={FADE_IN_UP}
              initial="initial"
              animate="animate"
              key={currentIndex}
              className="p-4 sm:p-4 bg-gradient-to-r from-gray-800/30 to-gray-850/30 backdrop-blur-md rounded-b-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                    <h1 className="text-xl sm:text-2xl font-bold text-white hover:underline transition-all duration-200">
                      {courseData.title}
                    </h1>
                  </div>
                  {courseData.chapters.length > 0 && (
                    <>
                      <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                        {courseData.chapters[currentIndex].title}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-gray-300 mb-2">
                        <Clock size={12} className="text-teal-400" />
                        <span>Duration: {courseData.chapters[currentIndex].duration}</span>
                      </div>
                    </>
                  )}
                  <p className="text-xs sm:text-sm text-gray-400 max-w-xl line-clamp-2">
                    {courseData.description}
                  </p>
                  <AnimatePresence>
                    {showDescription && courseData.chapters.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-xs text-gray-400 max-w-xl mt-2">
                          {courseData.chapters[currentIndex].description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {courseData.chapters.length > 0 && (
                    <button
                      onClick={() => setShowDescription(!showDescription)}
                      className="text-xs text-teal-400 hover:text-teal-300 mt-1 transition-colors"
                    >
                      {showDescription ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
                <div className="flex gap-2 sm:self-start">
                  {courseData.chapters.length > 0 && (
                    <motion.button
                      onClick={toggleAutoPlay}
                      className={`relative w-12 h-7 rounded-full p-1 flex items-center ${
                        isAutoPlayEnabled ? 'bg-teal-500' : 'bg-gray-600'
                      } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 group`}
                      aria-label={`Auto-Play ${isAutoPlayEnabled ? 'On' : 'Off'}`}
                      aria-checked={isAutoPlayEnabled}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-md"
                        variants={TOGGLE_VARIANTS}
                        animate={isAutoPlayEnabled ? 'on' : 'off'}
                      />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        {isAutoPlayEnabled ? 'Auto-Play On' : 'Auto-Play Off'}
                      </span>
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => navigate('/quiz')}
                    className="px-4 py-2 bg-indigo-600 rounded-full text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-300 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Take Quiz
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          <aside className="w-full lg:w-1/4 bg-gray-800/30 backdrop-blur-md rounded-2xl shadow-xl p-5 max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 border border-gray-700/50">
            {courseData.chapters.length > 0 && (
              <>
                <motion.button
                  className="lg:hidden flex items-center gap-2 text-gray-200 mb-5 hover:text-teal-400 transition-colors duration-200"
                  onClick={() => setShowChapters(!showChapters)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <List size={18} className="text-teal-400" />
                  <span className="text-sm font-medium">{showChapters ? 'Hide Lectures' : 'Show Lectures'}</span>
                </motion.button>
                <AnimatePresence>
                  {showChapters || window.innerWidth >= 1024 ? (
                    <motion.div
                      variants={FADE_IN_UP}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-teal-400 mb-4">Course Lectures</h3>
                      <div className="space-y-3">
                        {courseData.chapters.map((lecture, index) => (
                          <motion.button
                            key={lecture.id}
                            variants={ITEM_FADE}
                            onClick={() => handleLectureChange(index)}
                            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 ${
                              index === currentIndex
                                ? 'bg-teal-500/20 border-teal-500 text-white'
                                : 'bg-gray-700/50 text-gray-200 hover:bg-gray-600/50'
                            } border border-gray-600/50 transition-colors duration-200`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span>
                              {lecture.completed ? (
                                <CheckCircle size={14} className="text-teal-400" />
                              ) : (
                                <Play size={14} className="text-gray-400" />
                              )}
                            </span>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{lecture.title}</h4>
                              <p className="text-xs text-gray-400">{lecture.duration}</p>
                              <div className="mt-1 h-1 bg-gray-600 rounded-full">
                                <div
                                  className={`h-full rounded-full ${lecture.completed ? 'bg-teal-400' : 'bg-gray-500'}`}
                                  style={{ width: lecture.completed ? '100%' : '0%' }}
                                />
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </>
            )}
          </aside>
        </motion.div>

        {/* Related Courses Section */}
        {relatedCourses.length > 0 && (
          <motion.div
            variants={FADE_IN_UP}
            initial="initial"
            animate="animate"
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-teal-400 mb-6">Related Courses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCourses.map((course) => (
                <CourseCard
                  key={course.courseId}
                  courseId={course.courseId}
                  title={course.courseName || 'Untitled Course'}
                  image={course.thumbnailUrl}
                  lessons={course.lessonCount || course.videos?.length || 0}
                  duration={formatDuration(course.duration)}
                  comments={course.commentCount || 0}
                  level={course.difficultyLevel || 'Unknown'}
                  price={course.price || 0}
                  isEnrolled={course.isEnrolled}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default VideoStreamingPage;