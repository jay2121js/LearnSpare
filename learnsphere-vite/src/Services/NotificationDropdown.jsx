import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
className="text-gray-300 hover:text-white transition rounded-full p-2 border border-transparent hover:border-teal-500 hover:bg-gray-600/50"
  onClick={() => setIsOpen(!isOpen)}
>
  <Bell size={22} />
</button>


      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 h-80 bg-gray-800 text-white rounded-lg shadow-lg z-50 border border-gray-700 flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-700 text-base font-semibold">
            Notifications
          </div>

          {/* Body (Center Content) */}
          <div className="flex-grow flex items-center justify-center">
            <div className="text-sm text-gray-400 text-center">
              No notifications
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
