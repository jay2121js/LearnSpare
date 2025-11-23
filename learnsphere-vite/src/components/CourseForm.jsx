import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import courseService from '../Services/courseService';

const CourseForm = ({ onClose }) => {
  const { user } = useAuth();
  const [courseData, setCourseData] = useState({
    name: '',
    difficultyLevel: 'Beginner',
    price: '',
    title: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!user || user.role !== 'TEACHER') {
    return (
      <div className="max-w-md mx-auto mt-8 p-8 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg text-center">
        <p className="text-red-200">You must be a teacher to create a course.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await courseService.createCourse(courseData, thumbnail);
      setSuccess('Course created successfully!');
      setCourseData({
        name: '',
        difficultyLevel: 'Beginner',
        price: '',
        title: '',
      });
      setThumbnail(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="relative max-w-md w-full mx-auto p-8 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-300 hover:text-gray-100 transition duration-300"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-200">Create New Course</h2>
        {error && <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-indigo-900 text-indigo-200 rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Course Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={courseData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg bg-gray-700/50 border-gray-600 text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Course Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={courseData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg bg-gray-700/50 border-gray-600 text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-300 mb-1">Difficulty Level</label>
            <select
              id="difficultyLevel"
              name="difficultyLevel"
              value={courseData.difficultyLevel}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg bg-gray-700/50 border-gray-600 text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={courseData.price}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg bg-gray-700/50 border-gray-600 text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300 mb-1">Thumbnail Image</label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-100 bg-gray-700/50 border-gray-600 rounded-lg p-3 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold  file:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 transform hover:scale-105"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;