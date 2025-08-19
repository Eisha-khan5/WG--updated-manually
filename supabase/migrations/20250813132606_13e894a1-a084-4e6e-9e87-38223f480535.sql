-- Enable Row Level Security on Users table
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own profile
CREATE POLICY "Users can view own profile" 
ON public."Users" 
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile" 
ON public."Users" 
FOR UPDATE 
USING (auth.uid() = id);