import React from 'react';
import { BookOpen, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutUsPage() {
  const navigate = useNavigate();

  const teamMembers = [
    { name: 'Jane Doe', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { name: 'John Smith', role: 'Lead Instructor', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { name: 'Emily Chen', role: 'Curriculum Director', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
  ];

  const testimonials = [
    {
      quote: 'Smart Learn transformed my career with practical, hands-on courses that were easy to follow.',
      author: 'Alex Johnson',
      role: 'Web Developer',
    },
    {
      quote: 'The supportive community and expert instructors made learning a joy. Highly recommend!',
      author: 'Sarah Lee',
      role: 'Data Scientist',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-indigo-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516321310762-479e93c1e3d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 mb-4 tracking-tight animate-fade-in">
            About Smart Learn
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
            Empowering learners worldwide with high-quality, accessible, and engaging education to unlock their full potential.
          </p>
          <button
            onClick={() => navigate('/CoursePage')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium text-base sm:text-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            aria-label="Explore our courses"
          >
            <BookOpen size={18} className="inline mr-2" /> Explore Courses
          </button>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gray-700 rounded-xl p-6 sm:p-8 border border-gray-600">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-6 text-center animate-fade-in">
            Our Purpose
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-600 animate-fade-in delay-100">
              <h3 className="text-xl font-semibold text-indigo-400 mb-3">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To revolutionize education by creating a global learning platform where anyone, anywhere, can acquire skills to thrive in the digital age.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-600 animate-fade-in delay-200">
              <h3 className="text-xl font-semibold text-indigo-400 mb-3">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To deliver curated, practical, and project-based learning experiences that drive real-world results and lifelong career success.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-600 animate-fade-in delay-300">
              <h3 className="text-xl font-semibold text-indigo-400 mb-3">What We Offer</h3>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Expert-led video courses</li>
                <li>Hands-on projects & interactive quizzes</li>
                <li>Real-time progress tracking</li>
                <li>Industry-recognized certifications</li>
                <li>Supportive global learning community</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-6 text-center animate-fade-in">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className={`bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-600 animate-fade-in delay-${(index + 1) * 100}`}
            >
              <img
                src={member.image}
                alt={`${member.name}, ${member.role}`}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-100 text-center">{member.name}</h3>
              <p className="text-gray-300 text-center">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-6 text-center animate-fade-in">
          What Our Learners Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-600 animate-fade-in delay-${(index + 1) * 100}`}
            >
              <div className="flex items-center mb-4">
                <Star size={20} className="text-yellow-400 mr-1" />
                <Star size={20} className="text-yellow-400 mr-1" />
                <Star size={20} className="text-yellow-400 mr-1" />
                <Star size={20} className="text-yellow-400 mr-1" />
                <Star size={20} className="text-yellow-400" />
              </div>
              <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
              <p className="text-gray-100 font-semibold">{testimonial.author}</p>
              <p className="text-gray-400 text-sm">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-xl p-6 sm:p-8 text-center border border-gray-600 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-4">Ready to Start Learning?</h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of learners and explore our diverse course catalog today.
          </p>
          <button
            onClick={() => navigate('/CoursePage')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium text-base sm:text-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            aria-label="Browse available courses"
          >
            Browse Courses
          </button>
        </div>
      </section>

    </div>
  );
}