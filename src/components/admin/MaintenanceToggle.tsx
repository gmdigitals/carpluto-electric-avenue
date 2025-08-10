import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Construction, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const MaintenanceToggle = () => {
  const { toast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(false);

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

      if (error) throw error;
      setMaintenanceMode(data?.setting_value || false);
    } catch (error) {
      console.error('Error fetching maintenance mode:', error);
    }
  };

  const toggleMaintenanceMode = async (enabled: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: 'maintenance_mode',
          setting_value: enabled,
          description: 'Enable maintenance mode for the website'
        });

      if (error) throw error;

      setMaintenanceMode(enabled);
      toast({
        title: "Success",
        description: `Maintenance mode ${enabled ? 'enabled' : 'disabled'} successfully!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update maintenance mode",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Construction className="h-5 w-5" />
          Maintenance Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {maintenanceMode && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Maintenance mode is currently enabled. 
              All visitors will see the maintenance page instead of the website.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, visitors will see a maintenance page instead of the website
            </p>
          </div>
          <Switch
            id="maintenance-mode"
            checked={maintenanceMode}
            onCheckedChange={toggleMaintenanceMode}
            disabled={loading}
          />
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p><strong>Note:</strong> Admins will still be able to access the admin panel when maintenance mode is enabled.</p>
        </div>
      </CardContent>
    </Card>
  );
};