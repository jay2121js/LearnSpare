import React, { useEffect, useState } from 'react';
import { BookOpen, RefreshCw, LogIn } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import courseService from '../Services/courseService';
import CourseCard from './CourseCard'; // Adjust path if needed

const MyLearning = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [ownedCourses, setOwnedCourses] = useState([]);
  const [loadingEnrolled, setLoadingEnrolled] = useState(true);
  const [loadingOwned, setLoadingOwned] = useState(true);
  const [errorEnrolled, setErrorEnrolled] = useState('');
  const [errorOwned, setErrorOwned] = useState('');

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchCourses = async () => {
      // Fetch enrolled courses
      setLoadingEnrolled(true);
      setErrorEnrolled('');
      try {
        const enrolled = await courseService.getEnrolledCourses(user?.id);
        setEnrolledCourses(enrolled || []);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setErrorEnrolled('Failed to load your enrolled courses.');
      } finally {
        setLoadingEnrolled(false);
      }

      // Fetch owned courses
      setLoadingOwned(true);
      setErrorOwned('');
      try {
        const owned = await courseService.myOwnedCourses();
        setOwnedCourses(owned || []);
      } catch (err) {
        console.error('Error fetching owned courses:', err);
        setErrorOwned('Failed to load your created courses.');
      } finally {
        setLoadingOwned(false);
      }
    };

    fetchCourses();
  }, [isLoggedIn, user]);

  const handleRetryEnrolled = () => {
    setLoadingEnrolled(true);
    setErrorEnrolled('');
    courseService
      .getEnrolledCourses(user?.id)
      .then((courses) => setEnrolledCourses(courses || []))
      .catch((err) => {
        console.error('Retry enrolled courses failed:', err);
        setErrorEnrolled('Failed to load your enrolled courses.');
      })
      .finally(() => setLoadingEnrolled(false));
  };

  const handleRetryOwned = () => {
    setLoadingOwned(true);
    setErrorOwned('');
    courseService
      .myOwnedCourses()
      .then((courses) => setOwnedCourses(courses || []))
      .catch((err) => {
        console.error('Retry owned courses failed:', err);
        setErrorOwned('Failed to load your created courses.');
      })
      .finally(() => setLoadingOwned(false));
  };

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-indigo-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 mb-4 tracking-tight animate-fade-in">
            {isLoggedIn ? 'Your Learning Dashboard' : 'Unlock Your Learning Potential'}
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
            {isLoggedIn
              ? 'Track your progress, manage your created courses, and continue your learning journey.'
              : 'Log in to access personalized courses and start mastering new skills today.'}
          </p>
          {!isLoggedIn && (
            <button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium text-base sm:text-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              aria-label="Log in to access your courses"
            >
              <LogIn size={18} className="inline mr-2" /> Log In
            </button>
          )}
        </div>
      </section>

      {/* My Creations Section */}
      {isLoggedIn && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-gray-700 rounded-xl p-6 sm:p-8 border border-gray-600">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-6 text-center animate-fade-in">
              My Creations
            </h2>
            {loadingOwned ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-700 rounded-xl p-4 shadow-sm animate-pulse border border-gray-600">
                    <div className="w-full h-48 bg-gray-600 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="h-10 bg-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
            ) : errorOwned ? (
              <div className="text-center bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-600 animate-fade-in" role="alert">
                <p className="text-lg text-red-400">{errorOwned}</p>
                <button
                  onClick={handleRetryOwned}
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
                  aria-label="Retry loading created courses"
                >
                  <RefreshCw size={18} className="inline mr-2" /> Try Again
                </button>
              </div>
            ) : ownedCourses.length === 0 ? (
              <div className="text-center py-12 bg-gray-700 rounded-xl shadow-sm border border-gray-600 animate-fade-in">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
                <p className="text-lg font-medium text-gray-100">No Courses Created Yet</p>
                <p className="text-base text-gray-300 mt-2 max-w-md mx-auto">
                  Start creating your own courses to share your knowledge with the world.
                </p>
                <button
                  onClick={() => navigate('/create-course')} // Adjust route as needed
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
                  aria-label="Create a new course"
                >
                  Create a Course
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ownedCourses.map((course, index) => (
                  <div key={course.courseId} className={`animate-fade-in delay-${index * 100}`}>
                    <CourseCard
                      courseId={course.courseId}
                      title={course.title}
                      image={course.thumbnailUrl}
                      lessons={course.lessonCount || 0}
                      duration={course.duration || 0}
                      comments={course.commentCount || 0}
                      level={course.difficultyLevel || 'All Levels'}
                      price={course.price || 0}
                      isEnrolled={false} // Owned courses may not be enrolled
                      isOwned={true} // Indicate this is an owned course
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* My Enrolled Courses Section */}
      {isLoggedIn && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-gray-700 rounded-xl p-6 sm:p-8 border border-gray-600">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-6 text-center animate-fade-in">
              My Enrolled Courses
            </h2>
            {loadingEnrolled ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-700 rounded-xl p-4 shadow-sm animate-pulse border border-gray-600">
                    <div className="w-full h-48 bg-gray-600 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="h-10 bg-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
            ) : errorEnrolled ? (
              <div className="text-center bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-600 animate-fade-in" role="alert">
                <p className="text-lg text-red-400">{errorEnrolled}</p>
                <button
                  onClick={handleRetryEnrolled}
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
                  aria-label="Retry loading enrolled courses"
                >
                  <RefreshCw size={18} className="inline mr-2" /> Try Again
                </button>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-12 bg-gray-700 rounded-xl shadow-sm border border-gray-600 animate-fade-in">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
                <p className="text-lg font-medium text-gray-100">No Courses Enrolled Yet</p>
                <p className="text-base text-gray-300 mt-2 max-w-md mx-auto">
                  Discover our curated course catalog to start your learning journey.
                </p>
                <button
                  onClick={() => navigate('/CoursePage')}
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
                  aria-label="Browse available courses"
                >
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {enrolledCourses.map((course, index) => (
                  <div key={course.courseId} className={`animate-fade-in delay-${index * 100}`}>
                    <CourseCard
                      courseId={course.courseId}
                      title={course.title}
                      image={course.thumbnailUrl}
                      lessons={course.lessonCount || 0}
                      duration={course.duration || 0}
                      comments={course.commentCount || 0}
                      level={course.difficultyLevel || 'All Levels'}
                      price={course.price || 0}
                      isEnrolled={true}
                      progress={course.progress || 0} // Assuming progress is available
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default MyLearning;