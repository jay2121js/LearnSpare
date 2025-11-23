import React, { useState, useEffect } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import Header from '../components/ProfilePage/Header';
import { useAuth } from '../components/AuthContext';
import courseService from '../Services/courseService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 text-center">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState({
    username: 'Guest',
    name: 'Guest',
    gender: 'Not specified',
    email: 'No email provided',
    phone: 'Not specified',
    address: 'Not specified',
    avatar: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFilter] = useState('none');
  const [showShareModal, setShowShareModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);


  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const profileData = await courseService.getProfileData();
        console.log('Profile Data:', JSON.stringify(profileData, null, 2));
        if (isMounted) {
          setUser({
            username: profileData.username || authUser?.username || 'Guest',
            name: profileData.name || authUser?.name || 'Guest',
            gender: profileData.gender || authUser?.gender || 'Not specified',
            email: profileData.email || authUser?.email || 'No email provided',
            phone: profileData.phone || authUser?.phone || 'Not specified',
            address: profileData.address || authUser?.address || 'Not specified',
            avatar: profileData.avatar || authUser?.avatar || null,
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        if (isMounted) {
          toast.error('Failed to load profile data.');
          if (authUser) {
            setUser({
              username: authUser.username || 'Guest',
              name: authUser.name || 'Guest',
              gender: authUser.gender || 'Not specified',
              email: authUser.email || 'No email provided',
              phone: authUser.phone || 'Not specified',
              address: authUser.address || 'Not specified',
              avatar: authUser.avatar || null,
            });
          }
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const particlesOptions = {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 1000 } },
      color: { value: ['#4f46e5', '#10b981', '#ec4899'] },
      opacity: { value: 0.7, random: true },
      size: { value: 4, random: true },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: true,
        attract: { enable: true, rotateX: 800, rotateY: 1600 },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'bubble' },
        onClick: { enable: true, mode: 'push' },
      },
      modes: {
        bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8 },
        push: { quantity: 4 },
      },
    },
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return (
      <>
        {greeting}, <span className="text-teal-300 font-bold">{user.name.toUpperCase()}</span>!
      </>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', user.username);
      formData.append('fullName', user.name);
      formData.append('gender', user.gender || '');
      formData.append('email', user.email);
      formData.append('phone', user.phone || '');
      formData.append('address', user.address || '');
      await courseService.updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save user data:', err);
      toast.error('Failed to update profile.');
    }finally{
          setSaveLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-800 relative text-white font-poppins overflow-hidden">
        <Particles
          id="profileParticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 z-0 opacity-30"
        />
        <Header
          user={user}
          defaultAvatar={defaultAvatar}
          avatarFilter={avatarFilter}
          setShowShareModal={setShowShareModal}
          getWelcomeMessage={getWelcomeMessage}
        />
      
        <div className="relative z-10 max-w-4xl mx-auto mt-12 px-6">
          <div className="bg-gray-900/50 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.02]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Profile Details</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <p className="font-medium text-gray-200">Username</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleInputChange}
                    className="mt-2 w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="mt-2">{user.username}</p>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-200">Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="mt-2 w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="mt-2">{user.name}</p>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-200">Gender</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="gender"
                    value={user.gender || ''}
                    onChange={handleInputChange}
                    className="mt-2 w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="mt-2">{user.gender || 'Not specified'}</p>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-200">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="mt-2 w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="mt-2">{user.email}</p>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-200">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={user.phone || ''}
                    onChange={handleInputChange}
                    className="mt-2 w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="mt-2">{user.phone || 'Not specified'}</p>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-200">Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={user.address || ''}
                    onChange={handleInputChange}
                    className="mt-2 w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="mt-2">{user.address || 'Not specified'}</p>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="mt-6 flex justify-end">
               <button
              onClick={handleSave}
              disabled={saveLoading}
              className={`px-6 py-2 rounded-lg transition-colors ${
                saveLoading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
              } text-white`}
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProfilePage;