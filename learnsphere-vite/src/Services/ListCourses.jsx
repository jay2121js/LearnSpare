import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import courseService from '../Services/courseService';
import CourseCard from '../components/CourseCard'; // Adjust path if needed

const ListCourses = () => {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [ownedCourseIds, setOwnedCourseIds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navOptions = ['Home', 'Beginner', 'Intermediate', 'Advanced'];

  // Fetch courses, enrolled course IDs, and owned course IDs concurrently
  useEffect(() => {
    const fetchCoursesAndEnrollment = async () => {
      setLoading(true);
      try {
        const coursePromise = courseService.getAllCourses();
        const enrollmentPromise = isLoggedIn
          ? courseService.getEnrolledCourseIds()
          : Promise.resolve([]);
        const ownedPromise = isLoggedIn
          ? courseService.getOwnedCourseIds()
          : Promise.resolve([]);
        const [allCourses, enrolledIds, ownedIds] = await Promise.all([
          coursePromise,
          enrollmentPromise,
          ownedPromise,
        ]);

        setCourses(allCourses || []);
        setEnrolledCourseIds(enrolledIds || []);
        setOwnedCourseIds(ownedIds || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(
          err.message || 'Failed to load courses or enrollment data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchCoursesAndEnrollment();
    }
  }, [authLoading, isLoggedIn]);

  // Memoize enrolled, owned, and filtered courses to prevent recalculations
  const enrolledCourses = useMemo(() => {
    if (!isLoggedIn) return [];
    return courses
      .filter((course) => enrolledCourseIds.includes(course.courseId))
      .slice(0, 10);
  }, [courses, enrolledCourseIds, isLoggedIn]);

  const ownedCourses = useMemo(() => {
    if (!isLoggedIn) return [];
    return courses
      .filter((course) => ownedCourseIds.includes(course.courseId))
      .slice(0, 10);
  }, [courses, ownedCourseIds, isLoggedIn]);

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesDifficulty =
          activeNav === 'Home' || course.difficultyLevel === activeNav;
        const notEnrolled = !enrolledCourseIds.includes(course.courseId);
        const notOwned = !ownedCourseIds.includes(course.courseId);
        return matchesDifficulty && notEnrolled && notOwned;
      })
      .slice(0, 10);
  }, [courses, activeNav, enrolledCourseIds, ownedCourseIds]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 pb-5 pt-10 my-0">
      <div className="w-[90%] sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div
            className="bg-red-900/20 border-l-4 border-red-400 text-red-100 p-4 rounded-xl mb-8 flex items-center"
            role="alert"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p>{error}</p>
            <button
              className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg transition duration-300"
              onClick={() => window.location.reload()}
              aria-label="Retry loading courses"
            >
              Try Again
            </button>
          </div>
        )}

        {/* My Creations */}
        {isLoggedIn && !authLoading && !loading && ownedCourses.length > 0 && (
          <div className="mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              My Creations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ownedCourses.map((course) => (
                <CourseCard
                  key={course.courseId}
                  courseId={course.courseId}
                  title={course.title}
                  image={course.thumbnailUrl}
                  lessons={course.lessonCount}
                  duration={course.duration}
                  comments={course.commentCount}
                  level={course.difficultyLevel}
                  price={course.price}
                  isEnrolled={false} // Owned courses are not necessarily enrolled
                  isOwned={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* My Learnings */}
        {isLoggedIn && !authLoading && !loading && enrolledCourses.length > 0 && (
          <div className="mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              My Learnings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course.courseId}
                  courseId={course.courseId}
                  title={course.title}
                  image={course.thumbnailUrl}
                  lessons={course.lessonCount}
                  duration={course.duration}
                  comments={course.commentCount}
                  level={course.difficultyLevel}
                  price={course.price}
                  isEnrolled={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Explore Our Courses */}
        <div id="courses" className="scroll-mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Explore Our Courses
          </h2>
          {/* Tabs for difficulty level */}
          <div className="flex gap-4 mb-8 border-b border-gray-700">
            {navOptions.map((option) => (
              <button
                key={option}
                onClick={() => setActiveNav(option)}
                className={`pb-3 px-4 text-base md:text-lg font-medium transition-colors duration-200 rounded-t-md ${
                  activeNav === option
                    ? 'text-indigo-300 border-b-2 border-indigo-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                }`}
                aria-selected={activeNav === option}
                aria-controls="course-grid"
              >
                {option}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          {loading || authLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse">
                  <div className="w-full h-40 bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
              <p className="text-lg">No courses found.</p>
              <button
                onClick={() => setActiveNav('Home')}
                className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium transition duration-300"
                aria-label="Show all courses"
              >
                Show All Courses
              </button>
            </div>
          ) : (
            <div
              id="course-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.courseId}
                  courseId={course.courseId}
                  title={course.title}
                  image={course.thumbnailUrl}
                  lessons={course.lessonCount}
                  duration={course.duration}
                  comments={course.commentCount}
                  level={course.difficultyLevel}
                  price={course.price}
                  isEnrolled={false}                  
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListCourses;