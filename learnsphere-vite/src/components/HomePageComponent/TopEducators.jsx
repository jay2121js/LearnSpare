import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, BookOpen } from 'lucide-react';

// Mock data (enhanced with id, experience, rating, achievement)
const instructors = [
  {
    id: '1',
    name: 'Dr. Anjali Sharma',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    expertise: 'Data Science & AI',
    experience: '12 years',
    courses: 12,
    reviews: 4800,
    rating: 4.8,
    achievement: 'AI Innovator 2024',
  },
  {
    id: '2',
    name: 'Rahul Verma',
    image: 'https://randomuser.me/api/portraits/men/36.jpg',
    expertise: 'Full Stack Web Dev',
    experience: '9 years',
    courses: 8,
    reviews: 3700,
    rating: 4.7,
    achievement: 'Top Developer',
  },
  {
    id: '3',
    name: 'Neha Kapoor',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    expertise: 'UI/UX Design',
    experience: '6 years',
    courses: 5,
    reviews: 2200,
    rating: 4.9,
    achievement: 'Design Excellence',
  },
  {
    id: '4',
    name: 'Arjun Mehta',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    expertise: 'Cloud Computing',
    experience: '10 years',
    courses: 9,
    reviews: 3100,
    rating: 4.6,
    achievement: 'Cloud Pioneer',
  },
];

const TopEducators = () => {
  const navigate = useNavigate();
  const [educators, setEducators] = useState(instructors);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Future API integration (uncomment when educatorService is available)
  /*
  useEffect(() => {
    const fetchEducators = async () => {
      setLoading(true);
      try {
        const data = await educatorService.getTopEducators();
        setEducators(data || []);
      } catch (err) {
        console.error('Failed to fetch educators:', err);
        setError('Failed to load educators. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchEducators();
  }, []);
  */

  // Memoize educators to prevent recalculations
  const memoizedEducators = useMemo(() => educators, [educators]);

  const handleCardClick = (educatorId) => {
    navigate(`/educators/${educatorId}`);
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeSlide {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .fade-slide {
            animation: fadeSlide 0.5s ease-out forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            .fade-slide {
              animation: none;
            }
          }
        `}
      </style>
      <section className="bg-gray-800 text-white py-12" role="region" aria-labelledby="top-educators-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="top-educators-heading" className="text-4xl font-extrabold text-white mb-8 text-center">
            Meet Our Top Educators
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-800 border-l-4 border-red-400 text-red-100 p-4 rounded-lg flex items-center mb-8" role="alert">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="bg-gray-900/80 rounded-2xl shadow-md p-6 animate-pulse text-center"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-gray-700/50 mb-4"></div>
                  <div className="h-6 bg-gray-700/50 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-1/2 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-2/3 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {memoizedEducators.map((educator, index) => (
                <div
                  key={educator.id}
                  className="group bg-gray-900/80 rounded-2xl shadow-md p-6 text-center cursor-pointer transition duration-300 ease-out hover:scale-102 hover:shadow-lg fade-slide"
                  onClick={() => handleCardClick(educator.id)}
                  role="link"
                  tabIndex="0"
                  aria-label={`View profile of ${educator.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCardClick(educator.id);
                    }
                  }}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <img
                      loading="lazy"
                      src={educator.image}
                      alt={`Profile photo of ${educator.name}`}
                      className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-2 border-gray-700/50"
                    />
                    {educator.achievement && (
                      <span className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 rounded-full">
                        {educator.achievement}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">
                    {educator.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">{educator.expertise}</p>
                  <div className="text-sm text-gray-400 flex flex-wrap justify-center gap-3">
                    <span>{educator.experience}</span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={16} />
                      {educator.courses} Courses
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400" />
                      {educator.rating}/5 ({educator.reviews.toLocaleString()} Reviews)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TopEducators;