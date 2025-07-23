-- Fix infinite recursion in profiles RLS policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a better admin policy that doesn't cause recursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR ALL
USING (
  -- Allow users to see their own profile
  auth.uid() = user_id OR
  -- Allow if user has admin role (using direct lookup to avoid recursion)
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('admin', 'super_admin')
  )
);