-- Fix security definer view issue and function search path
DROP VIEW IF EXISTS public.admin_analytics;

-- Fix function search paths first
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.log_admin_action(TEXT, TEXT, UUID, JSONB, JSONB) SET search_path = public;

-- Create a security definer function to get user role (fixes infinite recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Fix the profiles policy using the security definer function
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR ALL
USING (
  auth.uid() = user_id OR
  public.get_current_user_role() IN ('admin', 'super_admin')
);

-- Create analytics table instead of view (better security)
CREATE TABLE public.admin_analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_analytics_cache ENABLE ROW LEVEL SECURITY;

-- Create policy for analytics cache
CREATE POLICY "Admins can view analytics" 
ON public.admin_analytics_cache 
FOR SELECT 
USING (public.get_current_user_role() IN ('admin', 'super_admin'));

-- Create function to refresh analytics (called by admins)
CREATE OR REPLACE FUNCTION public.refresh_admin_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Clear existing cache
  DELETE FROM public.admin_analytics_cache;
  
  -- Insert overview metrics
  INSERT INTO public.admin_analytics_cache (metric_type, data) VALUES (
    'overview',
    json_build_object(
      'total_users', (SELECT COUNT(*) FROM profiles),
      'total_cars', (SELECT COUNT(*) FROM cars),
      'total_orders', (SELECT COUNT(*) FROM orders),
      'total_test_drives', (SELECT COUNT(*) FROM test_drives),
      'revenue_this_month', (
        SELECT COALESCE(SUM(total_amount), 0) 
        FROM orders 
        WHERE status = 'paid' 
        AND created_at >= date_trunc('month', now())
      ),
      'pending_test_drives', (
        SELECT COUNT(*) 
        FROM test_drives 
        WHERE status = 'pending'
      )
    )
  );
  
  -- Insert sales by month
  INSERT INTO public.admin_analytics_cache (metric_type, data)
  SELECT 
    'sales_by_month',
    json_agg(
      json_build_object(
        'month', month_year,
        'revenue', revenue,
        'orders', order_count
      )
    )
  FROM (
    SELECT 
      to_char(created_at, 'YYYY-MM') as month_year,
      SUM(total_amount) as revenue,
      COUNT(*) as order_count
    FROM orders 
    WHERE status = 'paid'
    AND created_at >= now() - interval '12 months'
    GROUP BY to_char(created_at, 'YYYY-MM')
    ORDER BY month_year
  ) sales_data;
  
  -- Insert top selling cars
  INSERT INTO public.admin_analytics_cache (metric_type, data)
  SELECT 
    'top_selling_cars',
    json_agg(
      json_build_object(
        'car_name', car_name,
        'sales_count', sales_count,
        'total_revenue', total_revenue
      )
    )
  FROM (
    SELECT 
      cars.brand || ' ' || cars.model as car_name,
      COUNT(orders.id) as sales_count,
      SUM(orders.total_amount) as total_revenue
    FROM cars
    LEFT JOIN orders ON cars.id = orders.car_id
    WHERE orders.status = 'paid'
    GROUP BY cars.id, cars.brand, cars.model
    ORDER BY sales_count DESC
    LIMIT 5
  ) top_cars;
END;
$$;