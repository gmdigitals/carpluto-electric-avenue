import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Shield, Star, Car, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const TestDrive = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    car_id: '',
    preferred_date: '',
    preferred_time: '',
    pickup_location: '',
    driver_license_number: '',
    notes: ''
  });

  const testDriveLocations = [
    {
      name: "CARPLUTO Lagos Showroom",
      address: "Victoria Island, Lagos",
      features: ["Premium Lounge", "Coffee Bar", "VIP Service"]
    },
    {
      name: "CARPLUTO Abuja Hub", 
      address: "Central Business District, Abuja",
      features: ["Executive Lounge", "Tech Demo Area", "Concierge Service"]
    },
    {
      name: "CARPLUTO Port Harcourt Center",
      address: "GRA Phase 2, Port Harcourt",
      features: ["Comfort Lounge", "Refreshments", "Expert Consultation"]
    }
  ];

  const availableCars = [
    { id: 1, name: "Tesla Model S Plaid", price: "₦85,000,000" },
    { id: 2, name: "Tesla Model Y Performance", price: "₦45,000,000" },
    { id: 3, name: "BYD Tang DM-i", price: "₦32,000,000" },
    { id: 4, name: "Tesla Model X", price: "₦95,000,000" },
    { id: 5, name: "BYD Seal Premium", price: "₦28,000,000" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a test drive",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('test_drives')
        .insert({
          user_id: user.id,
          car_id: formData.car_id,
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
          pickup_location: formData.pickup_location,
          driver_license_number: formData.driver_license_number,
          notes: formData.notes
        });

      if (error) throw error;

      toast({
        title: "Test Drive Booked!",
        description: "Your premium test drive has been scheduled. We'll contact you within 24 hours to confirm.",
      });

      setFormData({
        car_id: '',
        preferred_date: '',
        preferred_time: '',
        pickup_location: '',
        driver_license_number: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your test drive. Please try again.",
        variant: "destructive",
      });
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
              Premium Test Drive <span className="text-primary">Experience</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Experience the future of driving with our exclusive 3-minute premium test drive service. 
              Feel the power of electric vehicles at our partnered showrooms across Nigeria.
            </p>
            
            {/* Premium Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Premium Service</h3>
                <p className="text-sm text-muted-foreground text-center">Dedicated concierge service with complimentary refreshments</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fully Insured</h3>
                <p className="text-sm text-muted-foreground text-center">Comprehensive insurance coverage during your test drive</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
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
                <CardDescription>3-minute exclusive experience</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">₦50,000</div>
                <p className="text-sm text-muted-foreground mb-6">Per test drive session</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>3-minute premium experience</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Professional guidance</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Complimentary refreshments</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Full insurance coverage</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Showroom Locations */}
        <div className="container mx-auto px-6 py-16 bg-muted/30">
          <h2 className="text-3xl font-bold text-center mb-12">Our Premium Showroom Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testDriveLocations.map((location, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {location.name}
                  </CardTitle>
                  <CardDescription>{location.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {location.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Book Your Premium Test Drive</CardTitle>
                <CardDescription className="text-center">
                  Fill out the form below to schedule your exclusive EV experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="car_id">Select Vehicle</Label>
                    <Select onValueChange={(value) => setFormData({...formData, car_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your preferred vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCars.map((car) => (
                          <SelectItem key={car.id} value={car.id.toString()}>
                            {car.name} - {car.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferred_date">Preferred Date</Label>
                      <Input
                        id="preferred_date"
                        type="date"
                        value={formData.preferred_date}
                        onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferred_time">Preferred Time</Label>
                      <Input
                        id="preferred_time"
                        type="time"
                        value={formData.preferred_time}
                        onChange={(e) => setFormData({...formData, preferred_time: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pickup_location">Showroom Location</Label>
                    <Select onValueChange={(value) => setFormData({...formData, pickup_location: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select showroom location" />
                      </SelectTrigger>
                      <SelectContent>
                        {testDriveLocations.map((location, index) => (
                          <SelectItem key={index} value={location.name}>
                            {location.name} - {location.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="driver_license_number">Driver's License Number</Label>
                    <Input
                      id="driver_license_number"
                      value={formData.driver_license_number}
                      onChange={(e) => setFormData({...formData, driver_license_number: e.target.value})}
                      placeholder="Enter your driver's license number"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Any special requests or questions?"
                      rows={3}
                    />
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/30">
                    <h4 className="font-semibold mb-2">Booking Summary</h4>
                    <div className="space-y-1 text-sm">
                      <p>Service: Premium Test Drive (3 minutes)</p>
                      <p>Cost: ₦50,000</p>
                      <p>Includes: Insurance, refreshments, expert guidance</p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Book Premium Test Drive - ₦50,000
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TestDrive;