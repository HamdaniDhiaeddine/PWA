import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { BotanicalPattern } from '../components/BotanicalPattern';
import { apiService } from '../utils/api';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password:  '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }
        await apiService.login(formData. email, formData.password);
      } else {
        if (! formData.name || !formData.email || !formData.password) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        await apiService.register(formData.name, formData.email, formData.password);
      }

      onLogin();
      navigate('/dashboard');
    } catch (err:  any) {
      setError(err.message || 'Authentication failed.  Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <BotanicalPattern />
      </div>
      <div className="fixed top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-jade-light/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

      <motion.div
        initial={{
          opacity: 0,
          y:  20,
        }}
        animate={{
          opacity: 1,
          y:  0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-emerald-100/50 relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
            }}
            animate={{
              scale:  1,
              opacity: 1,
            }}
            transition={{
              delay: 0.2,
              duration: 0.5,
            }}
            className="w-20 h-20 bg-emerald-100 rounded-2xl mx-auto mb-6 flex items-center justify-center rotate-3"
          >
            <span className="text-4xl">🌿</span>
          </motion. div>
          <h1 className="text-4xl font-serif font-bold text-forest mb-2">
            AnimalCare
          </h1>
          <p className="text-sage font-medium">
            {isLogin ? 'Welcome back to your pets' : 'Join us and care for your pets'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity:  1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700"
          >
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion. div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {! isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-forest ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full bg-cream border-2 border-transparent focus:border-emerald rounded-2xl py-3 px-4 text-forest placeholder: text-sage/60 outline-none transition-all duration-300"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-forest ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sage"
                size={20}
              />
              <input
                type="email"
                name="email"
                value={formData. email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-cream border-2 border-transparent focus:border-emerald rounded-2xl py-3 pl-12 pr-4 text-forest placeholder:text-sage/60 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-forest ml-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sage"
                size={20}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-cream border-2 border-transparent focus:border-emerald rounded-2xl py-3 pl-12 pr-12 text-forest placeholder:text-sage/60 outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sage hover:text-forest transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> :  <Eye size={20} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{
              scale:  1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald/20 flex items-center justify-center gap-2 hover:bg-emerald-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-pulse">
                {isLogin ? 'Signing in...' : 'Creating account... '}
              </span>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}{' '}
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-sage mb-3">
            {isLogin
              ? "Don't have an account? "
              : 'Already have an account? '}
          </p>
          <button
            onClick={() => {
              setIsLogin(! isLogin);
              setError('');
              setFormData({ name: '', email: '', password: '' });
            }}
            className="text-emerald font-bold hover:underline transition-colors"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </motion.div>

      <p className="text-center text-sage text-xs mt-8 relative z-10">
        🔒 Your data is securely encrypted and stored
      </p>
    </div>
  );
}