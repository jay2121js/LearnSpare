import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Cookies from 'js-cookie';

function Signup() {
  const { login, fetchSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    role: 'STUDENT',
  });
  const hasFetched = useRef(false); // Prevents multiple OAuth fetch requests

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;;
  const base = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const redirectUri = base + "/signup"
  const backendUri = import.meta.env.VITE_BACKEND_URI;

  const role = sessionStorage.getItem('oauth_role');

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !hasFetched.current) {
      hasFetched.current = true; // Block duplicate requests
      setLoading(true);
      setError('');

      fetch(`${backendUri}/auth/google/signup/callback?code=${code}&role=${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((data) => {
              throw new Error(data.error || `HTTP ${res.status}: Failed to authenticate with Google`);
            });
          }
          return res.json();
        })
        .then(async (data) => {
          const userData = { name: data.username, email: data.email, avatar: data.avatar ?? '' };
          const loginSuccess = await login(userData);
          if (loginSuccess) {
            const session = await fetchSession();
            if (session) {
              sessionStorage.removeItem('oauth_role');
              navigate('/', { replace: true });
            } else {
              setError('Session confirmation failed. Please try logging in again.');
            }
          } else {
            setError('Login failed. Please try again.');
          }
        })
        .catch((err) => {
          console.error('OAuth failed:', err);
          if (err.message.includes('Account already exists')) {
            setError('This Google account is already registered. Please log in instead.');
          } else {
            setError(err.message || 'Google authentication failed.');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [navigate, login, fetchSession, role]);

  // Update form data on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  // Handle manual form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic form validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits.');
      setLoading(false);
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      setError('Please enter a valid email address (e.g., user@example.com).');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUri}/Public/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const userData = { name: data.username, email: formData.email, avatar: data.avatar ?? '' };
        Cookies.set('user', JSON.stringify(userData), {
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          path: '/',
        });
        const loginSuccess = await login(userData);
        if (loginSuccess) {
          const session = await fetchSession();
          if (session) {
            navigate('/', { replace: true });
          } else {
            setError('Session confirmation failed. Please try logging in again.');
          }
        } else {
          setError('Failed to establish session. Please try again.');
        }
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to sign up. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to connect to the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Google OAuth signup
  const handleGoogleSignup = (role_value) => {
    sessionStorage.setItem('oauth_role', role_value);
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
    window.location.href = googleLoginUrl;
  };

  return (
    <div className="min-h-screen p-10 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Create Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSignupSubmit} className="space-y-4">
          {[
            { label: 'Username', name: 'username', type: 'text', required: true, placeholder: 'Enter username' },
            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name' },
            { label: 'Email', name: 'email', type: 'email', required: true, placeholder: 'you@example.com' },
            { label: 'Phone', name: 'phone', type: 'text', placeholder: '1234567890' },
            { label: 'Address', name: 'address', type: 'text', placeholder: 'Your address' },
            { label: 'Password', name: 'password', type: 'password', required: true, placeholder: 'Create password' },
          ].map(({ label, name, type, required, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                required={required}
                value={formData[name]}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition"
                disabled={loading}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition"
              disabled={loading}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a:</label>
            <div className="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
              {['STUDENT', 'TEACHER'].map((roleOption) => (
                <label key={roleOption} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value={roleOption}
                    checked={formData.role === roleOption}
                    onChange={handleInputChange}
                    className="text-purple-600 w-4 h-4"
                    disabled={loading}
                  />
                  {roleOption === 'STUDENT' ? 'Student' : 'Teacher'}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white dark:text-gray-100 font-medium py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>

        <div className="my-4 text-center text-gray-400 text-sm">or</div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleGoogleSignup('STUDENT')}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Sign up with Google as Student
          </button>
          <button
            onClick={() => handleGoogleSignup('TEACHER')}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Sign up with Google as Teacher
          </button>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
