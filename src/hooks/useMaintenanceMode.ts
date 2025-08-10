import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceMode();
  }, []);

  const fetchMaintenanceMode = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'maintenance_mode')
        .single();

      if (error) {
        console.error('Error fetching maintenance mode:', error);
        return;
      }

      setIsMaintenanceMode(data?.setting_value || false);
    } catch (error) {
      console.error('Error fetching maintenance mode:', error);
    } finally {
      setLoading(false);
    }
  };

  return { isMaintenanceMode, loading };
};