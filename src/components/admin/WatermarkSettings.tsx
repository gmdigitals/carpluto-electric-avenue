import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const WatermarkSettings = () => {
  const { toast } = useToast();
  const [enableWatermark, setEnableWatermark] = useState(false);
  const [watermarkUrl, setWatermarkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch watermark enable setting
      const { data: enableData } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'enable_watermark')
        .single();

      // Fetch watermark URL setting
      const { data: urlData } = await supabase
        .from('admin_text_settings')
        .select('setting_value')
        .eq('setting_key', 'watermark_url')
        .single();

      if (enableData) {
        setEnableWatermark(enableData.setting_value);
      }
      if (urlData) {
        setWatermarkUrl(urlData.setting_value);
      }
    } catch (error) {
      console.error('Error fetching watermark settings:', error);
    }
  };

  const handleWatermarkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `watermark-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(fileName);

      setWatermarkUrl(publicUrl);

      toast({
        title: "Success",
        description: "Watermark uploaded successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload watermark",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Update watermark enable setting
      await supabase
        .from('admin_settings')
        .upsert({
          setting_key: 'enable_watermark',
          setting_value: enableWatermark,
          description: 'Enable watermark on vehicle images'
        });

      // Update watermark URL setting
      await supabase
        .from('admin_text_settings')
        .upsert({
          setting_key: 'watermark_url',
          setting_value: watermarkUrl,
          description: 'URL of the watermark image file'
        });

      toast({
        title: "Success",
        description: "Watermark settings updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
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
          <Image className="h-5 w-5" />
          Watermark Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enable-watermark">Enable Watermark</Label>
            <p className="text-sm text-muted-foreground">
              Add watermark to all vehicle images
            </p>
          </div>
          <Switch
            id="enable-watermark"
            checked={enableWatermark}
            onCheckedChange={setEnableWatermark}
          />
        </div>

        {enableWatermark && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="watermark-upload">Upload Watermark Image</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  id="watermark-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleWatermarkUpload}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => document.getElementById('watermark-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>

            {watermarkUrl && (
              <div className="space-y-2">
                <Label>Current Watermark Preview</Label>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <img
                    src={watermarkUrl}
                    alt="Watermark preview"
                    className="max-h-20 object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={saveSettings}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};