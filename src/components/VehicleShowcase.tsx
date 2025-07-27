import { useState, useEffect } from 'react';
import { Car, Zap, Battery, Gauge, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PurchaseModal } from '@/components/PurchaseModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const filterOptions = [
  { label: "All Vehicles", value: "all" },
  { label: "Tesla", value: "Tesla" },
  { label: "BYD", value: "BYD" },
  { label: "Hyundai", value: "Hyundai" },
  { label: "Nissan", value: "Nissan" },
  { label: "Under ₦20M", value: "budget" }
];

interface Vehicle {
  id: string;
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

export function VehicleShowcase() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [likedVehicles, setLikedVehicles] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('availability_status', 'available')
        .limit(6);
      
      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (vehicleId: string) => {
    setLikedVehicles(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (activeFilter === "all") return true;
    if (activeFilter === "budget") return vehicle.price < 20000000;
    return vehicle.brand === activeFilter;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleTestDrive = (vehicleId: string) => {
    navigate(`/test-drive?car=${vehicleId}`);
  };

  const handleVehicleClick = (vehicleId: string) => {
    navigate(`/vehicle/${vehicleId}`);
  };

  const handleViewAllVehicles = () => {
    navigate('/vehicles');
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30" id="vehicles">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading vehicles...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30" id="vehicles">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Electric Vehicle Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover premium electric vehicles designed for Nigerian roads. 
            From city commuters to luxury performance cars.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(option.value)}
              className={`transition-all duration-300 ${
                activeFilter === option.value 
                  ? 'bg-gradient-primary shadow-electric' 
                  : 'hover:border-primary'
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle, index) => (
            <Card 
              key={vehicle.id} 
              className="group overflow-hidden bg-gradient-card hover:shadow-electric transition-all duration-500 border-border/50 hover:border-primary/30 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleVehicleClick(vehicle.id)}
            >
              <CardHeader className="p-0 relative">
                {/* Vehicle Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={vehicle.images[0] || "/placeholder.svg?height=300&width=400&text=No+Image"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {vehicle.is_featured && (
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                    )}
                    <Badge variant="secondary">{vehicle.availability_status}</Badge>
                  </div>

                  {/* Like Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(vehicle.id);
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 transition-colors ${
                        likedVehicles.includes(vehicle.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Vehicle Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground">{vehicle.brand} {vehicle.model}</h3>
                    <span className="text-sm text-muted-foreground">{vehicle.year}</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatPrice(vehicle.price)}</p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    <span className="text-sm">{vehicle.range_km}km</span>
                  </div>
                  {vehicle.battery_capacity && (
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4 text-primary" />
                      <span className="text-sm">{vehicle.battery_capacity}kWh</span>
                    </div>
                  )}
                  {vehicle.charging_time_hours && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      <span className="text-sm">{vehicle.charging_time_hours}h</span>
                    </div>
                  )}
                  {vehicle.acceleration_0_100 && (
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-accent" />
                      <span className="text-sm">0-100: {vehicle.acceleration_0_100}s</span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex gap-2">
                <PurchaseModal vehicle={{
                  id: vehicle.id,
                  brand: vehicle.brand,
                  model: vehicle.model,
                  price: vehicle.price
                }}>
                  <Button 
                    className="flex-1 bg-gradient-primary hover:shadow-electric transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Buy Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </PurchaseModal>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTestDrive(vehicle.id);
                  }}
                >
                  Test Drive
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleViewAllVehicles}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View All Vehicles
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}