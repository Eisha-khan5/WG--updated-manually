import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import luxuryBg from '@/assets/luxury-fashion-bg.jpg';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isSignUp && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (isSignUp) {
      // Additional password strength checks for signup
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumber = /\d/.test(formData.password);

      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const result = await register(formData.email, formData.password, formData.name);
        if (result.success) {
          setShowEmailConfirmation(true);
          toast({
            title: "Account created successfully!",
            description: "Please check your email and click the confirmation link to complete registration.",
          });
        } else {
          toast({
            title: "Registration Failed",
            description: result.error || "An error occurred during registration.",
            variant: "destructive",
          });
        }
      } else {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast({
            title: "Welcome back!",
            description: "You have been successfully signed in.",
          });
          navigate('/dashboard');
        } else {
          toast({
            title: "Login Failed",
            description: result.error || "Invalid email or password.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${luxuryBg})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/30 via-navy-800/20 to-stone-900/40" />
        
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Card className="shadow-2xl border-0 backdrop-blur-md bg-white/95 ring-1 ring-white/20">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-navy-700">
                  Check Your Email
                </CardTitle>
                <p className="text-navy-600 mt-2">
                  We've sent a confirmation link to <strong>{formData.email}</strong>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <p className="text-sm text-stone-600">
                    Please click the confirmation link in your email to activate your account. 
                    You'll then be able to sign in.
                  </p>
                  <Button
                    onClick={() => {
                      setShowEmailConfirmation(false);
                      setIsSignUp(false);
                      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Luxury Fashion Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${luxuryBg})`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/30 via-navy-800/20 to-stone-900/40" />
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors group backdrop-blur-sm bg-white/10 rounded-full px-4 py-2"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to WardrobeGenius
        </Link>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Card className="shadow-2xl border-0 backdrop-blur-md bg-white/95 ring-1 ring-white/20">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-navy-700 to-navy-500 bg-clip-text text-transparent">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </CardTitle>
                <p className="text-navy-600 mt-2 font-medium">
                  {isSignUp 
                    ? 'Join WardrobeGenius to discover your perfect style' 
                    : 'Sign in to continue your fashion journey'
                  }
                </p>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <AnimatePresence mode="wait" custom={isSignUp ? 1 : -1}>
                <motion.form
                  key={isSignUp ? 'signup' : 'signin'}
                  custom={isSignUp ? 1 : -1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-stone-700 font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          className={`pl-10 h-12 border-stone-200 focus:border-stone-400 ${
                            errors.name ? 'border-red-300 focus:border-red-400' : ''
                          }`}
                          value={formData.name}
                          onChange={handleInputChange('name')}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-stone-700 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-10 h-12 border-stone-200 focus:border-stone-400 ${
                          errors.email ? 'border-red-300 focus:border-red-400' : ''
                        }`}
                        value={formData.email}
                        onChange={handleInputChange('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-stone-700 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`pl-10 pr-10 h-12 border-stone-200 focus:border-stone-400 ${
                          errors.password ? 'border-red-300 focus:border-red-400' : ''
                        }`}
                        value={formData.password}
                        onChange={handleInputChange('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-stone-700 font-medium">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className={`pl-10 pr-10 h-12 border-stone-200 focus:border-stone-400 ${
                            errors.confirmPassword ? 'border-red-300 focus:border-red-400' : ''
                          }`}
                          value={formData.confirmPassword}
                          onChange={handleInputChange('confirmPassword')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  {!isSignUp && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-stone-600 hover:text-stone-800 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-navy-600 to-navy-700 hover:from-stone-500 hover:to-stone-600 text-white font-semibold transition-all duration-500 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </div>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </Button>
                </motion.form>
              </AnimatePresence>

              <div className="text-center pt-4">
                <p className="text-stone-600">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                      setErrors({});
                    }}
                    className="ml-2 text-navy-700 font-semibold hover:text-navy-900 transition-colors"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>

              {isSignUp && (
                <p className="text-xs text-stone-500 text-center leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-navy-700 hover:text-navy-900 font-medium">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-navy-700 hover:text-navy-900 font-medium">Privacy Policy</a>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
};

export default Auth;
