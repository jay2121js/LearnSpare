import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../Services/courseService';
import { useAuth } from '../components/AuthContext';
import { Clock, Video, User, CheckCircle, Edit2, Trash2, MoreVertical } from 'lucide-react';
import CourseEditForm from '../Services/CourseEditForm';



const UploadVideo = ({ courseId, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

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
    setMessage('');
    setIsSuccess(false);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('courseId', courseId);
    formData.append('description', description);
    formData.append('file', video);

    try {
      const response = await courseService.uploadVideo(courseId, formData);
      setMessage(response.message || 'Video uploaded successfully!');
      setIsSuccess(true);
      setTitle('');
      setDescription('');
      setVideo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to upload video. Please try again.');
      setIsSuccess(false);
      console.error('Video upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-700/50 space-y-4">
      <h3 className="text-lg font-semibold text-gray-100">Upload New Video</h3>
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
            placeholder="Video Title"
          />
          {errors.title && (
            <p id={`title-error-${courseId}`} className="text-red-400 text-sm mt-1">
              {errors.title}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`description-${courseId}`} className="flex items-center text-sm font-medium text-gray-300 mb-1 space-x-1">
            <Edit2 size={16} className="text-indigo-400" />
            <span>Description</span>
          </label>
          <textarea
            id={`description-${courseId}`}
            className="w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Video description..."
          />
        </div>
        <div>
          <label htmlFor={`video-input-${courseId}`} className="flex items-center text-sm font-medium text-gray-300 mb-1 space-x-1">
            <Video size={16} className="text-indigo-400" />
            <span>Select Video <span className="text-red-400" aria-hidden="true">*</span></span>
          </label>
          <input
            id={`video-input-${courseId}`}
            type="file"
            accept="video/*"
            ref={fileInputRef}
            className={`w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 cursor-pointer ${errors.video ? 'border-red-400' : ''}`}
            onChange={(e) => setVideo(e.target.files[0])}
            aria-required="true"
            aria-describedby={errors.video ? `video-error-${courseId}` : undefined}
          />
          {errors.video && (
            <p id={`video-error-${courseId}`} className="text-red-400 text-sm mt-1">
              {errors.video}
            </p>
          )}
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
          className={`p-3 rounded-lg text-sm ${isSuccess ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}
          role="alert"
          aria-live="polite"
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
  );
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user, isLoading: authLoading } = useAuth();
  const userEmail = user?.email;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState('');
  const [isVideoListOpen, setIsVideoListOpen] = useState(true);
  const [isTeacherToolsOpen, setIsTeacherToolsOpen] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const openEditForm = () => setIsEditOpen(true);
  const closeEditForm = () => setIsEditOpen(false);

  const dropdownRef = useRef(null);
  const videoModalRef = useRef(null);
  const editModalRef = useRef(null);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Trap focus in modals for accessibility
  useEffect(() => {
    const trapFocus = (modalRef, isOpen) => {
      if (!isOpen || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      modalRef.current.addEventListener('keydown', handleKeyDown);
      return () => modalRef.current?.removeEventListener('keydown', handleKeyDown);
    };

    trapFocus(videoModalRef, selectedVideo);
    trapFocus(editModalRef, editingVideo);
  }, [selectedVideo, editingVideo]);

  // Format seconds to "Xm Ys"
  const formatDuration = (seconds = 0) => {
    if (seconds <= 0) return '0m 00s';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m ${secs < 10 ? '0' + secs : secs}s`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  //Course edit
  const handleCourseEditSuccess = async () => {
  await refreshCourse();
  closeEditForm();
};

  // Refresh course data
  const refreshCourse = async () => {
    try {
      const fresh = await courseService.getCourse(courseId);
      setCourse(fresh);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to refresh course data.');
      console.error('Error refreshing course:', err);
    }
  };

  // Load course, check ownership, and check enrollment
  useEffect(() => {
    if (authLoading) return;

    const loadCourseAndOwnership = async () => {
      setLoading(true);
      try {
        const data = await courseService.getCourse(courseId);
        setCourse(data);

        if (isLoggedIn && userEmail) {
          console.log('Attempting to check course ownership:', { courseId, email: userEmail });
          const isOwner = await courseService.checkCourseOwnership(courseId, userEmail);
          setIsInstructor(isOwner);

          console.log('Checking enrollment status:', { courseId });
          const enrolled = await courseService.isCourseEnrolled(courseId);
          setIsEnrolled(enrolled);
        } else {
          console.log('Skipping ownership and enrollment check: not authenticated', { isLoggedIn, userEmail });
          setIsInstructor(false);
          setIsEnrolled(false);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load course data.');
        console.error('Error loading course, checking ownership, or enrollment:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseAndOwnership();
  }, [courseId, authLoading, isLoggedIn, userEmail]);

  // Handle enroll
  const handleEnroll = async () => {
    try {
      await courseService.enrollCourse(courseId);
      setIsEnrolled(true);
      await refreshCourse();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to enroll. Please try again.');
      console.error('Enroll error:', err);
    }
  };

  // Handle enrolled button click
  const handleEnrolledClick = () => {
    navigate(`/courses/${courseId}/content`);
  };

  // Handle video edit
  const handleVideoEdit = async (videoId) => {
    if (!editingVideo) {
      setEditErrors({ general: 'No video selected for editing.' });
      return;
    }

    if (!editingVideo.title?.trim()) {
      setEditErrors({ title: 'Title is required.' });
      return;
    }

    setIsLoadingEdit(true);
    try {
      // Update metadata
      const metadataFormData = new FormData();
      metadataFormData.append('title', editingVideo.title);
      metadataFormData.append('description', editingVideo.description || '');
      console.log('Updating video metadata:', { videoId, title: editingVideo.title, description: editingVideo.description || '' });
      await courseService.updateVideo(videoId, metadataFormData);

      // Update video file if provided
      if (editingVideo.newVideoFile) {
        const videoFileForm = new FormData();
        videoFileForm.append('file', editingVideo.newVideoFile);
        console.log('Updating video file:', { videoId });
        try {
          await courseService.updateVideoFile(videoId, videoFileForm);
        } catch (fileError) {
          console.error('Failed to update video file:', fileError);
          setEditErrors({
            general: fileError.response?.data?.message || 'Failed to update video file. Metadata updated successfully.',
          });
          // Continue to update frontend state even if file upload fails
        }
      }

      // Update frontend state
      setCourse((prev) => ({
        ...prev,
        videos: prev.videos.map((v) =>
          v.id === videoId
            ? { ...v, title: editingVideo.title, description: editingVideo.description || '' }
            : v
        ),
      }));
      await refreshCourse(); // Refresh course data to reflect backend changes
      setEditingVideo(null);
      setEditErrors({});
      setError('');
    } catch (err) {
      setEditErrors({
        general: err.response?.data?.message || err.message || 'Failed to update video.',
      });
      console.error('Video edit error:', {
        error: err.message,
        status: err.response?.status,
        videoId,
        data: { title: editingVideo.title, description: editingVideo.description },
      });
    } finally {
      setIsLoadingEdit(false);
    }
  };
  const handleLeactureNavigation = async(video)=>{
    console.log(course.id)
    navigate(`/stream/${video}`)
  } 

  // Handle video delete
  const handleVideoDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      console.log('Deleting video:', { videoId });
      await courseService.deleteVideo(videoId);
      await refreshCourse();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete video.');
      console.error('Video delete error:', { error: err.message, status: err.response?.status, videoId });
    }
  };

  // Handle video upload success
  const handleUploadSuccess = async () => {
    try {
      await refreshCourse();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to refresh course data.');
      console.error('Upload success refresh error:', err);
    }
  };

  // Handle course deletion
  const handleCourseDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      console.log('Deleting course:', { courseId });
      await courseService.deleteCourse(courseId);
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete course.');
      console.error('Course delete error:', { error: err.message, status: err.response?.status, courseId });
    }
  };

  const toggleVideoList = () => setIsVideoListOpen(!isVideoListOpen);
  const toggleTeacherTools = () => setIsTeacherToolsOpen(!isTeacherToolsOpen);
  const closeVideoModal = () => setSelectedVideo(null);
  const openEditVideoModal = (video) => setEditingVideo({ ...video, description: video.description || '', newVideoFile: null });
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Retry loading course
  const handleRetry = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await courseService.getCourse(courseId);
      setCourse(data);
      if (isLoggedIn && userEmail) {
        const isOwner = await courseService.checkCourseOwnership(courseId, userEmail);
        setIsInstructor(isOwner);
        const enrolled = await courseService.isCourseEnrolled(courseId);
        setIsEnrolled(enrolled);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load course data.');
      console.error('Retry error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-800 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-10 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 w-24 bg-gray-700/50 rounded-full animate-pulse"></div>
              ))}
            </div>
            <div className="h-80 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-700/50 rounded-xl animate-pulse"></div>
            <div className="h-32 bg-gray-700/50 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-center text-red-400 bg-red-500/20 p-4 rounded-lg" role="alert">
          {error}
          <button
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition duration-300"
            onClick={handleRetry}
            aria-label="Retry loading course"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return <div className="text-center text-red-400 mt-20">Course not found.</div>;
  }

  return (
    <>
      <style>
        {`
          @keyframes enrollPulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          .enroll-pulse {
            animation: enrollPulse 1.5s ease-in-out infinite;
          }
        `}
      </style>
      <div className="min-h-screen bg-gray-800 text-gray-100 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-md shadow-inner border border-gray-700/50 overflow-hidden">
            {course.thumbnailUrl && (
              <div className="relative">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-64 object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              </div>
            )}
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                {isInstructor && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleDropdown}
                      className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                      aria-label="Course options"
                      aria-expanded={isDropdownOpen}
                      aria-controls="course-options-dropdown"
                    >
                      <MoreVertical size={24} />
                    </button>
                   {/* 1️⃣ Dropdown only has its two buttons */}
                {isDropdownOpen && (
  <div
    className="absolute right-0 mt-2 w-48 bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 z-10"
    ref={dropdownRef}
  >
    <button
      onClick={() => {
        openEditForm();
        setIsDropdownOpen(false);
      }}
      className="w-full flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-700 transition duration-200"
      aria-label="Edit course details"
    >
      <Edit2 size={16} className="text-indigo-400" />
      Edit Course
    </button>
    <button
      onClick={handleCourseDelete}
      className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700 transition duration-200"
      aria-label="Delete course"
    >
      <Trash2 size={16} className="text-red-400" />
      Delete Course
    </button>
  </div>
)}


                <CourseEditForm
                  courseId={courseId}
                  isOpen={isEditOpen}
                  onClose={closeEditForm}
                  onSuccess={handleCourseEditSuccess}
                />

                  </div>
                )}
              </div>
              <p className="text-gray-300 text-lg mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-gray-700/50 px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock size={16} className="text-indigo-400" />
                  {formatDuration(course.duration)}
                </span>
                <span className="bg-blue-600/50 px-3 py-1 rounded-full flex items-center gap-1">
                  {course.level}
                </span>
                <span className="bg-green-600/50 px-3 py-1 rounded-full flex items-center gap-1">
                  <Video size={16} className="text-green-400" />
                  {course.videos?.length || 0} Lessons
                </span>
                {course.price > 0 && (
                  <span className="bg-purple-600/50 px-3 py-1 rounded-full flex items-center gap-1">
                    ₹{course.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="mt-4 flex gap-3">
                {isLoggedIn && !isInstructor && (
                  <>
                    {isEnrolled ? (
                      <button
                        onClick={handleEnrolledClick}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg text-white font-medium transition duration-300 transform hover:scale-105"
                        aria-label="View enrolled course"
                      >
                        Enrolled
                      </button>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium transition duration-300 transform hover:scale-105 enroll-pulse"
                        aria-label="Enroll in course"
                      >
                        Enroll Now
                      </button>
                    )}
                  </>
                )}
                {!isLoggedIn && (
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-lg text-white font-medium transition duration-300 transform hover:scale-105"
                    aria-label="Log in to enroll"
                  >
                    Log in to Enroll
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* What You'll Learn */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-gray-700/50">
                <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
                <ul className="list-disc pl-5 text-gray-300 space-y-2">
                  {course.description
                    ?.split('.')
                    .filter((item) => item.trim())
                    .map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle size={20} className="text-indigo-400 mt-1" />
                        {item.trim()}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Course Content */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-gray-700/50">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Course Content</h2>
                  <button
                    onClick={toggleVideoList}
                    className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                    aria-expanded={isVideoListOpen}
                    aria-controls="video-list"
                  >
                    {isVideoListOpen ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                <div id="video-list" className={`${isVideoListOpen ? 'block' : 'hidden'}`}>
                  {course.videos?.length > 0 ? (
                    course.videos.map((video, idx) => (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition duration-300"
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => video.hslReady && handleLeactureNavigation(courseId)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Play video: ${video.title}`}
                        >
                          <span className="text-gray-400 font-medium">{idx + 1}.</span>
                          <div>
                            <p className="font-medium text-gray-100">{video.title}</p>
                            <p className="text-sm text-gray-400">{video.description}</p>
                            <span className="text-sm text-gray-400">
                              {video.hslReady ? (
                                <span className="text-green-400 flex items-center gap-1">
                                  <CheckCircle size={16} />
                                  Ready to Watch
                                </span>
                              ) : (
                                'Processing...'
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-300">{formatDuration(video.duration)}</span>
                          {isInstructor && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditVideoModal(video)}
                                className="text-indigo-400 hover:text-indigo-300"
                                aria-label={`Edit video: ${video.title}`}
                              >
                                <Edit2 size={20} />
                              </button>
                              <button
                                onClick={() => handleVideoDelete(video.id)}
                                className="text-red-400 hover:text-red-300"
                                aria-label={`Delete video: ${video.title}`}
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No videos available yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-6 space-y-6">
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-gray-700/50">
                <h2 className="text-xl font-semibold mb-4">Course Details</h2>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-center gap-2">
                    <User size={20} className="text-indigo-400" />
                    Instructor: {course.teacherName || 'Unknown'}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={20} className="text-indigo-400" />
                    Created: {formatDate(course.createdAt)}
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-indigo-400" />
                    Enrollment: {isLoggedIn ? (isEnrolled ? 'Enrolled' : 'Not Enrolled') : 'Login Required'}
                  </p>
                </div>
              </div>

              {isInstructor && (
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-gray-700/50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Teacher Tools</h2>
                    <button
                      onClick={toggleTeacherTools}
                      className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                      aria-expanded={isTeacherToolsOpen}
                      aria-controls="teacher-tools"
                    >
                      {isTeacherToolsOpen ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                  <div id="teacher-tools" className={`${isTeacherToolsOpen ? 'block' : 'hidden'}`}>
                    <UploadVideo courseId={courseId} onUploadSuccess={handleUploadSuccess} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video Modal */}
          {selectedVideo && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="video-modal-title"
              ref={videoModalRef}
            >
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 w-full max-w-3xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 id="video-modal-title" className="text-xl font-semibold">{selectedVideo.title}</h3>
                  <button
                    onClick={closeVideoModal}
                    className="text-gray-300 hover:text-gray-100 transition duration-300"
                    aria-label="Close video modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {selectedVideo.hlsUrl || selectedVideo.videoUrl ? (
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={selectedVideo.hlsUrl || selectedVideo.videoUrl}
                    poster={course.thumbnailUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className="text-red-400 text-center">Video source unavailable.</p>
                )}
              </div>
            </div>
          )}

          {/* Edit Video Modal */}
          {editingVideo && isInstructor && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-video-modal-title"
              ref={editModalRef}
            >
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 id="edit-video-modal-title" className="text-xl font-semibold">Edit Video</h3>
                  <button
                    onClick={() => {
                      setEditingVideo(null);
                      setEditErrors({});
                    }}
                    className="text-gray-300 hover:text-gray-100 transition duration-300"
                    aria-label="Close edit video modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVideoEdit(editingVideo.id);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="edit-video-title" className="flex items-center text-sm font-medium text-gray-300 mb-1">
                      Title <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="edit-video-title"
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ${editErrors.title ? 'border-red-400' : ''}`}
                      value={editingVideo.title || ''}
                      onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                      aria-required="true"
                      aria-describedby={editErrors.title ? 'edit-title-error' : undefined}
                      placeholder="Video Title"
                    />
                    {editErrors.title && (
                      <p id="edit-title-error" className="text-red-400 text-sm mt-1">{editErrors.title}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-video-description" className="flex items-center text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      id="edit-video-description"
                      className="w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 resize-none"
                      value={editingVideo.description || ''}
                      onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                      rows={3}
                      placeholder="Video description..."
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-video-file" className="flex items-center text-sm font-medium text-gray-300 mb-1">
                      Upload New Video (Optional)
                    </label>
                    <input
                      id="edit-video-file"
                      type="file"
                      accept="video/*"
                      className="w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 cursor-pointer"
                      onChange={(e) => setEditingVideo({ ...editingVideo, newVideoFile: e.target.files[0] })}
                    />
                  </div>
                  {editErrors.general && (
                    <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm" role="alert">
                      {editErrors.general}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoadingEdit}
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${isLoadingEdit ? 'opacity-75 cursor-not-allowed' : ''}`}
                    aria-label={isLoadingEdit ? 'Saving video changes...' : 'Save video changes'}
                  >
                    {isLoadingEdit && (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    )}
                    <span>{isLoadingEdit ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseDetail;