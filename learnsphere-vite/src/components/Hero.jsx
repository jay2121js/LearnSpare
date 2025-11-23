import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useHero } from './HeroContext.jsx';

function Hero() {
  const { setHeroVisible } = useHero();
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { margin: '-400px 0px -50% 0px' });

  useEffect(() => {
    setHeroVisible(isInView);
  }, [isInView, setHeroVisible]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      window.location.href = `/CoursePage?search=${encodeURIComponent(trimmedQuery)}`;
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.15 },
    },
  };

  const itemFade = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const categories = [
    { name: 'Web Development', link: '/CoursePage?category=Web%20Development' },
    { name: 'Data & AI', link: '/CoursePage?category=Data%20%26%20AI' },
    { name: 'Mobile Development', link: '/CoursePage?category=Mobile%20Development' },
    { name: 'Design', link: '/CoursePage?category=Design' },
    { name: 'Cloud & DevOps', link: '/CoursePage?category=Cloud%20%26%20DevOps' },
    { name: 'Programming', link: '/CoursePage?category=Programming' },
    { name: 'Cybersecurity', link: '/CoursePage?category=Cybersecurity' },
    { name: 'Marketing', link: '/CoursePage?category=Marketing' },
  ];

  return (
    <section
      ref={heroRef}
      className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100 min-h-fit flex items-center justify-center pt-30 pb-20 text-center shadow-md px-4 sm:px-6 lg:px-8"
      aria-label="Hero Section for E-Learning Platform"
      role="banner"
    >
      <div className="relative max-w-7xl mx-auto w-full">
        <motion.h2
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-center text-gray-100 leading-relaxed"
        >
          Learn Anything, Anytime,<br className="sm:hidden" />
          <span className="block text-indigo-400 text-2xl sm:text-3xl md:text-4xl font-bold">
            Master Everything That Matters.
          </span>
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Discover 1000+ expert-led courses tailored to your goals.
        </motion.p>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-10"
        >
          <a href="#courses" aria-label="Start learning now">
            <button className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 transition-all duration-300">
              Start Learning
            </button>
          </a>
          <a href="/CoursePage" aria-label="Browse course categories">
            <button className="bg-gray-700 text-gray-300 px-6 py-3 rounded-full font-semibold hover:bg-gray-600 transition-all duration-300">
              Browse Categories
            </button>
          </a>
        </motion.div>
        <motion.form
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.6 }}
          onSubmit={handleSearch}
          className="mt-6 max-w-md w-full mx-auto"
          role="search"
        >
          <div className="flex w-full rounded-full overflow-hidden border border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="flex-1 px-4 py-3 text-gray-100 bg-transparent outline-none placeholder-gray-500"
              aria-label="Search for courses"
              required
            />
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-3 bg-gray-700 hover:bg-gray-600 border-l border-gray-600 transition-all duration-300"
              aria-label="Submit course search"
            >
              <MagnifyingGlassIcon className="w-5 sm:w-6 h-5 sm:h-6 text-gray-300" aria-hidden="true" />
            </button>
          </div>
        </motion.form>
        <motion.div
          variants={fadeInUp}
          initial="initial"
 benim
          animate="animate"
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 inline-flex items-center gap-3 bg-gray-800 border border-gray-600 px-4 py-2 rounded-full text-sm sm:text-base text-gray-300"
        >
          <span>Join over 50,000+ learners worldwide</span>
          <span className="hidden sm:inline">|</span>
          <span>Rated 4.8/5</span>
        </motion.div>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mt-12 w-full"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-4">
            Explore Popular Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 max-w-xl mx-auto p-2">
            {categories.map((category) => (
              <motion.a
                key={category.name}
                variants={itemFade}
                href={category.link}
                className="bg-gray-800 border border-gray-600 text-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-700 hover:text-teal-400 transition-all duration-300"
                aria-label={`Explore ${category.name} courses`}
                title={`Explore ${category.name} courses`}
              >
                {category.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;