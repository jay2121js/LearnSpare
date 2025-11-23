import React, { useMemo } from 'react';
import { UserCheck, Infinity, Award, Clock, Smartphone } from 'lucide-react';

// Static feature data
const features = [
  {
    id: '1',
    title: 'Expert Instructors',
    description: 'Learn from industry leaders with years of experience.',
    icon: UserCheck,
  },
  {
    id: '2',
    title: 'Lifetime Access',
    description: 'Access your courses anytime, forever.',
    icon: Infinity,
  },
  {
    id: '3',
    title: 'Certification',
    description: 'Earn recognized certificates upon completion.',
    icon: Award,
  },
  {
    id: '4',
    title: 'Learn at Your Pace',
    description: 'Study on your schedule, at your speed.',
    icon: Clock,
  },
  {
    id: '5',
    title: 'Mobile Friendly',
    description: 'Access courses on any device, anywhere.',
    icon: Smartphone,
  },
];

const PlatformFeatures = () => {
  // Memoize features to prevent recalculations
  const memoizedFeatures = useMemo(() => features, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeSlide {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .fade-slide {
            animation: fadeSlide 0.5s ease-out forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            .fade-slide {
              animation: none;
            }
          }
        `}
      </style>
      <section className="bg-gray-800 text-white py-12" role="region" aria-labelledby="platform-features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="platform-features-heading" className="text-4xl font-extrabold text-white mb-8 text-center">
            Why Learn With Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {memoizedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="group bg-gray-900/80 rounded-xl shadow-md p-6 text-center transition duration-300 ease-out hover:scale-102 hover:shadow-lg fade-slide"
                  style={{ animationDelay: `${index * 100}ms` }}
                  role="article"
                  aria-label={`Feature: ${feature.title}`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-4 text-teal-400 group-hover:text-teal-300 transition-colors" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default PlatformFeatures;