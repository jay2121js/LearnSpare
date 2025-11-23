import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URI;

const courseService = {
  getCourse: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Public/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${courseId}:`, error);
      throw new Error('Failed to load course data. Please try again.');
    }
  },

  checkCourseOwnership: async (courseId, email) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Public/AuthCourseInstructor?id=${courseId}&username=${encodeURIComponent(email)}`,
        { withCredentials: true }
      );
      console.log('AuthCourseInstructor response:', response.data);
      return response.data === true;
    } catch (error) {
      console.error(`Error checking ownership for course ${courseId}:`, error);
      return false;
    }
  },

  enrollCourse: async (courseId) => {
    try {
      await axios.post(`${API_BASE_URL}/Student/Enroll-In/${courseId}`, {}, { withCredentials: true });
      return true;
    } catch (error) {
      console.error(`Error enrolling in course ${courseId}:`, error);
      throw new Error('Failed to enroll. Please try again.');
    }
  },
updateVideo: async (videoId, formData) => {
  try {
    const updatedFormData = new FormData();
    updatedFormData.append('title', formData.get('title'));
    updatedFormData.append('description', formData.get('description') || '');

    const response = await axios.put(
      `${API_BASE_URL}/Instructor/UpdateVideoDetails/${videoId}`,
      updatedFormData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error updating video ${videoId}:`, error);
    throw new Error(error.response?.data || error.message || 'Update failed');
  }},
updateVideoFile: async (videoId, formData) => {
  try {
    // Use the input formData directly, as it already contains 'file'
    const response = await axios.put(
      `${API_BASE_URL}/Instructor/UpdateVideoFile/${videoId}`, // Adjust if endpoint changes
      formData,
      {
        withCredentials: true,
        // Content-Type is set automatically by axios for FormData
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error updating video file for videoId ${videoId}:`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
    throw new Error(
      error.response?.data?.message || `Failed to update video file: ${error.message}`
    );
  }
},

  getFilteredCourses: async ({ page = 0, size = 12, category, difficulty, search }) => {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);
    if (category) params.set('category', category);
    if (difficulty) params.set('difficulty', difficulty);
    if (search) params.set('search', search);

    const res = await fetch(`${API_BASE_URL}/Public/FilteredCourses?${params.toString()}`, {
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Failed to load courses: ${res.statusText}`);
    }
    return res.json();
  },

  deleteVideo: async (videoId) => {
    try {
      await axios.delete(`${API_BASE_URL}/Instructor/DeleteVideoFromCourses/${videoId}`, {
        withCredentials: true
      });
    } catch (error) {
      console.error(`Error deleting video ${videoId}:`, error);
      throw new Error('Failed to delete video. Please try again.');
    }
  },

  uploadVideo: async (courseId, formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Instructor/addVideo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading video for course ${courseId}:`, error);
      throw new Error('Failed to upload video. Please try again.');
    }
  },
 
  createCourse: async (courseData, thumbnail) => {
    try {
      const formData = new FormData();
      formData.append('courseName',courseData.name)
      formData.append('difficultyLevel',courseData.difficultyLevel)
      formData.append('price',courseData.price)
      formData.append('title',courseData.title)
      formData.append('file', thumbnail);
      const response = await axios.post(`${API_BASE_URL}/Instructor/New-Course`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      console.log('Create course response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error(
        error.response
          ? `Error ${error.response.status}: ${error.response.data || 'Request failed'}`
          : `Network Error: ${error.message}`
      );
    }
  },

  getAllCourses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Public/all/Course`, {
        withCredentials: true,
      });
      console.log('Get all courses response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw new Error('Failed to load courses. Please try again.');
    }
  },

  getEnrolledCourseIds: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Public/enrolled-ids`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error fetching enrolled course IDs:', error);
      return [];
    }
  },
    getOwnedCourseIds: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Public/owned-ids`, { withCredentials: true });
      return response.data;
      
    } catch (error) {
      console.error('Error fetching enrolled course IDs:', error);
      return [];
    }
  },


  getEnrolledCourses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Student/My-Courses`, { withCredentials: true });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching enrolled course IDs:', error);
      return [];
    }
  },

  isCourseEnrolled: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Public/is-enrolled/${courseId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error checking enrollment for course ${courseId}:`, error);
      return false;
    }
  },

  updateCourse: async (id, payload) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/Courses/updateCourse/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw new Error('Failed to update course. Please try again.');
    }
  },
updateCourseThumbnail: async (id, thumbnail) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/Courses/updateCourseThumbnail/${id}`, thumbnail, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw new Error('Failed to update course. Please try again.');
    }
  },
  deleteCourse: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/Courses/delete/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw new Error('Failed to delete course. Please try again.');
    }
  },

  

  updateProfile: async(payload)=>{
  try {
      const response = await axios.put(`${API_BASE_URL}/User/profileupdate`, payload,{
       headers: { 'Content-Type': 'multipart/form-data' },

        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to Update Profile Details. Please try again.');
    }
  },

  getProfileData: async(payload)=>{
  try {
      const response = await axios.get(`${API_BASE_URL}/User/userdata`,{
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to Load Profile. Please try again.');
    }
  },
   updatePassword: async(payload)=>{
  try {
      const response = await axios.put(`${API_BASE_URL}/User/password`, payload,{
       headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to Update Password. Please try again.');
    }
  },
  myOwnedCourses :async(payload)=>{
  try {
      const response = await axios.get(`${API_BASE_URL}/Instructor/My-Courses`,{
        withCredentials: true,
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw new Error('Failed to Update Password. Please try again.');
    }
  },
};

export default courseService;