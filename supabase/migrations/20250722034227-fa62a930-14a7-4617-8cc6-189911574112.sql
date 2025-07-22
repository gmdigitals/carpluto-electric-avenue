-- Create audit logs table for tracking admin actions
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_audit_logs_admin_user_id ON public.audit_logs(admin_user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_resource_type ON public.audit_logs(resource_type);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'super_admin'])
));

CREATE POLICY "System can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (true);

-- Create analytics views for dashboard
CREATE OR REPLACE VIEW public.admin_analytics AS
SELECT 
  'overview' as metric_type,
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
  ) as data,
  now() as updated_at

UNION ALL

SELECT 
  'sales_by_month' as metric_type,
  json_agg(
    json_build_object(
      'month', month_year,
      'revenue', revenue,
      'orders', order_count
    )
  ) as data,
  now() as updated_at
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
) sales_data

UNION ALL

SELECT 
  'top_selling_cars' as metric_type,
  json_agg(
    json_build_object(
      'car_name', car_name,
      'sales_count', sales_count,
      'total_revenue', total_revenue
    )
  ) as data,
  now() as updated_at
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

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values
  );
END;
$$;