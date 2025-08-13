-- Create admin login credentials table
CREATE TABLE IF NOT EXISTS public.admin_login_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_login_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy for admin login access
CREATE POLICY "Only super admins can manage admin credentials" 
ON public.admin_login_credentials 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
);

-- Insert default admin credentials (password: CarPluto2025!)
INSERT INTO public.admin_login_credentials (username, password_hash) 
VALUES ('carpluto_admin', '$2b$10$HixVOjyBtaU5iBgKzKg91O7Zf0qQvZYJzKg91O7Zf0qQvZYJzKg91O');

-- Create function to delete all cars
CREATE OR REPLACE FUNCTION public.delete_all_cars()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = ANY(ARRAY['admin', 'super_admin'])
  ) THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;
  
  -- Delete all cars
  DELETE FROM public.cars;
  
  -- Log the action
  PERFORM public.log_admin_action(
    'DELETE_ALL',
    'cars',
    null,
    null,
    null
  );
END;
$function$;