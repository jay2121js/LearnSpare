import React, { useState } from 'react';
import { Edit2, Image } from 'lucide-react';
import courseService from '../Services/courseService';

const UpdateCourse = ({ courseId, initialData, onUpdateSuccess, onClose }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [difficulty, setDifficulty] = useState(initialData.difficultyLevel || initialData.difficulty || '');
  const [price, setPrice] = useState(initialData.price ? initialData.price.toString() : '');
  const [thumbnail, setThumbnail] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!difficulty) newErrors.difficulty = 'Difficulty level is required.';
    const priceValue = parseFloat(price);
    if (price.trim() === '') newErrors.price = 'Price is required.';
    else if (isNaN(priceValue) || priceValue < 0) newErrors.price = 'Price must be a valid non-negative number.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);
  const courseDto = {
    title,
    difficultyLevel: difficulty,
    price: parseFloat(price) || 0, // Convert to number for backend
  };

  try {
    await courseService.updateCourse(courseId, courseDto, thumbnail);
    setMessage('Course updated successfully!');
    onUpdateSuccess(); // Call without passing the response
    setThumbnail(null);
    document.getElementById(`thumbnail-input-${courseId}`).value = '';
    setTimeout(() => {
      setMessage('');
      onClose();
    }, 2000);
  } catch (error) {
    setMessage(error.message || 'Failed to update course.');
    console.error('Course update error:', error);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="p-4 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-700/50 space-y-4">
      <h3 className="text-lg font-semibold text-gray-100">Update Course</h3>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor={`title-${courseId}`} className="flex items-center text-sm font-medium text-gray-300 mb-1 space-x-1">
            <Edit2 size={16} className="text-indigo-400" />
            <span>Title <span className="text-red-400" aria-hidden="true">*</span></span>
          </label>
          <input
            id={`title-${courseId}`}
            type="text"
            className={`w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ${errors.title ? 'border-red-400' : ''}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-required="true"
            aria-describedby={errors.title ? `title-error-${courseId}` : undefined}
            placeholder="Course Title"
          />
          {errors.title && <p id={`title-error-${courseId}`} className="text-red-400 text-sm mt-1">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor={`difficulty-${courseId}`} className="flex items-center text-sm font-medium text-gray-300 mb-1 space-x-1">
            <Edit2 size={16} className="text-indigo-400" />
            <span>Difficulty Level <span className="text-red-400" aria-hidden="true">*</span></span>
          </label>
          <select
            id={`difficulty-${courseId}`}
            className={`w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ${errors.difficulty ? 'border-red-400' : ''}`}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-required="true"
            aria-describedby={errors.difficulty ? `difficulty-error-${courseId}` : undefined}
          >
            <option value="" disabled>Select difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          {errors.difficulty && <p id={`difficulty-error-${courseId}`} className="text-red-400 text-sm mt-1">{errors.difficulty}</p>}
        </div>
        <div>
          <label htmlFor={`price-${courseId}`} className="flex items-center text-sm font-medium text-gray-300 mb-1 space-x-1">
            <Edit2 size={16} className="text-indigo-400" />
            <span>Price <span className="text-red-400" aria-hidden="true">*</span></span>
          </label>
          <input
            id={`price-${courseId}`}
            type="text"
            className={`w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ${errors.price ? 'border-red-400' : ''}`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            aria-required="true"
            aria-describedby={errors.price ? `price-error-${courseId}` : undefined}
            placeholder="Course Price (e.g., 49.99)"
          />
          {errors.price && <p id={`price-error-${courseId}`} className="text-red-400 text-sm mt-1">{errors.price}</p>}
        </div>
        <div>
          <label htmlFor={`thumbnail-input-${courseId}`} className="flex items-center text-sm font-medium text-gray-300 mb-1 space-x-1">
            <Image size={16} className="text-indigo-400" />
            <span>Thumbnail</span>
          </label>
          <input
            id={`thumbnail-input-${courseId}`}
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 cursor-pointer"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            aria-label={isLoading ? 'Updating course...' : 'Update course'}
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            <span>{isLoading ? 'Updating...' : 'Update Course'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-gray-300 font-medium bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 transform hover:scale-105"
            aria-label="Cancel update"
          >
            Cancel
          </button>
        </div>
      </form>
      {(Object.keys(errors).length > 0 || message) && (
        <div
          className={`p-3 rounded-lg text-sm ${message.includes('Failed') || Object.keys(errors).length > 0 ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}
          role="alert"
        >
          {Object.keys(errors).length > 0 && (
            <ul className="list-disc pl-4">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}
          {message && !Object.keys(errors).length && message}
        </div>
      )}
    </div>
  );
};

export default UpdateCourse;