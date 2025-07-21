import { useState } from 'react';
import { Car, Zap, Battery, Gauge, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PurchaseModal } from '@/components/PurchaseModal';

const vehicles = [
  {
    id: 1,
    name: "Tesla Model 3",
    brand: "Tesla",
    type: "Sedan",
    price: "₦18,500,000",
    image: "/placeholder.svg?height=300&width=400&text=Tesla+Model+3",
    range: "500km",
    power: "350kW",
    charging: "30min",
    acceleration: "3.1s",
    badges: ["Best Seller", "Fast Charging"],
    isNew: true
  },
  {
    id: 2,
    name: "BYD Atto 3",
    brand: "BYD",
    type: "SUV",
    price: "₦12,800,000",
    image: "/placeholder.svg?height=300&width=400&text=BYD+Atto+3",
    range: "420km",
    power: "150kW",
    charging: "45min",
    acceleration: "7.3s",
    badges: ["Value Pick", "Family SUV"],
    isNew: false
  },
  {
    id: 3,
    name: "Tesla Model Y",
    brand: "Tesla",
    type: "SUV",
    price: "₦22,800,000",
    image: "/placeholder.svg?height=300&width=400&text=Tesla+Model+Y",
    range: "525km",
    power: "350kW",
    charging: "27min",
    acceleration: "3.5s",
    badges: ["Premium", "Autopilot"],
    isNew: true
  },
  {
    id: 4,
    name: "BYD Dolphin",
    brand: "BYD",
    type: "Hatchback",
    price: "₦8,500,000",
    image: "/placeholder.svg?height=300&width=400&text=BYD+Dolphin",
    range: "340km",
    power: "70kW",
    charging: "30min",
    acceleration: "10.9s",
    badges: ["Compact", "City Car"],
    isNew: false
  },
  {
    id: 5,
    name: "Tesla Model S",
    brand: "Tesla",
    type: "Luxury Sedan",
    price: "₦35,200,000",
    image: "/placeholder.svg?height=300&width=400&text=Tesla+Model+S",
    range: "650km",
    power: "750kW",
    charging: "25min",
    acceleration: "1.9s",
    badges: ["Plaid", "Luxury"],
    isNew: true
  },
  {
    id: 6,
    name: "BYD Tang",
    brand: "BYD",
    type: "Large SUV",
    price: "₦16,800,000",
    image: "/placeholder.svg?height=300&width=400&text=BYD+Tang",
    range: "500km",
    power: "380kW",
    charging: "40min",
    acceleration: "4.4s",
    badges: ["7-Seater", "AWD"],
    isNew: false
  }
];

const filterOptions = [
  { label: "All Vehicles", value: "all" },
  { label: "Tesla", value: "Tesla" },
  { label: "BYD", value: "BYD" },
  { label: "Sedan", value: "Sedan" },
  { label: "SUV", value: "SUV" },
  { label: "Under ₦15M", value: "budget" }
];

export function VehicleShowcase() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [likedVehicles, setLikedVehicles] = useState<number[]>([]);

  const toggleLike = (vehicleId: number) => {
    setLikedVehicles(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (activeFilter === "all") return true;
    if (activeFilter === "budget") return parseInt(vehicle.price.replace(/[₦,]/g, '')) < 15000000;
    return vehicle.brand === activeFilter || vehicle.type === activeFilter;
  });

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
              className="group overflow-hidden bg-gradient-card hover:shadow-electric transition-all duration-500 border-border/50 hover:border-primary/30"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="p-0 relative">
                {/* Vehicle Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {vehicle.isNew && (
                      <Badge className="bg-primary text-primary-foreground">New</Badge>
                    )}
                    {vehicle.badges.slice(0, 1).map((badge) => (
                      <Badge key={badge} variant="secondary">{badge}</Badge>
                    ))}
                  </div>

                  {/* Like Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={() => toggleLike(vehicle.id)}
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
                    <h3 className="text-xl font-bold text-foreground">{vehicle.name}</h3>
                    <span className="text-sm text-muted-foreground">{vehicle.type}</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{vehicle.price}</p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    <span className="text-sm">{vehicle.range}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="text-sm">{vehicle.power}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-primary" />
                    <span className="text-sm">{vehicle.charging}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-accent" />
                    <span className="text-sm">0-100: {vehicle.acceleration}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex gap-2">
                <PurchaseModal vehicle={vehicle}>
                  <Button className="flex-1 bg-gradient-primary hover:shadow-electric transition-all duration-300">
                    Buy Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </PurchaseModal>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
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