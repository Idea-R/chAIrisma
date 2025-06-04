import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import GradientText from '../common/GradientText';
import { useAuthStore } from '../../store/authStore';

interface LoginFormProps {
  onToggleMode?: () => void;
  mode?: 'login' | 'signup';
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onToggleMode,
  mode = 'login'
}) => {
  const navigate = useNavigate();
  const { login, signup } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = mode === 'login'
        ? await login(username, password)
        : await signup(username, password);

      if (success) {
        navigate('/dashboard');
      } else {
        setError(mode === 'login' 
          ? 'Invalid credentials. Try username: username, password: password' 
          : 'Error creating account');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          <GradientText>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </GradientText>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chairismatic-pink"
              placeholder={mode === 'login' ? 'Enter username' : 'Choose username'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chairismatic-pink"
              placeholder={mode === 'login' ? 'Enter password' : 'Choose password'}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={isLoading}
            icon={mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
          >
            {isLoading 
              ? 'Please wait...' 
              : mode === 'login' 
                ? 'Sign In' 
                : 'Create Account'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onToggleMode}
            className="text-sm text-gray-600 hover:text-chairismatic-pink"
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </motion.div>
    </Card>
  );
};

export default LoginForm;