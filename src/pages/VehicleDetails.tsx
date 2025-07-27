import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PurchaseModal } from '@/components/PurchaseModal';
import { 
  Car, Zap, Battery, Gauge, Heart, ArrowRight, ArrowLeft,
  Shield, Star, MapPin, Calendar, Clock, Phone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Vehicle {
  id: string;
  name?: string;
  type?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  range_km: number;
  battery_capacity?: number;
  charging_time_hours?: number;
  exterior_color?: string;
  interior_color?: string;
  top_speed?: number;
  acceleration_0_100?: number;
  images: string[];
  features: string[];
  specifications: any;
  availability_status: string;
  is_featured: boolean;
}

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
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
      navigate('/vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleTestDrive = () => {
    navigate(`/test-drive?car=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading vehicle details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Vehicle Not Found</h1>
            <Button onClick={() => navigate('/vehicles')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            <button onClick={() => navigate('/vehicles')} className="hover:text-primary">Vehicles</button>
            <span>/</span>
            <span className="text-foreground">{vehicle.brand} {vehicle.model}</span>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={vehicle.images[currentImageIndex] || "/placeholder.svg?height=500&width=600&text=No+Image"}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart 
                    className={`h-4 w-4 transition-colors ${
                      isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                    }`} 
                  />
                </Button>
                {vehicle.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                      disabled={currentImageIndex === 0}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() => setCurrentImageIndex(Math.min(vehicle.images.length - 1, currentImageIndex + 1))}
                      disabled={currentImageIndex === vehicle.images.length - 1}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {vehicle.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {vehicle.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg?height=80&width=80&text=No+Image"}
                      alt={`${vehicle.brand} ${vehicle.model} - ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer transition-all ${
                        index === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {vehicle.is_featured && <Badge>Featured</Badge>}
                  <Badge variant="outline">{vehicle.availability_status}</Badge>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="text-muted-foreground">{vehicle.year} Model</p>
                <p className="text-3xl font-bold text-primary mt-2">
                  {formatPrice(vehicle.price)}
                </p>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Range</p>
                    <p className="font-semibold">{vehicle.range_km}km</p>
                  </div>
                </div>
                {vehicle.battery_capacity && (
                  <div className="flex items-center gap-2">
                    <Battery className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Battery</p>
                      <p className="font-semibold">{vehicle.battery_capacity}kWh</p>
                    </div>
                  </div>
                )}
                {vehicle.charging_time_hours && (
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Charging</p>
                      <p className="font-semibold">{vehicle.charging_time_hours}h</p>
                    </div>
                  </div>
                )}
                {vehicle.acceleration_0_100 && (
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">0-100km/h</p>
                      <p className="font-semibold">{vehicle.acceleration_0_100}s</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <PurchaseModal vehicle={vehicle}>
                  <Button size="lg" className="flex-1 bg-gradient-primary hover:shadow-electric">
                    Buy Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </PurchaseModal>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleTestDrive}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Test Drive
                </Button>
              </div>

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Key Features</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {vehicle.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Colors */}
              <div className="flex gap-6">
                {vehicle.exterior_color && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Exterior</p>
                    <p className="font-semibold">{vehicle.exterior_color}</p>
                  </div>
                )}
                {vehicle.interior_color && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Interior</p>
                    <p className="font-semibold">{vehicle.interior_color}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="financing">Financing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-4">Performance</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Range</span>
                            <span>{vehicle.range_km}km</span>
                          </div>
                          {vehicle.top_speed && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Top Speed</span>
                              <span>{vehicle.top_speed}km/h</span>
                            </div>
                          )}
                          {vehicle.acceleration_0_100 && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">0-100km/h</span>
                              <span>{vehicle.acceleration_0_100}s</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-4">Battery & Charging</h3>
                        <div className="space-y-3">
                          {vehicle.battery_capacity && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Battery Capacity</span>
                              <span>{vehicle.battery_capacity}kWh</span>
                            </div>
                          )}
                          {vehicle.charging_time_hours && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Charging Time</span>
                              <span>{vehicle.charging_time_hours}h</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehicle.features && vehicle.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="financing" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Financing Options</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-2">Bank Financing</h4>
                            <p className="text-sm text-muted-foreground">Get up to 85% financing with competitive rates from our partner banks.</p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-2">Lease Options</h4>
                            <p className="text-sm text-muted-foreground">Flexible lease terms with maintenance packages included.</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-semibold mb-2">Need Help with Financing?</h4>
                        <p className="text-muted-foreground mb-4">Our finance team can help you find the best payment option.</p>
                        <Button variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact Finance Team
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleDetails;