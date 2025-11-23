function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 z-100" role="contentinfo">
        <div className="flex flex-col sm:flex-row justify-between items-center mx-auto w-[90%]">
          <p className="text-sm text-center sm:text-left">
            &copy; 2025 LearnSphere. All rights reserved.
          </p>
          <nav aria-label="Footer Navigation" className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-gray-300 hover:text-teal-400">About</a>
            <a href="#" className="text-gray-300 hover:text-teal-400">Contact</a>
            <a href="#" className="text-gray-300 hover:text-teal-400">Privacy Policy</a>
          </nav>
        </div>
        
    </footer>
  );
}

export default Footer;
