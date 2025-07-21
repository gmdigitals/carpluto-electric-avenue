import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference && !trxref) {
        setPaymentStatus('failed');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { reference: reference || trxref },
        });

        if (error) throw error;

        setPaymentStatus(data.status);
        setOrderDetails(data.order);

        if (data.status === 'success') {
          toast({
            title: "Payment Successful!",
            description: "Your order has been confirmed. You'll receive updates via email.",
          });
        } else {
          toast({
            title: "Payment Failed",
            description: "Your payment could not be processed. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failed');
        toast({
          title: "Verification Failed",
          description: "Unable to verify payment status. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, trxref, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {paymentStatus === 'success' ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          )}
          <CardTitle className="text-2xl">
            {paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {paymentStatus === 'success' && orderDetails ? (
            <div className="space-y-3">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <p className="text-sm text-muted-foreground">
                  Order Number: <span className="font-medium">{orderDetails.order_number}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Amount: <span className="font-medium">₦{orderDetails.total_amount?.toLocaleString()}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: <span className="font-medium text-green-600">Confirmed</span>
                </p>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>✅ Payment processed successfully</p>
                <p>✅ Order confirmation sent to your email</p>
                <p>✅ Our team will contact you for delivery arrangements</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Your payment could not be processed. Please try again or contact our support team.</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
            {paymentStatus === 'success' ? (
              <Button
                className="flex-1 bg-gradient-primary"
                onClick={() => navigate('/dashboard')}
              >
                View Orders
              </Button>
            ) : (
              <Button
                className="flex-1 bg-gradient-primary"
                onClick={() => navigate('/#vehicles')}
              >
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}