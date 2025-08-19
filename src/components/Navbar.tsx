
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"; // Custom button component
import { Search, User, Menu, X, Bookmark } from 'lucide-react'; // Icons from Lucide
import { useIsMobile } from '@/hooks/use-mobile'; // Custom hook to detect mobile devices
import { useAuth } from '@/contexts/AuthContext'; // Authentication context

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle for mobile menu
  const [isScrolled, setIsScrolled] = useState(false); // State to track if the navbar is scrolled
  const isMobile = useIsMobile(); //  Determine if screen size is mobile
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Get authentication state

  // Detect scroll position to change navbar style (e.g., add shadow)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/dashboard?section=wishlist');
    } else {
      navigate('/auth');
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 nav-container transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-sm backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
      }`}>

      {/* Navbar container */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="logo-text font-serif text-2xl font-bold tracking-tight relative overflow-hidden">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-stone-700 to-stone-500">Wardrobe</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-navy-700 to-navy-400">Genius</span>
          </h1>
        </Link>

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <div className="flex items-center space-x-6">
            <div className="flex space-x-4 mr-2">
              <Link to="/" className="text-black-600 font-medium hover:text-gray-600">Home</Link>
              <Link to="/brands" className="text-black-600 font-medium hover:text-gray-600">Brands</Link>
            </div>

            <div className="flex items-center space-x-3">
               {/* Search button */}
              <Link to="/search">
                <Button variant="outline" size="icon" className="rounded-full hover:bg-navy-50">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </Link>

                {/* Wishlist button */}
              <button onClick={handleWishlistClick}>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-navy-50">
                  <Bookmark className="h-5 w-5" />
                  <span className="sr-only">Wishlist</span>
                </Button>
              </button>

               {/* Authentication buttons */}
               {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button
                    size="icon"
                    className="bg-gradient-to-r from-navy-600 to-navy-600 hover:from-stone-600 hover:to-stone-600 text-white rounded-full shadow-sm transition-all duration-300"
                  >
                    <User className="h-4 w-4" />
                    <span className="sr-only">Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button
                    className="bg-gradient-to-r from-navy-600 to-navy-600 hover:from-stone-600 hover:to-stone-600 text-white rounded-full px-5 shadow-sm transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Mobile Hamburger Menu Button */}
        {isMobile && (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 hover:bg-white/20 border border-gray-200 shadow-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? 
                <X className="h-5 w-5 text-gray-900" /> : 
                <Menu className="h-5 w-5 text-gray-900" />
              }
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-gradient-to-b from-white/98 to-neutral-50/98 backdrop-blur-sm z-40 pt-20">
          <div className="container mx-auto px-4 flex flex-col gap-4">
             {/* Mobile Links */}
            <Link to="/" className="py-4 border-b border-neutral-100 flex items-center transition-colors hover:text-stone-700" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>

            <Link to="/brands" className="py-4 border-b border-neutral-100 flex items-center transition-colors hover:text-stone-700" onClick={() => setIsMenuOpen(false)}>
              Brands
            </Link>
            
            <Link to="/search" className="py-4 border-b border-neutral-100 flex items-center transition-colors hover:text-stone-700" onClick={() => setIsMenuOpen(false)}>
              <Search className="h-5 w-5 mr-4" />
              Search Products
            </Link>

            <button onClick={handleWishlistClick} className="py-4 border-b border-neutral-100 flex items-center transition-colors hover:text-stone-700 text-left">
              <Bookmark className="h-5 w-5 mr-4" />
              My Wishlist
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard" className="py-4 border-b border-neutral-100 flex items-center transition-colors hover:text-stone-700" onClick={() => setIsMenuOpen(false)}>
                <User className="h-5 w-5 mr-4" />
                Dashboard
              </Link>
            ) : (
              <Link to="/auth" className="py-4 border-b border-neutral-100 flex items-center transition-colors hover:text-stone-700" onClick={() => setIsMenuOpen(false)}>
                <User className="h-5 w-5 mr-4" />
                Sign In
              </Link>
            )}

             {/* Mobile auth button */}
            {!isAuthenticated && (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button className="mt-6 w-full bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white rounded-full py-6 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
