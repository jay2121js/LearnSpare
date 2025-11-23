import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../Services/courseService'; // Adjust path as needed
import { useAuth } from '../components/AuthContext';
import { Clock, Video, User, CheckCircle, Edit2, Trash2 } from 'lucide-react';

const UploadVideo = ({ courseId, onUploadSuccess }) => {
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

    try {
      const response = await courseService.uploadVideo(courseId, formData);
      setMessage(response);
      setTitle('');
      setDescription('');
      setVideo(null);
      document.getElementById(`video-input-${courseId}`).value = '';
      onUploadSuccess();
    } catch (error) {
      setMessage(error.message);
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
            className={`w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 cursor-pointer ${errors.video ? 'border-red-400' : ''}`}
            onChange={(e) => setVideo(e.target.files[0])}
            aria-required="true"
            aria-describedby={errors.video ? `video-error-${courseId}` : undefined}
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
  const [error, setError] = useState('');
  const [isVideoListOpen, setIsVideoListOpen] = useState(true);
  const [isTeacherToolsOpen, setIsTeacherToolsOpen] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Format seconds to "Xm Ys"
  const formatDuration = (seconds) => {
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

  // Load course and check ownership
  useEffect(() => {
    const loadCourseAndOwnership = async () => {
      setLoading(true);
      try {
        const data = await courseService.getCourse(courseId);
        setCourse(data);

        if (isLoggedIn && userEmail) {
          console.log('Attempting to check course ownership:', { courseId, email: userEmail });
          const isOwner = await courseService.checkCourseOwnership(courseId, userEmail);
          setIsInstructor(isOwner);
        } else {
          console.log('Cannot check ownership: isLoggedIn or userEmail missing', {
            isLoggedIn,
            userEmail,
          });
          setIsInstructor(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadCourseAndOwnership();
    }
  }, [courseId, isLoggedIn, userEmail, authLoading]);

  // Handle enroll
  const handleEnroll = async () => {
    try {
      await courseService.enrollCourse(courseId);
      window.location.reload(); // Refresh to update enrollment status
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle video edit
  const handleVideoEdit = async (video) => {
    try {
      await courseService.updateVideo(video.id, {
        title: video.title,
        description: video.description,
      });
      setCourse({
        ...course,
        videos: course.videos.map((v) => (v.id === video.id ? { ...v, title: video.title, description: video.description } : v)),
      });
      setEditingVideo(null);
    } catch (err) {
      setError(err.message);
      console.error('Video edit error:', err);
    }
  };

  // Handle video delete
  const handleVideoDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await courseService.deleteVideo(videoId);
      setCourse({ ...course, videos: course.videos.filter((v) => v.id !== videoId) });
    } catch (err) {
      setError(err.message);
      console.error('Video delete error:', err);
    }
  };

  // Handle video upload success
  const handleUploadSuccess = async () => {
    try {
      const courseData = await courseService.getCourse(courseId);
      setCourse(courseData);
    } catch (err) {
      setError(err.message);
      console.error('Upload success refresh error:', err);
    }
  };

  const toggleVideoList = () => setIsVideoListOpen(!isVideoListOpen);
  const toggleTeacherTools = () => setIsTeacherToolsOpen(!isTeacherToolsOpen);
  const openVideoModal = (video) => setSelectedVideo(video);
  const closeVideoModal = () => setSelectedVideo(null);
  const openEditVideoModal = (video) => setEditingVideo({ ...video });

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
            onClick={() => window.location.reload()}
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
                <button
                  onClick={() => navigate(`/instructor/course/edit/${courseId}`)}
                  className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                  aria-label="Edit course details"
                >
                  <Edit2 size={24} />
                </button>
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
                <button
                  onClick={handleEnroll}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium transition duration-300 transform hover:scale-105"
                  aria-label="Enroll in course"
                >
                  Enroll Now
                </button>
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
                  .split('.')
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
                        onClick={() => video.hslReady && openVideoModal(video)}
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
                        <span className="text-sm text-gray-300">{formatDuration(video.duration || 0)}</span>
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
                  Instructor: {course.instructor?.name || 'Unknown'}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={20} className="text-indigo-400" />
                  Created: {formatDate(course.createdAt)}
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
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 w-full max-w-3xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
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
              <video
                controls
                className="w-full rounded-lg"
                src={selectedVideo.hlsUrl || selectedVideo.videoUrl}
                poster={course.thumbnailUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        {/* Edit Video Modal */}
        {editingVideo && isInstructor && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Edit Video</h3>
                <button
                  onClick={() => setEditingVideo(null)}
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
                  handleVideoEdit(editingVideo);
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
                    className="w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    aria-required="true"
                    placeholder="Video Title"
                  />
                </div>
                <div>
                  <label htmlFor="edit-video-description" className="flex items-center text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="edit-video-description"
                    className="w-full px-3 py-2 border rounded-lg text-gray-100 bg-gray-700/50 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 resize-none"
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                    rows={3}
                    placeholder="Video description..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 transform hover:scale-105"
                  aria-label="Save video changes"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;