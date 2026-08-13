import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage('');
  setError('');
  setResetUrl('');

  try {
    const { data } = await api.post('/auth/forgot-password', { email });

    if (data.resetUrl) {
      setResetUrl(data.resetUrl);
    } else {
      setMessage(data.message || 'Email sent successfully. Check your inbox.');
    }
  } catch (err) {
  console.error('Forgot Password Error:', err);
  console.error('Response:', err.response?.data);
  console.error('Status:', err.response?.status);

  setError(
    err.response?.data?.message ||
    err.message ||
    'An error occurred. Please try again.'
  );

  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {message && (
          <div className="mb-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg text-sm border border-green-200 dark:border-green-800 whitespace-pre-wrap max-w-full overflow-hidden break-words">
            {message}
          </div>
        )}

        {resetUrl && (
          <div className="mb-6 text-center animate-fade-in">
            <a href={resetUrl} className="inline-block w-full text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 font-bold py-3 px-6 rounded-lg shadow-sm transition hover:bg-blue-100 hover:border-blue-300">
              🔗 Click Here to Reset Password
            </a>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 px-4 text-center disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium transition-colors">
            &larr; Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
