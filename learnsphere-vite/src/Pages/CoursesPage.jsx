import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, X, Search } from 'lucide-react';
import courseService from '../Services/courseService';
import CourseCard from '../components/CourseCard';

export default function CoursesPage() {
  const [coursesPage, setCoursesPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const PAGE_SIZE = 12;
  const [page, setPage] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';
  const initialCategory = queryParams.get('category') || '';
  const initialDifficulty = queryParams.get('difficulty') || '';

  const [category, setCategory] = useState(initialCategory);
  const [difficulty, setDifficulty] = useState(initialDifficulty);

  useEffect(() => {
    const updatedParams = new URLSearchParams(location.search);
    setCategory(updatedParams.get('category') || '');
    setDifficulty(updatedParams.get('difficulty') || '');
    setSearchInput(updatedParams.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await courseService.getFilteredCourses({
          page,
          size: PAGE_SIZE,
          category: category || undefined,
          difficulty: difficulty || undefined,
          search: searchQuery || undefined,
        });
        setCoursesPage(response);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [page, category, difficulty, searchQuery]);

  const handleFilterChange = (newCategory, newDifficulty) => {
    setPage(0);
    const params = new URLSearchParams();
    if (newCategory) params.set('category', newCategory);
    if (newDifficulty) params.set('difficulty', newDifficulty);
    if (searchQuery) params.set('search', searchQuery);
    navigate(`/CoursePage?${params.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (difficulty) params.set('difficulty', difficulty);
    if (searchInput) params.set('search', searchInput);
    navigate(`/CoursePage?${params.toString()}`);
  };

  const clearFilters = () => {
    setCategory('');
    setDifficulty('');
    setSearchInput('');
    setPage(0);
    navigate('/CoursePage');
  };

  const totalPages = coursesPage?.totalPages || 0;
  const courses = coursesPage?.content || [];

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
            Explore New Skills
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
            Discover expertly curated courses to master new skills at your own pace.
          </p>
          <button
            onClick={() => window.scrollTo({ top: document.getElementById('courses').offsetTop - 80, behavior: 'smooth' })}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium text-base sm:text-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            aria-label="Scroll to courses section"
          >
            Start Exploring
          </button>
        </div>
      </section>

      {/* Filters and Search Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100">Browse Courses</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="sm:hidden bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
              aria-label="Toggle filters"
            >
              {isFilterOpen ? 'Close Filters' : 'Filters'}
            </button>
            <div className={`sm:flex ${isFilterOpen ? 'block' : 'hidden'} sm:block w-full sm:w-auto transition-all duration-300`}>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full sm:w-64 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 hover:bg-gray-600 text-sm sm:text-base pl-10"
                    aria-label="Search courses"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={difficulty}
                  onChange={(e) => handleFilterChange(category, e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 hover:bg-gray-600 text-sm sm:text-base"
                  aria-label="Filter by difficulty level"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <select
                  value={category}
                  onChange={(e) => handleFilterChange(e.target.value, difficulty)}
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 hover:bg-gray-600 text-sm sm:text-base"
                  aria-label="Filter by category"
                >
                  <option value="">All Categories</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Design">Design</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Programming">Programming</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Marketing">Marketing</option>

                </select>
                {(category || difficulty || searchInput) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-900 text-red-300 font-medium hover:bg-red-800 transition-all duration-300 text-sm sm:text-base"
                    aria-label="Clear all filters and search"
                  >
                    <X size={18} /> Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <section id="courses" className="min-h-[400px]">
          {loading ? (
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
          ) : error ? (
            <div className="text-center bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-600 animate-fade-in" role="alert">
              <p className="text-lg text-red-400">{error}</p>
              <button
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
                onClick={() => window.location.reload()}
                aria-label="Retry loading courses"
              >
                Try Again
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 bg-gray-700 rounded-xl shadow-sm border border-gray-600 animate-fade-in">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
              <p className="text-lg text-gray-300">
                No courses found{searchQuery && ` for "${searchQuery}"`}.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
                aria-label="Clear all filters and search"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course, index) => (
                  <div key={course.courseId} className={`animate-fade-in delay-${index * 100}`}>
                    <CourseCard
                      courseId={course.courseId}
                      title={course.title}
                      image={course.thumbnailUrl}
                      lessons={course.lessonCount || 0}
                      duration={course.duration || 0}
                      comments={course.comments || 0}
                      level={course.level || 'All Levels'}
                      price={course.price || 0}
                      isEnrolled={course.isEnrolled || false}
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-2 bg-gray-700 border border-gray-600 rounded-full text-gray-100 hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                          page === i
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600'
                        }`}
                        aria-label={`Go to page ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page + 1 >= totalPages}
                    className="p-2 bg-gray-700 border border-gray-600 rounded-full text-gray-100 hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
                    aria-label="Next page"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </div>
  );
}