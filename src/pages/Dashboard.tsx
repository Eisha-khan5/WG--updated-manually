import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Heart, Settings, Sparkles, Eye, EyeOff, Mail, UserIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import WishlistSection from '@/components/dashboard/WishlistSection';
import RecommendationsSection from '@/components/dashboard/RecommendationsSection';

const Dashboard = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    gender: user?.preferences?.gender || '',
    colors: user?.preferences?.colors || [],
    fabrics: user?.preferences?.fabrics || [],
    brands: user?.preferences?.brands || []
  });

  const [newColor, setNewColor] = useState('');
  const [newFabric, setNewFabric] = useState('');
  const [newBrand, setNewBrand] = useState('');

  // Handle navigation from external links (like navbar wishlist)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section && ['profile', 'password', 'wishlist', 'preferences', 'recommendations'].includes(section)) {
      setActiveSection(section);
    }
  }, [location]);

  const handleProfileUpdate = () => {
    updateProfile(profileData);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    const success = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
    if (success) {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast({
        title: "Password Update Failed",
        description: "Current password is incorrect.",
        variant: "destructive",
      });
    }
  };

  const handlePreferencesUpdate = () => {
    updateProfile({ preferences });
    toast({
      title: "Preferences Updated",
      description: "Your style preferences have been saved.",
    });
  };

  const addToPreference = (type: 'colors' | 'fabrics' | 'brands', value: string) => {
    if (value.trim() && !preferences[type].includes(value.trim())) {
      setPreferences(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()]
      }));
    }
  };

  const removeFromPreference = (type: 'colors' | 'fabrics' | 'brands', value: string) => {
    setPreferences(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }));
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    navigate('/');
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'recommendations', label: 'Recommended for You', icon: Sparkles },
  ];

  const renderProfileSection = () => (
    <Card className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-200/60 shadow-lg">
      <CardHeader className="border-b border-stone-100 bg-gradient-to-r from-navy-50 to-stone-50">
        <CardTitle className="flex items-center gap-3 text-navy-800">
          <UserIcon className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-stone-700 font-semibold">Full Name</Label>
          <Input
            id="name"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            className="h-11 border-stone-200 focus:border-navy-400 focus:ring-navy-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-stone-700 font-semibold">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="pl-10 h-11 border-stone-200 focus:border-navy-400 focus:ring-navy-200"
            />
          </div>
        </div>
        <Button 
          onClick={handleProfileUpdate}
          className="bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          Update Profile
        </Button>
      </CardContent>
    </Card>
  );

  const renderPasswordSection = () => (
    <Card className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-200/60 shadow-lg">
      <CardHeader className="border-b border-stone-100 bg-gradient-to-r from-navy-50 to-stone-50">
        <CardTitle className="flex items-center gap-3 text-navy-800">
          <Lock className="h-5 w-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-stone-700 font-semibold">Current Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="pl-10 pr-10 h-11 border-stone-200 focus:border-navy-400 focus:ring-navy-200"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            >
              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-stone-700 font-semibold">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="pl-10 pr-10 h-11 border-stone-200 focus:border-navy-400 focus:ring-navy-200"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            >
              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-stone-500">Must be at least 8 characters long</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-stone-700 font-semibold">Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="pl-10 pr-10 h-11 border-stone-200 focus:border-navy-400 focus:ring-navy-200"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            >
              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button 
          onClick={handlePasswordUpdate}
          className="bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          Update Password
        </Button>
      </CardContent>
    </Card>
  );

  const renderWishlistSection = () => <WishlistSection />;

  const renderPreferencesSection = () => (
    <Card className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-200/60 shadow-lg">
      <CardHeader className="border-b border-stone-100 bg-gradient-to-r from-navy-50 to-stone-50">
        <CardTitle className="flex items-center gap-3 text-navy-800">
          <Settings className="h-5 w-5" />
          Style Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-stone-700 font-semibold">Gender</Label>
            <select
              value={preferences.gender}
              onChange={(e) => setPreferences(prev => ({ ...prev, gender: e.target.value }))}
              className="w-full p-3 border border-stone-200 rounded-lg focus:border-navy-400 focus:ring-navy-200 bg-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-stone-700 font-semibold">Preferred Colors</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Add a color"
                className="flex-1 border-stone-200 focus:border-navy-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addToPreference('colors', newColor);
                    setNewColor('');
                  }
                }}
              />
              <Button
                onClick={() => {
                  addToPreference('colors', newColor);
                  setNewColor('');
                }}
                variant="outline"
                className="border-navy-200 text-navy-700 hover:bg-navy-50"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {preferences.colors.map((color, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-navy-100 text-navy-800 hover:bg-navy-200 cursor-pointer"
                  onClick={() => removeFromPreference('colors', color)}
                >
                  {color} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-stone-700 font-semibold">Preferred Fabrics</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newFabric}
                onChange={(e) => setNewFabric(e.target.value)}
                placeholder="Add a fabric"
                className="flex-1 border-stone-200 focus:border-navy-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addToPreference('fabrics', newFabric);
                    setNewFabric('');
                  }
                }}
              />
              <Button
                onClick={() => {
                  addToPreference('fabrics', newFabric);
                  setNewFabric('');
                }}
                variant="outline"
                className="border-navy-200 text-navy-700 hover:bg-navy-50"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {preferences.fabrics.map((fabric, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-navy-100 text-navy-800 hover:bg-navy-200 cursor-pointer"
                  onClick={() => removeFromPreference('fabrics', fabric)}
                >
                  {fabric} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-stone-700 font-semibold">Preferred Brands</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="Add a brand"
                className="flex-1 border-stone-200 focus:border-navy-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addToPreference('brands', newBrand);
                    setNewBrand('');
                  }
                }}
              />
              <Button
                onClick={() => {
                  addToPreference('brands', newBrand);
                  setNewBrand('');
                }}
                variant="outline"
                className="border-navy-200 text-navy-700 hover:bg-navy-50"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {preferences.brands.map((brand, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-navy-100 text-navy-800 hover:bg-navy-200 cursor-pointer"
                  onClick={() => removeFromPreference('brands', brand)}
                >
                  {brand} ×
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={handlePreferencesUpdate}
          className="bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );

  const renderRecommendationsSection = () => <RecommendationsSection />;

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'password':
        return renderPasswordSection();
      case 'wishlist':
        return renderWishlistSection();
      case 'preferences':
        return renderPreferencesSection();
      case 'recommendations':
        return renderRecommendationsSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-navy-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy-800 mb-3">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-stone-600 text-lg">Manage your account and discover your perfect style</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border border-stone-200/60 shadow-lg sticky top-24">
              <CardHeader className="border-b border-stone-100 bg-gradient-to-r from-navy-50 to-stone-50">
                <CardTitle className="text-navy-800">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-200 ${
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-navy-100 to-stone-100 text-navy-800 border-r-4 border-navy-600'
                            : 'text-stone-600 hover:bg-stone-50 hover:text-navy-700'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-6 py-4 text-left text-red-600 hover:bg-red-50 transition-colors border-t border-stone-100 mt-4"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
