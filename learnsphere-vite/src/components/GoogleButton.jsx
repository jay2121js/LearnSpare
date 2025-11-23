import React from 'react';
import { FcGoogle } from 'react-icons/fc';

function GoogleButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 
                 bg-white dark:bg-gray-800 
                 hover:bg-gray-100 dark:hover:bg-gray-700 
                 text-gray-800 dark:text-gray-100 
                 font-medium 
                 transition-all duration-200 shadow-sm"
    >
      <FcGoogle className="mr-2 text-xl" />
      <span>Continue with Google</span>
    </button>
  );
}

export default GoogleButton;
