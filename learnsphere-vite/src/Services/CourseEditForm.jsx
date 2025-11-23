import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import courseService from '../Services/courseService';

export default function CourseEditForm({ courseId, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    courseName: '',
    title: '',
    description: '',
    category: '',
    price: '',
    difficultyLevel: '',
    thumbnailFile: null, // optional
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const data = await courseService.getCourse(courseId);
        setFormData({
          courseName: data.courseName || '',
          title: data.title || '',
          description: data.description || '',
          category: data.category || '',
          price: data.price?.toString() || '',
          difficultyLevel: data.difficultyLevel || '',
          thumbnailFile: null,
        });
      } catch (err) {
        console.error('Failed to load course:', err);
        setError('Could not load course details.');
      }
    })();
  }, [isOpen, courseId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0] || null;
    setFormData((prev) => ({ ...prev, thumbnailFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = new FormData();
     console.log("courseName:", formData.courseName);
payload.append('courseName', formData.courseName ?? "");
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('price', formData.price);
      payload.append('difficultyLevel', formData.difficultyLevel);  
      
      await courseService.updateCourse(courseId, payload);
      if (formData.thumbnailFile) {
        const thumbnail = new  FormData();
        thumbnail.append('file', formData.thumbnailFile)
      await courseService.updateCourseThumbnail(courseId, thumbnail);

      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update course.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-100">Edit Course</h2>
          <button onClick={onClose} aria-label="Close modal">
            <X size={20} className="text-gray-300 hover:text-gray-100" />
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Course Name</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Price (₹)</label>
            <input
              type="text"
              inputMode="decimal"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 499.99"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Difficulty Level</label>
            <input
              type="text"
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Thumbnail (optional)</label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}

CourseEditForm.propTypes = {
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
