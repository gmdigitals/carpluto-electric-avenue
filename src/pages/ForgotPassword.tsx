import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) throw error;

      setIsEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "Check your email for a password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="/lovable-uploads/80acdd1a-fb67-4940-ba3e-f5696cf1959c.png" 
              alt="CARPLUTO Logo" 
              className="h-8 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CARPLUTO
          </h1>
          <p className="text-muted-foreground">Nigeria's Trusted EV Marketplace</p>
        </div>

        <Card className="backdrop-blur-sm bg-background/80 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Mail className="h-5 w-5" />
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isEmailSent ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail('');
                  }}
                  className="w-full"
                >
                  Send Another Email
                </Button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Link 
                to="/auth" 
                className="text-sm text-primary hover:underline flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}