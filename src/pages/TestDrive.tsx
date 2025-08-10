import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DealershipLocationSelect } from '@/components/DealershipLocationSelect';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, Clock, MapPin, Car, DollarSign, 
  CheckCircle, AlertCircle, ArrowLeft 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  range_km: number;
  images: string[];
  features: string[];
  availability_status: string;
}

const TestDrive = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    preferred_date: '',
    preferred_time: '',
    pickup_location: '',
    driver_license_number: '',
    notes: ''
  });

  const carId = searchParams.get('car');

  useEffect(() => {
    if (carId) {
      fetchVehicle();
    }
  }, [carId]);

  const fetchVehicle = async () => {
    if (!carId) return;
    
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();

      if (error) throw error;
      setVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      toast({
        title: "Error",
        description: "Vehicle not found",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a test drive.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!carId || !vehicle) {
      toast({
        title: "Error",
        description: "Please select a vehicle first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('test_drives')
        .insert({
          user_id: user.id,
          car_id: carId,
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
          pickup_location: formData.pickup_location,
          driver_license_number: formData.driver_license_number,
          notes: formData.notes,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Test Drive Booked!",
        description: "Your test drive request has been submitted. We'll contact you within 24 hours to confirm.",
      });

      setFormData({
        preferred_date: '',
        preferred_time: '',
        pickup_location: '',
        driver_license_number: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error booking test drive:', error);
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => navigate('/')} className="hover:text-primary">Home</button>
            <span>/</span>
            <span className="text-foreground">Test Drive</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Test Drive <span className="text-primary">Experience</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Experience the future of driving with our exclusive 20-minute premium test drive service. 
              Feel the power of electric vehicles at our verified partnered dealers across Nigeria.
            </p>
            
            {/* Premium Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Premium Service</h3>
                <p className="text-sm text-muted-foreground text-center">Dedicated concierge service with complimentary refreshments</p>
              </div>
              
              
              <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Expert Guidance</h3>
                <p className="text-sm text-muted-foreground text-center">Professional EV specialists to guide your experience</p>
              </div>
            </div>

            {/* Pricing Card */}
            <Card className="max-w-md mx-auto mb-12 border-primary/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Premium Test Drive</CardTitle>
                <p className="text-muted-foreground">20-minute exclusive experience</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">₦50,000</div>
                <p className="text-sm text-muted-foreground mb-6">Per test drive session</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>20-minute premium experience</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Professional guidance</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Complimentary refreshments</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Full insurance coverage</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Showroom Locations */}
        <div className="container mx-auto px-6 py-16 bg-muted/30">
          <h2 className="text-3xl font-bold text-center mb-12">Our Premium Verified Dealership Locations</h2>
          <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Lagos Island
                </CardTitle>
                <p className="text-muted-foreground">Victoria Island, Lagos</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Climate-controlled environment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">VIP lounge with refreshments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Tesla & luxury EV specialists</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vehicle Selection & Booking Form */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Selected Vehicle */}
              {vehicle && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Selected Vehicle</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={vehicle.images[0] || "/placeholder.svg?height=100&width=150&text=No+Image"}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{vehicle.brand} {vehicle.model}</h3>
                          <p className="text-muted-foreground">{vehicle.year} Model</p>
                          <p className="text-lg font-semibold text-primary">{formatPrice(vehicle.price)}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Range: {vehicle.range_km}km</span>
                            <Badge variant="outline">{vehicle.availability_status}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Booking Form */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Book Your Test Drive</h2>
                  {!vehicle && (
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/vehicles')}
                      className="flex items-center gap-2"
                    >
                      <Car className="h-4 w-4" />
                      Select Vehicle
                    </Button>
                  )}
                </div>

                {!user && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/auth')}>sign in</Button> to book a test drive.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferred_date">Preferred Date *</Label>
                      <Input
                        type="date"
                        id="preferred_date"
                        value={formData.preferred_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferred_date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferred_time">Preferred Time *</Label>
                      <Input
                        type="time"
                        id="preferred_time"
                        value={formData.preferred_time}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferred_time: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pickup_location">Showroom Location *</Label>
                    <DealershipLocationSelect
                      value={formData.pickup_location}
                      onChange={(value) => setFormData(prev => ({ ...prev, pickup_location: value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="driver_license_number">Driver's License Number *</Label>
                    <Input
                      type="text"
                      id="driver_license_number"
                      value={formData.driver_license_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, driver_license_number: e.target.value }))}
                      placeholder="Enter your driver's license number"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Special Requests</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any special requests or requirements (optional)"
                    />
                  </div>

                  {/* Pricing Information */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Test Drive Fee</span>
                        </div>
                        <span className="text-2xl font-bold text-primary">₦50,000</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Payment will be processed upon confirmation of your booking.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/vehicles')}
                      className="flex-1"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Vehicles
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-primary"
                      disabled={loading || !user || !vehicle}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Booking...
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Test Drive
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TestDrive;