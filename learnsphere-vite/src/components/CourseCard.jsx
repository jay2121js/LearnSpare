import React from 'react';
import PropTypes from 'prop-types';
import { Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const CourseCard = ({
  courseId,
  title,
  image,
  lessons,
  duration,
  comments,
  level,
  price,
  isEnrolled = false,
  isOwned = false, // Added with default false
}) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Navigate to course details for non-owned courses
    navigate(`/courses/${courseId}`);
  };

  const handleEditClick = () => {
    // Navigate to course edit page for owned courses
    navigate(`/courses/${courseId}`); // Adjust the route as per your app's structure
  };

  // Format duration to a readable format (e.g., "2h 30m" or "45m")
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700/50 overflow-hidden transition duration-300 hover:shadow-2xl hover:-translate-y-1">
      <img
        src={image || 'https://via.placeholder.com/300x150?text=Course+Thumbnail'}
        alt={title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col">
        <h3
          className="font-semibold text-lg text-gray-100 mb-2 leading-tight h-[3rem] overflow-hidden"
          style={{ lineHeight: '1.5rem' }}
        >
          {title}
        </h3>
        <div className="flex items-center text-xs text-gray-400 mb-3">
          <BookOpen className="w-4 h-4 mr-1 text-indigo-400" />
          {lessons} Lesson{lessons !== 1 ? 's' : ''}
          <span className="mx-2">•</span>
          <Clock className="w-4 h-4 mr-1 text-indigo-400" />
          {formatDuration(duration)}
        </div>
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded-full text-xs">
            {level || 'All Levels'}
          </span>
          {price > 0 ? (
            <span className="text-purple-400 font-medium">${price.toFixed(2)}</span>
          ) : (
            <span className="text-green-400 font-medium">Free</span>
          )}
        </div>
        {isOwned ? (
          <button
            onClick={handleEditClick}
            className="mt-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
            aria-label={`Edit course ${title}`}
          >
            Edit Course
          </button>
        ) : (
          <button
            onClick={handleButtonClick}
            className="mt-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
            aria-label={`View details for ${title}`}
          >
            {isLoggedIn ? (isEnrolled ? 'Continue Learning' : 'Join Class Now') : 'Explore Course'}
          </button>
        )}
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  lessons: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  comments: PropTypes.number.isRequired,
  level: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  isEnrolled: PropTypes.bool,
  isOwned: PropTypes.bool, // Added as optional
};

CourseCard.defaultProps = {
  isEnrolled: false,
  isOwned: false, // Ensure default is false to avoid breaking existing uses
};

export default CourseCard;