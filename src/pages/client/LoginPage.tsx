import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';

type FormData = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  const { login } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      // Show more specific error message if available
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    // In a real implementation, this would use the Google OAuth API
    toast.info('Google login is not implemented in this demo');
  };
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif font-semibold text-secondary-900">Welcome Back</h1>
              <p className="text-secondary-600 mt-2">Sign in to your account</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-secondary-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      }
                    })}
                    className={`block w-full rounded-md border ${errors.email ? 'border-error-300' : 'border-gray-300'} pl-10 py-3 outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error-500">{errors.email.message}</p>
                )}
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-secondary-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register('password', { required: 'Password is required' })}
                    className={`block w-full rounded-md border ${errors.password ? 'border-error-300' : 'border-gray-300'} pl-10 py-3 pr-10 outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-secondary-500 hover:text-secondary-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-500">{errors.password.message}</p>
                )}
              </div>
              
              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              {/* Login button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading}
                icon={<LogIn className="h-5 w-5" />}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-secondary-500">Or continue with</span>
                </div>
              </div>
              
              {/* Google login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-gray-50"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064 5.963 5.963 0 014.117 1.571l2.83-2.835A9.965 9.965 0 0012.545 2 10.045 10.045 0 002.5 12.046a10.045 10.045 0 0010.045 10.045c5.547 0 9.457-4.007 9.457-9.66 0-.562-.054-1.223-.147-1.773h-9.31z"
                    fill="#4285F4"
                  />
                </svg>
                Sign in with Google
              </button>
              
              {/* Sign up link */}
              <div className="text-center mt-6">
                <p className="text-sm text-secondary-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;