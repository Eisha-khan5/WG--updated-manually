
// React core imports
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import for toast notifications - using the correct toaster from hooks
import { Toaster } from "@/components/ui/toaster";

// Component to reset scroll position on route change
import ScrollToTop from './components/ScrollToTop';

// Authentication context
import { AuthProvider } from './contexts/AuthContext';

// ===== Import all page components (eagerly) =====
import Index from './pages/Index';               // Home page
import SearchResults from './pages/SearchResults'; // Search results page
import ProductDetail from './pages/ProductDetail'; // Product detail page
import Wishlist from './pages/Wishlist';         // Wishlist page
import Dashboard from './pages/Dashboard';       // Customer dashboard page
import About from './pages/About';               // About us page
import Auth from './pages/Auth';                 // Authentication page
import NotFound from './pages/NotFound';         // Fallback for undefined routes (404)

// Import global styles
import './index.css';
import './App.css';

// ===== Main App Component =====
function App() {
  return (
    <AuthProvider> {/* Wrap entire app with authentication context */}
      <BrowserRouter> {/* Sets up routing using HTML5 history API */}
        <ScrollToTop /> {/* Automatically scrolls to top on route change */}
        
        <Routes> {/* Route definitions */}
          <Route path="/" element={<Index />} /> {/* Home page */}
          <Route path="/search" element={<SearchResults />} /> {/* Search results */}
          <Route path="/product/:id" element={<ProductDetail />} /> {/* Dynamic product page by ID */}
          <Route path="/wishlist" element={<Wishlist />} /> {/* User's wishlist */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Customer dashboard */}
          <Route path="/about" element={<About />} /> {/* About page */}
          <Route path="/auth" element={<Auth />} /> {/* Authentication page */}
          <Route path="*" element={<NotFound />} /> {/* 404 - Page not found */}
        </Routes>

        <Toaster /> {/* Mounts toast notification system at the root level */}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; // Exports the App component as default
