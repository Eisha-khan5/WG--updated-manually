
import { supabase } from '@/integrations/supabase/client';

export interface UserPreferences {
  gender?: string;
  colors?: string[];
  fabrics?: string[];
  brands?: string[];
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export const getUserPreferences = async (userId: string): Promise<UserPreferences> => {
  try {
    const { data, error } = await supabase
      .from('Preferences')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching preferences:', error);
      return {};
    }

    if (!data || data.length === 0) {
      return {};
    }

    // Aggregate preferences from multiple rows
    const preferences: UserPreferences = {
      colors: [],
      fabrics: [],
      brands: [],
      categories: [],
    };

    data.forEach(pref => {
      if (pref.gender && !preferences.gender) {
        preferences.gender = pref.gender;
      }
      if (pref.brand && !preferences.brands?.includes(pref.brand)) {
        preferences.brands?.push(pref.brand);
      }
      if (pref.category && !preferences.categories?.includes(pref.category)) {
        preferences.categories?.push(pref.category);
      }
      if (pref.fabric && !preferences.fabrics?.includes(pref.fabric)) {
        preferences.fabrics?.push(pref.fabric);
      }
      if (pref.min_price !== null && (preferences.minPrice === undefined || pref.min_price < preferences.minPrice)) {
        preferences.minPrice = pref.min_price;
      }
      if (pref.max_price !== null && (preferences.maxPrice === undefined || pref.max_price > preferences.maxPrice)) {
        preferences.maxPrice = pref.max_price;
      }
    });

    return preferences;
  } catch (error) {
    console.error('Failed to fetch preferences:', error);
    return {};
  }
};

export const saveUserPreferences = async (userId: string, preferences: UserPreferences): Promise<boolean> => {
  try {
    // First, delete existing preferences
    await supabase
      .from('Preferences')
      .delete()
      .eq('user_id', userId);

    // Then insert new preferences
    const preferencesToInsert = [];

    // Add brand preferences
    if (preferences.brands && preferences.brands.length > 0) {
      preferences.brands.forEach(brand => {
        preferencesToInsert.push({
          user_id: userId,
          brand,
          category: preferences.categories?.[0] || 'general',
          gender: preferences.gender || null,
          fabric: preferences.fabrics?.[0] || null,
          min_price: preferences.minPrice || null,
          max_price: preferences.maxPrice || null,
        });
      });
    }

    // Add category preferences if no brands specified
    if (preferencesToInsert.length === 0 && preferences.categories && preferences.categories.length > 0) {
      preferences.categories.forEach(category => {
        preferencesToInsert.push({
          user_id: userId,
          brand: 'general',
          category,
          gender: preferences.gender || null,
          fabric: preferences.fabrics?.[0] || null,
          min_price: preferences.minPrice || null,
          max_price: preferences.maxPrice || null,
        });
      });
    }

    // Fallback: create a general preference entry
    if (preferencesToInsert.length === 0) {
      preferencesToInsert.push({
        user_id: userId,
        brand: 'general',
        category: 'general',
        gender: preferences.gender || null,
        fabric: preferences.fabrics?.[0] || null,
        min_price: preferences.minPrice || null,
        max_price: preferences.maxPrice || null,
      });
    }

    const { error } = await supabase
      .from('Preferences')
      .insert(preferencesToInsert);

    if (error) {
      console.error('Error saving preferences:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to save preferences:', error);
    return false;
  }
};
