import { Construction, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MaintenanceMode = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">We're Upgrading!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            CARPLUTO is currently undergoing maintenance to bring you an even better EV marketplace experience.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>We'll be back soon</span>
          </div>
          
          <div className="pt-4">
            <Button asChild className="w-full">
              <a href="mailto:support@carpluto.com.ng" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Support
              </a>
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <img 
              src="/lovable-uploads/80acdd1a-fb67-4940-ba3e-f5696cf1959c.png" 
              alt="CARPLUTO Logo" 
              className="h-8 w-auto mx-auto opacity-50"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceMode;