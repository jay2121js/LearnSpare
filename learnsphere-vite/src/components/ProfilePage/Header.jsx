import React, { memo } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const Header = ({ user, defaultAvatar, avatarFilter, setShowShareModal, getWelcomeMessage }) => {
  const getInitials = (name) => {
    if (!name || name === 'Guest') return 'GU';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-gray-900/70  text-white pt-12 pb-20 rounded-2xl relative z-10 max-w-4xl mx-auto mt-12 px-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {user.name === 'Guest' ? (
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
            >
              {getWelcomeMessage()}
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 bg-white text-indigo-600 font-semibold px-6 py-2 rounded-full hover:bg-indigo-100 transition shadow-sm"
              onClick={() => (window.location.href = '/login')}
            >
              Log In
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-8">
            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="relative group avatar-container"
              >
                <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-full border-4 border-white shadow-md overflow-hidden ">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.name}'s avatar`}
                      className={`w-full h-full object-cover ${
                        avatarFilter === 'sepia'
                          ? 'filter-sepia'
                          : avatarFilter === 'grayscale'
                          ? 'filter-grayscale'
                          : ''
                      }`}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = defaultAvatar;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>
              </motion.div>
            </Tilt>

            <div className="text-center md:text-left flex-1">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
              >
                {getWelcomeMessage()}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-1.5 text-sm sm:text-base lg:text-lg text-white/80"
              >
                {user.bio || 'Add a bio to share your story!'}
              </motion.p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    avatar: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
  defaultAvatar: PropTypes.string.isRequired,
  avatarFilter: PropTypes.oneOf(['none', 'sepia', 'grayscale']).isRequired,
  setShowShareModal: PropTypes.func.isRequired,
  getWelcomeMessage: PropTypes.func.isRequired,
};

export default memo(Header);