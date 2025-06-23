import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';

type FormData = {
  username: string;
  password: string;
};

const AdminLoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { adminLogin } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await adminLogin(data.username, data.password);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Admin login error:', error);
      
      // Show a more specific error message if available
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error('Invalid username or password');
      }
      
      // If the server is unavailable, show a more helpful message
      if (error?.code === 'ERR_NETWORK') {
        toast.info('Server is unavailable. Using local authentication mode.');
        
        // Try again with the hardcoded credentials for development
        if (data.username === 'admin' && data.password === 'admin123') {
          try {
            await adminLogin(data.username, data.password);
            toast.success('Login successful (local mode)!');
            navigate('/admin/dashboard');
            return;
          } catch (localError) {
            console.error('Local authentication error:', localError);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-secondary-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-semibold text-secondary-900">Admin Portal</h1>
          <p className="text-secondary-600 mt-2">Sign in to manage your store</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-secondary-700 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-secondary-500">
                <User className="h-5 w-5" />
              </div>
              <input
                id="username"
                type="text"
                {...register('username', { required: 'Username is required' })}
                className={`block w-full rounded-md border ${errors.username ? 'border-error-300' : 'border-gray-300'} pl-10 py-3 outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="admin"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-error-500">{errors.username.message}</p>
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
          
          {/* Login button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in to Admin Portal'}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-secondary-600">
              Default credentials: admin / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;