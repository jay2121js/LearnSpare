// Layout.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useHero } from './HeroContext';
import Navbar from './Navbar';
import Footer from './Footer';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import CourseForm from './CourseForm';

const Layout = ({ children }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const { heroVisible } = useHero();
  const [isMini, setIsMini] = useState(false);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const [showCourseForm, setShowCourseForm] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={logout}
        onSearch={(query) => console.log(`Searching: ${query}`)}
        isMini={isMini}
        setIsMini={setIsMini}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        showSearch={!heroVisible}
      />

      <main
        className={clsx(
          'flex-1 w-full transition-all duration-200 ease-in-out',
          isOpen ? (isMini && window.innerWidth >= 768 ? 'md:pl-20' : 'pl-60') : 'pl-0'
        )}
      >
        {children}
      </main>

      {/* Floating Button */}
     {user?.role === 'TEACHER' && (
      <button
        className="fixed bottom-6 right-6 z-200 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition duration-300"
        onClick={() => setShowCourseForm(true)}
      >
        <Plus className="w-6 h-6" />
      </button>
    )}

      {/* Conditional Form */}
      {showCourseForm && <CourseForm onClose={() => setShowCourseForm(false)} />}

      <Footer />
    </div>
  );
};

export default Layout;
