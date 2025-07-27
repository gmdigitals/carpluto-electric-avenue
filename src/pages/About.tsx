import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Users, MapPin, Award, Shield, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-4">About CarPluto</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Driving Nigeria's <span className="text-primary">Electric Future</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Founded in 2024, CarPluto is Nigeria's premier electric vehicle marketplace, 
                committed to accelerating the adoption of sustainable transportation across Africa.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="p-8">
                <CardContent className="p-0">
                  <Zap className="h-12 w-12 text-primary mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground">
                    To make electric vehicles accessible, affordable, and attractive to every Nigerian, 
                    while building the infrastructure needed for a sustainable transportation ecosystem.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-8">
                <CardContent className="p-0">
                  <Heart className="h-12 w-12 text-primary mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground">
                    To be Africa's leading electric vehicle platform, transforming how people move 
                    while contributing to a cleaner, greener continent for future generations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">2024</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">The Beginning</h3>
                    <p className="text-muted-foreground">
                      CarPluto was founded with a simple belief: Nigerians deserve access to the best 
                      electric vehicles in the world. We started with a team of automotive enthusiasts 
                      and technology experts who saw the potential for EVs in Nigeria's growing market.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Building Partnerships</h3>
                    <p className="text-muted-foreground">
                      We established partnerships with leading global EV manufacturers including Tesla, 
                      BYD, and Hyundai, ensuring Nigerians have access to world-class electric vehicles 
                      with full warranty and support.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expanding Nationwide</h3>
                    <p className="text-muted-foreground">
                      Today, we serve customers across Nigeria with showrooms in Lagos, Abuja, and Port 
                      Harcourt, and plans to expand to all major Nigerian cities by 2025.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Numbers */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">EVs Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">EV Models</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">Charging Stations</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Trust & Transparency</h3>
                  <p className="text-muted-foreground">
                    We believe in honest pricing, clear communication, and building long-term 
                    relationships with our customers.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Quality Excellence</h3>
                  <p className="text-muted-foreground">
                    Every vehicle we sell meets the highest standards of quality, safety, 
                    and performance.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                  <p className="text-muted-foreground">
                    We continuously innovate to make EV ownership easier, more convenient, 
                    and more enjoyable for Nigerians.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">AO</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Adebayo Ogundimu</h3>
                  <p className="text-primary font-medium mb-2">CEO & Founder</p>
                  <p className="text-muted-foreground text-sm">
                    Former Tesla executive with 15+ years in automotive industry
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">KA</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Kemi Adebayo</h3>
                  <p className="text-primary font-medium mb-2">CTO</p>
                  <p className="text-muted-foreground text-sm">
                    Technology leader specializing in automotive software and EV infrastructure
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">TO</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Tunde Olatunji</h3>
                  <p className="text-primary font-medium mb-2">COO</p>
                  <p className="text-muted-foreground text-sm">
                    Operations expert with deep knowledge of Nigerian automotive market
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;