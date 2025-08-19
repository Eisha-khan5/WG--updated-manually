
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser extends User {
  name?: string;
  full_name?: string;
  preferences?: {
    gender?: string;
    colors?: string[];
    fabrics?: string[];
    brands?: string[];
  };
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: { full_name?: string; email?: string; preferences?: any }) => Promise<{ error?: any }>;
  requireAuth: (callback: () => void) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        setSession(session);
        
        if (session?.user && session.user.email_confirmed_at) {
          // Only set user if email is confirmed
          setTimeout(async () => {
            try {
              // Fetch user profile from Users table
              const { data: profile, error } = await supabase
                .from('Users')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error && error.code === 'PGRST116') {
                // Profile doesn't exist, create it
                const { error: insertError } = await supabase
                  .from('Users')
                  .insert({
                    id: session.user.id,
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name || ''
                  });
                
                if (insertError) {
                  console.error('Error creating user profile:', insertError);
                }
              }
              
              setUser({
                ...session.user,
                name: profile?.full_name || session.user.user_metadata?.full_name || '',
                full_name: profile?.full_name || session.user.user_metadata?.full_name || '',
                preferences: {
                  gender: '',
                  colors: [],
                  fabrics: [],
                  brands: []
                }
              });
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }, 0);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email_confirmed_at) {
        // Only process if email is confirmed
        setSession(session);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      // Check if email is confirmed
      if (!data.user?.email_confirmed_at) {
        await supabase.auth.signOut(); // Sign out if email not confirmed
        return { success: false, error: 'Please confirm your email address before logging in.' };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
      }

      // Don't automatically log in - user needs to confirm email first
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: { full_name?: string; email?: string; preferences?: any }) => {
    if (!user) return { error: 'No user logged in' };

    try {
      // Update auth user if email is being changed
      if (updates.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: updates.email
        });
        if (authError) return { error: authError };
      }

      // Update profile in Users table
      const profileUpdates: any = {};
      if (updates.full_name) profileUpdates.full_name = updates.full_name;
      if (updates.email) profileUpdates.email = updates.email;

      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('Users')
          .update(profileUpdates)
          .eq('id', user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          return { error: profileError };
        }
      }

      // Handle preferences separately if needed
      if (updates.preferences) {
        setUser(prev => prev ? { ...prev, preferences: updates.preferences } : null);
      }

      return { error: null };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { error };
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Password update error:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Password update failed:', error);
      return false;
    }
  };

  const requireAuth = (callback: () => void) => {
    if (session && user && user.email_confirmed_at) {
      callback();
    } else {
      window.location.href = '/auth';
    }
  };

  const isAuthenticated = !!session && !!user && !!user.email_confirmed_at;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated,
      login,
      register,
      logout,
      updateProfile,
      requireAuth,
      updatePassword,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
