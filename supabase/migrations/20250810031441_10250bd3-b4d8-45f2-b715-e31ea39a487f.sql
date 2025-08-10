-- Add watermark settings to admin_settings table
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES 
('enable_watermark', false, 'Enable watermark on vehicle images'),
('watermark_url', '', 'URL of the watermark image file')
ON CONFLICT (setting_key) DO NOTHING;

-- Add maintenance mode setting
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES 
('maintenance_mode', false, 'Enable maintenance mode for the website')
ON CONFLICT (setting_key) DO NOTHING;

-- Create dealership locations table
CREATE TABLE IF NOT EXISTS public.dealership_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on dealership_locations
ALTER TABLE public.dealership_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for dealership_locations
CREATE POLICY "Anyone can view active dealership locations"
ON public.dealership_locations
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage dealership locations"
ON public.dealership_locations
FOR ALL
USING (EXISTS (
  SELECT 1
  FROM profiles
  WHERE profiles.user_id = auth.uid()
  AND profiles.role = ANY (ARRAY['admin', 'super_admin'])
));

-- Add trigger for updated_at
CREATE TRIGGER update_dealership_locations_updated_at
BEFORE UPDATE ON public.dealership_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default dealership location
INSERT INTO public.dealership_locations (name, address, city, state, phone, email, features) VALUES
('Lagos Island Premium Showroom', 'Victoria Island', 'Lagos', 'Lagos', '+234-902-1475-523', 'lagos@carpluto.com.ng', ARRAY['Climate-controlled environment', 'VIP lounge with refreshments', 'Tesla & luxury EV specialists']);