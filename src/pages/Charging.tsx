import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Clock, Search, DollarSign, Wifi, Coffee, ShoppingBag } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const Charging = () => {
  const [stations, setStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChargingStations();
  }, []);

  const fetchChargingStations = async () => {
    try {
      const { data, error } = await supabase
        .from('charging_stations')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      setStations(data || []);
    } catch (error) {
      console.error('Error fetching charging stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStations = stations.filter((station: any) =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'restaurant':
      case 'coffee':
        return <Coffee className="h-4 w-4" />;
      case 'shopping':
        return <ShoppingBag className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              EV Charging <span className="text-primary">Network</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover Nigeria's fastest-growing electric vehicle charging network. Fast, reliable, 
              and conveniently located charging stations across major cities.
            </p>
            
            {/* Search */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by location or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-6 py-8 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stations.length}+</div>
              <p className="text-muted-foreground">Charging Stations</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">150kW</div>
              <p className="text-muted-foreground">Fast Charging Speed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Availability</p>
            </div>
          </div>
        </div>

        {/* Charging Stations List */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">Available Charging Stations</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading charging stations...</p>
            </div>
          ) : filteredStations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No charging stations found for your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStations.map((station: any) => (
                <Card key={station.id} className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      {station.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {station.address}, {station.city}, {station.state}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Power and Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-primary">{station.power_output || 'Fast'}</div>
                        <div className="text-sm text-muted-foreground">Charging Speed</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-primary flex items-center justify-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {station.pricing_per_kwh ? `₦${station.pricing_per_kwh}/kWh` : 'Contact'}
                        </div>
                        <div className="text-sm text-muted-foreground">Pricing</div>
                      </div>
                    </div>

                    {/* Connector Types */}
                    {station.connector_types && station.connector_types.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Connector Types:</p>
                        <div className="flex flex-wrap gap-1">
                          {station.connector_types.map((type: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Operating Hours */}
                    {station.operating_hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{station.operating_hours}</span>
                      </div>
                    )}

                    {/* Amenities */}
                    {station.amenities && station.amenities.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Amenities:</p>
                        <div className="flex flex-wrap gap-2">
                          {station.amenities.map((amenity: string, index: number) => (
                            <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div className="pt-2 border-t">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {station.status === 'active' ? 'Available' : station.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <div className="container mx-auto px-6 py-16 bg-muted/30">
          <h2 className="text-3xl font-bold text-center mb-12">How EV Charging Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Find a Station</h3>
              <p className="text-muted-foreground">
                Use our app or website to locate the nearest charging station with real-time availability.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect & Charge</h3>
              <p className="text-muted-foreground">
                Simply plug in your vehicle using the appropriate connector and start charging immediately.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Pay & Go</h3>
              <p className="text-muted-foreground">
                Pay securely through our app or contactless payment and be on your way.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Charging;