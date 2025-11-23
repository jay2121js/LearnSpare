import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Import AuthProvider hook
import { getCookie } from './cookieService'; // Import cookie service

const UserDetails = () => {
  const { user: authUser } = useAuth(); // Get user from AuthProvider
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prioritize AuthProvider user data if available
    if (authUser) {
      setUserData({
        name: authUser.name || 'Unknown',
        email: authUser.email || 'No email provided',
        role: authUser.role || 'User',
      });
      return;
    }

    // Fallback to reading user cookie
    try {
      const userCookie = getCookie('user');
      if (userCookie) {
        const decodedJson = decodeURIComponent(userCookie);
        const parsedData = JSON.parse(decodedJson);
        setUserData({
          name: parsedData.name || 'Unknown',
          email: parsedData.email || 'No email provided',
          role: parsedData.role || 'User',
        });
      } else {
        setError('No user data found. Please log in.');
      }
    } catch (err) {
      console.error('Failed to parse user cookie:', err);
      setError('Unable to load user details. Please try again.');
    }
  }, [authUser]);

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 rounded-lg shadow-md">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-gray-50 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Profile</h2>
      <div className="space-y-3">
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Name:</span>
          <span className="text-gray-900 dark:text-white">{userData.name}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Email:</span>
          <span className="text-gray-900 dark:text-white">{userData.email}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Role:</span>
          <span className="text-gray-900 dark:text-white capitalize">{userData.role}</span>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;