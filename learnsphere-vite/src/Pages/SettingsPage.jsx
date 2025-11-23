import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import courseService from '../Services/courseService';

const SettingsPage = () => {
   const [profileForm, setProfileForm] = useState({
    username: '',
    name: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
  });
  const [profileStatus, setProfileStatus] = useState(null);
  const [accountForm, setAccountForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [accountStatus, setAccountStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);


  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true); // Set loading to true
      try {
        const data = await courseService.getProfileData();
        setProfileForm({
          username: data.username || '',
          name: data.name || '',
          gender: data.gender || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } catch (error) {
        setProfileStatus({ type: 'error', message: 'Failed to load profile data. Please try again.' });
      } finally {
        setIsLoading(false); // Set loading to false
      }
    };

    fetchProfileData();
  }, []);

  // Handle Profile form input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Account form input changes
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validate Profile form
  const validateProfileForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profileForm.username.trim()) {
      return { valid: false, message: 'Username is required' };
    }
    if (!profileForm.name.trim()) {
      return { valid: false, message: 'Name is required' };
    }
    if (!profileForm.email || !emailRegex.test(profileForm.email)) {
      return { valid: false, message: 'Valid email is required' };
    }
    if (profileForm.phone && !/^\d{10}$/.test(profileForm.phone)) {
      return { valid: false, message: 'Phone must be a 10-digit number' };
    }
    return { valid: true };
  };

  // Handle Profile form submission
const handleProfileSubmit = async (e) => {
  e.preventDefault();
  setProfileStatus(null);
  setIsSavingProfile(true); // Start loading

  const validation = validateProfileForm();
  if (!validation.valid) {
    setProfileStatus({ type: 'error', message: validation.message });
    setIsSavingProfile(false); // Stop loading
    return;
  }

  try {
    const payload = new FormData();
    payload.append('username', profileForm.username);
    payload.append('fullName', profileForm.name);
    payload.append('gender', profileForm.gender);
    payload.append('phone', profileForm.phone);
    payload.append('address', profileForm.address);
    payload.append('email', profileForm.email);

    await courseService.updateProfile(payload);
    setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
  } catch (error) {
    setProfileStatus({ type: 'error', message: error.message || 'An error occurred' });
  } finally {
    setIsSavingProfile(false); // Stop loading
  }
};


  // Handle Account form submission
  const handleAccountSubmit = async (e) => {
  e.preventDefault();
  if (accountForm.password !== accountForm.confirmPassword) {
    setAccountStatus({ type: 'error', message: 'Passwords do not match' });
    return;
  }

  setIsSavingAccount(true); // Start loading
  setAccountStatus(null);

  try {
    const payload = new FormData();
    payload.append('password', accountForm.confirmPassword);
    await courseService.updatePassword(payload);
    setAccountStatus({ type: 'success', message: 'Account updated successfully!' });
  } catch (error) {
    setAccountStatus({ type: 'error', message: error.message || 'An error occurred' });
  } finally {
    setIsSavingAccount(false); // Stop loading
  }
};


  return (
    <div className="min-h-screen bg-gray-800 text-gray-100 font-sans">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       
        <AnimatePresence>
          
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64 "
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 bg-gray-900/50 p-5 rounded-2xl"
            >
               <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-4xl font-bold text-white mb-10 text-center"
              >
                Settings
              </motion.h1>
              
              {/* Profile Section */}
              <section className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
                
                <h2 className="text-xl font-semibold text-teal-400 mb-6 border-b border-gray-600 pb-3">
                  Profile Settings
                </h2>
                <form onSubmit={handleProfileSubmit} className="grid gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={profileForm.username}
                      onChange={handleProfileChange}
                      className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition duration-300 ease-in-out"
                      placeholder="Your username"
                      aria-describedby="username-help"
                    />
                    <p id="username-help" className="mt-1 text-xs text-gray-400">
                      Your unique username for the platform.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition duration-300 ease-in-out"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-200">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={profileForm.gender}
                      onChange={handleProfileChange}
                      className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition duration-300 ease-in-out"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition duration-300 ease-in-out"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-200">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition duration-300 ease-in-out"
                      placeholder="10-digit phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-200">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                      className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition duration-300 ease-in-out"
                      rows="4"
                      placeholder="Your address"
                    />
                  </div>
                  {profileStatus && (
                    <p
                      className={`mt-4 text-sm ${
                        profileStatus.type === 'success' ? 'text-teal-400' : 'text-red-400'
                      }`}
                    >
                      {profileStatus.message}
                    </p>
                  )}
                 <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSavingProfile}
                    className={`mt-6 w-full px-6 py-3 font-semibold rounded-md transition duration-300 ease-in-out ${
                      isSavingProfile ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
                    }`}
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Profile'}
                  </motion.button>

                </form>
              </section>

              {/* Account Section */}
              <section className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-teal-400 mb-6 border-b border-gray-600 pb-3">
                  Account Settings
                </h2>
                <form onSubmit={handleAccountSubmit} className="grid gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={accountForm.password}
                      onChange={handleAccountChange}
                      className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition duration-300 ease-in-out"
                      placeholder="New password"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={accountForm.confirmPassword}
                      onChange={handleAccountChange}
                      className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition duration-300 ease-in-out"
                      placeholder="Confirm new password"
                    />
                  </div>
                  {accountStatus && (
                    <p
                      className={`mt-4 text-sm ${
                        accountStatus.type === 'success' ? 'text-teal-400' : 'text-red-400'
                      }`}
                    >
                      {accountStatus.message}
                    </p>
                  )}
                 <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSavingAccount}
                  className={`mt-6 w-full px-6 py-3 font-semibold rounded-md transition duration-300 ease-in-out ${
                    isSavingAccount ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
                  }`}
                >
                  {isSavingAccount ? 'Saving...' : 'Save Account'}
                </motion.button>

                </form>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SettingsPage;