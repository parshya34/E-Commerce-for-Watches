import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';

type EmailFormData = {
  email: string;
};

type PasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuthStore();
  
  // Email form
  const emailForm = useForm<EmailFormData>();
  
  // Password form
  const passwordForm = useForm<PasswordFormData>({
    mode: 'onChange'
  });
  
  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      setIsLoading(true);
      // Make the actual API call to get a valid reset token
      const response = await forgotPassword(data.email);
      setEmail(data.email);
      setResetToken(response.resetToken);
      setStep('password');
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send password reset request';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      // Make the actual API call to reset the password
      await resetPassword(email, resetToken, data.newPassword);
      toast.success('Password reset successful');
      navigate('/login');
    } catch (error: any) {
      console.error('Password reset error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif font-semibold text-secondary-900">
                {step === 'email' && 'Forgot Password'}
                {step === 'password' && 'Reset Password'}
              </h1>
              <p className="text-secondary-600 mt-2">
                {step === 'email' && 'Enter your email to reset your password'}
                {step === 'password' && 'Create a new password for your account'}
              </p>
            </div>
            
            {/* Email Step */}
            {step === 'email' && (
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-6">
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
                      {...emailForm.register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        }
                      })}
                      className={`block w-full rounded-md border ${emailForm.formState.errors.email ? 'border-error-300' : 'border-gray-300'} pl-10 py-3 outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-error-500">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </Button>
                
                <div className="text-center mt-4">
                  <Link to="/login" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
            
            {/* Password Step */}
            {step === 'password' && (
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-secondary-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-secondary-500">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      {...passwordForm.register('newPassword', { 
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        }
                      })}
                      className={`block w-full rounded-md border ${passwordForm.formState.errors.newPassword ? 'border-error-300' : 'border-gray-300'} pl-10 py-3 pr-10 outline-none focus:ring-2 focus:ring-primary-500`}
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
                  {passwordForm.formState.errors.newPassword && (
                    <p className="mt-1 text-sm text-error-500">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                
                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-secondary-500">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...passwordForm.register('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: (value) => 
                          value === passwordForm.watch('newPassword') || 'Passwords do not match'
                      })}
                      className={`block w-full rounded-md border ${passwordForm.formState.errors.confirmPassword ? 'border-error-300' : 'border-gray-300'} pl-10 py-3 pr-10 outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-secondary-500 hover:text-secondary-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-error-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
                
                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep('email')}
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;