import React, { useState } from 'react';
import axios from 'axios';

const UploadVideo = ({ courseId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!video) newErrors.video = 'Please select a video file.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('courseId', courseId);
    formData.append('description', description);
    formData.append('Video', video);
    const backendUri = import.meta.env.VITE_BACKEND_URI;
    

    try {
      const response = await axios.post(`${backendUri}/Instructor/addVideo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setMessage(response.data);
      setTitle('');
      setDescription('');
      setVideo(null);
      document.getElementById('video-input').value = '';
    } catch (error) {
      setMessage('Failed to upload video. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen bg-gray-900 text-white flex items-center justify-center p-4'>
    <div className="max-w-md w-full  mx-auto p-6 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-md shadow-inner border border-gray-700/50 space-y-5 sm:p-7">
      <h2 className="text-3xl font-semibold text-gray-100 text-center flex items-center justify-center space-x-2">
        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
        </svg>
        <span>Upload Video</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-300 mb-1 space-x-1">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <span>Title <span className="text-red-400" aria-hidden="true">*</span></span>
          </label>
          <input
            id="title"
            type="text"
            className={`w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ${errors.title ? 'border-red-400' : ''}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-required="true"
            aria-describedby={errors.title ? 'title-error' : undefined}
            placeholder="Video Title"
          />
        </div>

        <div>
          <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-300 mb-1 space-x-1">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Description</span>
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Video description..."
          />
        </div>

        <div>
          <label htmlFor="video-input" className="flex items-center text-sm font-medium text-gray-300 mb-1 space-x-1">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span>Select Video <span className="text-red-400" aria-hidden="true">*</span></span>
          </label>
          <input
            id="video-input"
            type="file"
            accept="video/*"
            className={`w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 cursor-pointer ${errors.video ? 'border-red-400' : ''}`}
            onChange={(e) => setVideo(e.target.files[0])}
            aria-required="true"
            aria-describedby={errors.video ? 'video-error' : undefined}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          aria-label={isLoading ? 'Uploading video...' : 'Upload video'}
        >
          {isLoading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          <span>{isLoading ? 'Uploading...' : 'Upload Now'}</span>
        </button>
      </form>

      {(Object.keys(errors).length > 0 || message) && (
        <div
          className={`p-3 rounded-lg text-sm ${message.includes('Failed') || Object.keys(errors).length > 0 ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}
          role="alert"
        >
          {Object.keys(errors).length > 0 ? (
            <ul className="list-disc pl-4">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          ) : (
            message
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default UploadVideo;