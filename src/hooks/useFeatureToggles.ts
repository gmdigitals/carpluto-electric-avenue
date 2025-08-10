import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeatureToggle {
  setting_key: string;
  setting_value: boolean;
  description: string;
}

interface FeatureToggles {
  enableFinancing: boolean;
  enableChargingStations: boolean;
  enableEvSupport: boolean;
  showOurImpact: boolean;
  enableWatermark: boolean;
  maintenanceMode: boolean;
}

export const useFeatureToggles = () => {
  const [features, setFeatures] = useState<FeatureToggles>({
    enableFinancing: false,
    enableChargingStations: false,
    enableEvSupport: false,
    showOurImpact: true,
    enableWatermark: false,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatureToggles();
  }, []);

  const fetchFeatureToggles = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value, description');

      if (error) {
        console.error('Error fetching feature toggles:', error);
        return;
      }

      const toggleMap: Record<string, boolean> = {};
      data?.forEach((toggle: FeatureToggle) => {
        toggleMap[toggle.setting_key] = toggle.setting_value;
      });

      setFeatures({
        enableFinancing: toggleMap['enable_financing'] || false,
        enableChargingStations: toggleMap['enable_charging_stations'] || false,
        enableEvSupport: toggleMap['enable_ev_support'] || false,
        showOurImpact: toggleMap['show_our_impact'] !== false,
        enableWatermark: toggleMap['enable_watermark'] || false,
        maintenanceMode: toggleMap['maintenance_mode'] || false,
      });
    } catch (error) {
      console.error('Error fetching feature toggles:', error);
    } finally {
      setLoading(false);
    }
  };

  return { features, loading, refetchFeatures: fetchFeatureToggles };
};