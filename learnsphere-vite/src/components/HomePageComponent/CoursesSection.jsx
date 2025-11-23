import React, { useState } from 'react';
import { Users, Clock, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const CoursesSection = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';

  // Mock course data
  const mockCourses = [
    {
      id: 1,
      title: 'React Basics',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
      lessons: 12,
      duration: '6h',
      comments: 5,
      level: 'Beginner',
      price: 99.0,
      usersCount: 200,
      category: 'Featured',
      rating: 4.5,
    },
    {
      id: 2,
      title: 'Python for Data Science',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      lessons: 15,
      duration: '8h',
      comments: 10,
      level: 'Intermediate',
      price: 149.0,
      usersCount: 300,
      category: 'New',
      rating: 4.8,
    },
    {
      id: 3,
      title: 'UI/UX Design Mastery',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      lessons: 10,
      duration: '5h',
      comments: 3,
      level: 'Advanced',
      price: 129.0,
      usersCount: 150,
      category: 'Popular',
      rating: 4.2,
    },
    {
      id: 4,
      title: 'Advanced JavaScript',
      image: 'https://images.unsplash.com/photo-1581091012184-7e642f8f4024',
      lessons: 20,
      duration: '10h',
      comments: 8,
      level: 'Intermediate',
      price: 199.0,
      usersCount: 250,
      category: 'Featured',
      rating: 4.7,
    },
    {
      id: 5,
      title: 'Node.js Essentials',
      image: 'https://images.unsplash.com/photo-1618401471353-b98c559e93b9',
      lessons: 18,
      duration: '7h',
      comments: 7,
      level: 'Intermediate',
      price: 159.0,
      usersCount: 180,
      category: 'New',
      rating: 4.6,
    },
    {
      id: 6,
      title: 'Machine Learning Intro',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      lessons: 14,
      duration: '9h',
      comments: 12,
      level: 'Advanced',
      price: 179.0,
      usersCount: 220,
      category: 'Popular',
      rating: 4.9,
    },
  ];

  // Navigation options
  const navOptions = ['Home', 'Featured', 'New', 'Popular'];

  // Handle enrollment (mocked for frontend-only)
  const handleEnrollClick = (courseId, courseTitle) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds(prev => [...prev, courseId]);
      alert(`Successfully enrolled in "${courseTitle}"!`);
    }
  };

  // Filter courses by active navigation tab
  const filteredCourses = mockCourses.filter(course =>
    activeNav === 'Home' || course.category === activeNav
  );

  return (
    <div className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Explore Our Courses</h2>

        {/* Navigation Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-700">
          {navOptions.map(option => (
            <button
              key={option}
              onClick={() => setActiveNav(option)}
              className={`pb-3 text-base font-medium transition-colors ${
                activeNav === option
                  ? 'text-teal-300 border-b-2 border-teal-300'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <p className="text-gray-400 text-center">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                className="group bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ease-out hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={course.image || defaultAvatar}
                  alt={course.title}
                  className="w-full h-40 object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                />
                <div className="p-4 space-y-3">
                  <h3 className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{course.lessons} Lesson{course.lessons > 1 ? 's' : ''}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {course.comments} Comment{course.comments > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-300">
                      {course.level}
                    </span>
                    <span className="flex items-center text-sm text-gray-300">
                      <Users className="w-4 h-4 mr-1" />
                      {course.usersCount}+
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-teal-400 font-bold text-lg">
                      ${course.price}
                      <small className="text-sm text-gray-400">/lifetime</small>
                    </span>
                    <button
                      onClick={() => handleEnrollClick(course.id, course.title)}
                      disabled={enrolledCourseIds.includes(course.id)}
                      className={`bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition ${
                        enrolledCourseIds.includes(course.id) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {enrolledCourseIds.includes(course.id) ? 'Continue Learning' : 'Join class now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesSection;