import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Loader2 } from 'lucide-react';

interface Vehicle {
  id: number;
  name: string;
  price: string;
  brand: string;
  type: string;
}

interface PurchaseModalProps {
  vehicle: Vehicle;
  children: React.ReactNode;
}

export function PurchaseModal({ vehicle, children }: PurchaseModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const priceInNaira = parseInt(vehicle.price.replace(/[₦,]/g, ''));

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a purchase.",
        variant: "destructive",
      });
      return;
    }

    if (!deliveryAddress.trim()) {
      toast({
        title: "Delivery Address Required",
        description: "Please enter your delivery address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create order in database first
      const orderNumber = `EV-${Date.now()}`;
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          car_id: null, // Will be updated when cars are properly linked
          order_number: orderNumber,
          total_amount: priceInNaira,
          delivery_address: deliveryAddress,
          delivery_date: deliveryDate || null,
          status: 'pending',
          payment_status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Initialize Paystack payment
      console.log('Calling create-payment with:', {
        amount: priceInNaira * 100,
        email: user.email,
        orderId: orderData.id,
        orderNumber: orderNumber,
        vehicleName: vehicle.name,
      });

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: priceInNaira * 100, // Paystack expects amount in kobo
          email: user.email,
          orderId: orderData.id,
          orderNumber: orderNumber,
          vehicleName: vehicle.name,
          metadata: {
            vehicle_id: vehicle.id,
            vehicle_name: vehicle.name,
            delivery_address: deliveryAddress,
            notes: notes,
          },
        },
      });

      console.log('create-payment response:', { data, error });

      if (error) throw error;

      // Redirect to Paystack checkout
      if (data.authorization_url) {
        window.open(data.authorization_url, '_blank');
        setOpen(false);
        
        toast({
          title: "Payment Initiated",
          description: "You've been redirected to Paystack to complete your payment.",
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase {vehicle.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Vehicle Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{vehicle.name}</h3>
            <p className="text-muted-foreground">{vehicle.brand} • {vehicle.type}</p>
            <p className="text-2xl font-bold text-primary mt-2">{vehicle.price}</p>
          </div>

          {/* Delivery Details */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="delivery-address">Delivery Address *</Label>
              <Textarea
                id="delivery-address"
                placeholder="Enter your complete delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="delivery-date">Preferred Delivery Date</Label>
              <Input
                id="delivery-date"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="mt-1"
                min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="notes">Special Instructions</Label>
              <Textarea
                id="notes"
                placeholder="Any special delivery instructions (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              You'll be redirected to Paystack to complete your payment securely.
            </p>
            <p className="font-semibold">
              Total Amount: <span className="text-primary">{vehicle.price}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-primary"
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Buy Now'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}