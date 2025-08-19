
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to dashboard wishlist section if authenticated
    if (isAuthenticated) {
      navigate('/dashboard?section=wishlist', { replace: true });
    } else {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // This component will redirect immediately, so no need to render anything
  return null;
};

export default WishlistPage;
