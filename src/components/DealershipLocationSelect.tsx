import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DealershipLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface DealershipLocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const DealershipLocationSelect = ({ value, onChange, required }: DealershipLocationSelectProps) => {
  const [locations, setLocations] = useState<DealershipLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('dealership_locations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching dealership locations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <select
        className="w-full px-3 py-2 border border-input bg-background rounded-md"
        disabled
      >
        <option>Loading locations...</option>
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-input bg-background rounded-md"
      required={required}
    >
      <option value="">Select a dealership location</option>
      {locations.map((location) => (
        <option 
          key={location.id} 
          value={`${location.name} - ${location.address}, ${location.city}, ${location.state}`}
        >
          {location.name} - {location.city}, {location.state}
        </option>
      ))}
    </select>
  );
};