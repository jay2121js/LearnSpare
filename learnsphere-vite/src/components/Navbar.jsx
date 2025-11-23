import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, Bell, Home, BookOpen, PlayCircle, LogOut, LogIn, UserPlus, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Logo from './Logo';
import Sidebar from './Sidebar';
import NotificationDropdown from '../Services/NotificationDropdown';

const Navbar = ({ isLoggedIn = false, user = null, onLogout = () => {}, onSearch = () => {}, isMini, setIsMini, isOpen, setIsOpen, showSearch }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [isMobile, setIsMobile] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
        setIsSearchFocused(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && isMobile && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile, setIsOpen]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigate(`/CoursePage?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsSearchFocused(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  const menuItems = useMemo(() => [
    {
      title: 'Main',
      items: isLoggedIn
        ? [
            { label: 'Home', path: '/', icon: <Home className="w-5 h-5" />, isActive: location.pathname === '/' },
            { label: 'Courses', path: '/CoursePage', icon: <BookOpen className="w-5 h-5" />, isActive: location.pathname === '/courses' },
            { label: 'My Learning', path: '/my-learning', icon: <PlayCircle className="w-5 h-5" />, isActive: location.pathname === '/my-learning' },
            { label: 'Logout', path: '#', onClick: onLogout, icon: <LogOut className="w-5 h-5" />, isActive: false },
          ]
        : [
            { label: 'Home', path: '/', icon: <Home className="w-5 h-5" />, isActive: location.pathname === '/' },
            { label: 'Courses', path: '/CoursePage', icon: <BookOpen className="w-5 h-5" />, isActive: location.pathname === '/courses' },
            { label: 'Login', path: '/login', icon: <LogIn className="w-5 h-5" />, isActive: location.pathname === '/login' },
            { label: 'Sign Up', path: '/signup', icon: <UserPlus className="w-5 h-5" />, isActive: location.pathname === '/signup' },
          ],
    },
  ], [isLoggedIn, onLogout, location.pathname]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="h-16 bg-gray-800 shadow-md sticky top-0 z-50"
    >
      <div className="w-full">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo & Menu Toggle */}
          <div className="flex items-center gap-3 pl-4">
            <button
              onClick={() => {
                if (isMobile) setIsOpen(!isOpen);
                else setIsMini(!isMini);
              }}
              className="text-gray-300 hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded p-1"
              aria-label={isMobile ? (isOpen ? 'Close sidebar' : 'Open sidebar') : (isMini ? 'Expand sidebar' : 'Collapse sidebar')}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo className="w-24 h-auto" />
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            {showSearch && (
              <div className="relative w-full flex" ref={searchRef}>
                <div className="flex w-full rounded-full overflow-hidden border border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-teal-500 transition">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                    className="flex-1 px-4 py-2 bg-transparent text-gray-100 focus:outline-none"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 bg-gray-700 hover:bg-gray-600 border-l border-gray-600 text-gray-300 transition"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                {isSearchFocused && searchQuery && (
                  <div className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-600 shadow-lg rounded-b-lg p-2 z-50">
                    <p className="text-gray-300">Suggestions for "{searchQuery}" (implement with API)</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-3 pr-4">
            {/* Mobile Search */}
            <div className="md:hidden">
              {showSearch && (
                isSearchOpen ? (
                  <div
                    ref={searchRef}
                    className="absolute top-16 left-0 right-0 bg-gray-800 p-4 shadow-md z-50"
                  >
                    <div className="relative flex rounded-full overflow-hidden border border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-teal-500 transition">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                        className="flex-1 px-4 py-2 bg-transparent text-gray-100 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleSearch}
                        className="px-4 bg-gray-700 hover:bg-gray-600 border-l border-gray-600 text-gray-300 transition"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="text-gray-300 hover:text-teal-400 focus:ring-2 focus:ring-teal-500 rounded p-1"
                  >
                    <Search className="w-6 h-6" />
                  </button>
                )
              )}
            </div>

            {/* Notifications */}
            {isLoggedIn && <NotificationDropdown />}

            {/* Profile / Auth */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="rounded p-1"
                  aria-label="User menu"
                  aria-expanded={isProfileOpen}
                >
                  {avatar && avatar !== '' ? (
                    <img
                      src={avatar}
                      alt={user?.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-gray-600 hover:ring-2 focus:ring-2 ring-teal-500 transition"
                      onError={() => setAvatar(null)}
                    />
                  ) : (
                    <FaUser
                      className="w-8 h-8 text-gray-300 border border-gray-600 rounded-full p-1.5 hover:ring-2 focus:ring-2 ring-teal-500 transition"
                    />
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 border border-gray-700 shadow-xl rounded-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-gray-300 font-medium">{user?.name || 'Anonymous'}</p>
                    </div>
                    <ul className="py-1" role="menu">
                      <li>
                        <a
                          href="/profile"
                          role="menuitem"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                        >
                          Profile
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={onLogout}
                          role="menuitem"
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <a href="/login" className="flex items-center gap-1 px-3 py-1.5 text-gray-300 hover:text-teal-400 bg-gray-700 rounded-full text-sm">
                  <LogIn className="w-5 h-5" />
                  <span className="hidden sm:inline">Login</span>
                </a>
                <a href="/signup" className="flex items-center gap-1 px-3 py-1.5 text-white bg-teal-600 hover:bg-teal-700 rounded-full text-sm">
                  <UserPlus className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign Up</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Backdrop */}
        {isOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <div ref={sidebarRef}>
          <Sidebar isOpen={isOpen} menuItems={menuItems} onItemClick={() => setIsOpen(false)} isMini={isMini} />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;