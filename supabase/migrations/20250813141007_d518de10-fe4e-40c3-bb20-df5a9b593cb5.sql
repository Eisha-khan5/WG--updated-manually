
-- Enable RLS on all tables that don't have it yet
ALTER TABLE public."Preferences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Wishlist" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Preferences table
CREATE POLICY "Users can view own preferences" ON public."Preferences"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public."Preferences"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public."Preferences"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences" ON public."Preferences"
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for Wishlist table
CREATE POLICY "Users can view own wishlist" ON public."Wishlist"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own wishlist" ON public."Wishlist"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist" ON public."Wishlist"
  FOR DELETE USING (auth.uid() = user_id);

-- Create policy to allow users to insert into Users table (for profile creation)
CREATE POLICY "Users can insert own profile" ON public."Users"
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow public read access to ProductCard table (products should be viewable by everyone)
CREATE POLICY "Anyone can view products" ON public."ProductCard"
  FOR SELECT TO public
  USING (true);
