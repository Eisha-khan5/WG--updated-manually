
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if email exists in registered users with better error handling
      const registeredUsersData = localStorage.getItem('registered_users');
      console.log('Registered users data:', registeredUsersData);
      
      let registeredUsers = [];
      try {
        registeredUsers = registeredUsersData ? JSON.parse(registeredUsersData) : [];
      } catch (parseError) {
        console.error('Error parsing registered users:', parseError);
        registeredUsers = [];
      }
      
      console.log('Parsed registered users:', registeredUsers);
      console.log('Looking for email:', email.toLowerCase());
      
      // More robust email checking
      const userExists = registeredUsers.some((user: any) => {
        console.log('Checking user:', user);
        return user && user.email && user.email.toLowerCase() === email.toLowerCase();
      });
      
      console.log('User exists:', userExists);
      
      if (!userExists) {
        // For demo purposes, we'll allow password reset for any valid email format
        // In a real app, this would be handled by the backend
        console.log('User not found in registered users, but proceeding with demo reset');
      }

      // Simulate password reset email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store a temporary reset token for demo purposes
      const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const resetData = {
        email: email.toLowerCase(),
        token: resetToken,
        timestamp: Date.now(),
        used: false
      };
      
      const existingResets = JSON.parse(localStorage.getItem('password_resets') || '[]');
      existingResets.push(resetData);
      localStorage.setItem('password_resets', JSON.stringify(existingResets));
      
      setIsSubmitted(true);
      toast({
        title: "Reset link sent!",
        description: "Please check your email for password reset instructions.",
      });
      
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSubmitted(false);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-navy-700">
            {isSubmitted ? 'Check Your Email' : 'Reset Password'}
          </DialogTitle>
          <DialogDescription className="text-center text-stone-600">
            {isSubmitted 
              ? `We've sent password reset instructions to ${email}`
              : 'Enter your email address and we\'ll send you a link to reset your password.'
            }
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-stone-700 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12 border-stone-200 focus:border-stone-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-12"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-navy-600 to-navy-700 hover:from-stone-500 hover:to-stone-600 text-white transition-all duration-500"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 mt-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-stone-600">
              If you don't see the email in your inbox, please check your spam folder.
            </p>
            <Button
              onClick={handleClose}
              className="w-full h-12 bg-gradient-to-r from-navy-600 to-navy-700 hover:from-stone-500 hover:to-stone-600 text-white transition-all duration-500"
            >
              Back to Sign In
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
