// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { HeroProvider } from './components/HeroContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css'; // Ensure Tailwind CSS is applied
import Loading from './components/Loading'; // Import the Loading component

// Lazy-loaded pages
const HomePage = lazy(() => import('./Pages/HomePage'));
const Login = lazy(() => import('./Pages/Login'));
const Signup = lazy(() => import('./Pages/Signup'));
const MyLearning = lazy(() => import('./components/MyLearning'));
const ProfilePage = lazy(() => import('./Pages/ProfilePage'));
const CourseDetailPage = lazy(() => import('./Pages/CourseDetail'));
const CoursesPage = lazy(() => import('./Pages/CoursesPage'));
const AboutUsPage = lazy(() => import('./Pages/AboutUs'));
const VideoStreamingPage = lazy(() => import('./Pages/VideoStreaming'));
const SettingsPage = lazy(() => import('./Pages/SettingsPage'));

const App = () => {
  return (
    <AuthProvider>
      <HeroProvider>
        <ErrorBoundary>
          {/* Suspense handles fallback while lazy chunks load */}
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/CoursePage" element={<Layout><CoursesPage /></Layout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/my-learning" element={<Layout><MyLearning /></Layout>} />
              <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
              <Route path="/courses/:courseId" element={<Layout><CourseDetailPage /></Layout>} />
              <Route path="/about" element={<Layout><AboutUsPage /></Layout>} />
              <Route path="/stream/:courseId" element={<Layout><VideoStreamingPage /></Layout>} />
              <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </HeroProvider>
    </AuthProvider>
  );
};

export default App;
