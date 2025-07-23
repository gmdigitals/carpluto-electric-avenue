import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calculator, CreditCard, Shield, TrendingDown, Clock, HandHeart } from 'lucide-react';

const Finance = () => {
  const financingPlans = [
    {
      name: "EV Starter Plan",
      description: "Perfect for first-time EV buyers",
      downPayment: "20%",
      tenure: "36 months",
      interestRate: "9.5%",
      features: [
        "Low down payment",
        "Flexible monthly payments",
        "Insurance included",
        "Battery warranty coverage"
      ],
      ideal: "Budget-conscious buyers"
    },
    {
      name: "Premium Flex Plan",
      description: "Maximum flexibility with competitive rates",
      downPayment: "15%",
      tenure: "48 months",
      interestRate: "8.5%",
      features: [
        "Extended payment terms",
        "Rate protection guarantee",
        "Upgrade options available",
        "Comprehensive maintenance package"
      ],
      ideal: "Long-term ownership",
      popular: true
    },
    {
      name: "Executive Plan",
      description: "Premium financing for luxury EVs",
      downPayment: "10%",
      tenure: "60 months",
      interestRate: "7.5%",
      features: [
        "Lowest down payment",
        "Premium customer service",
        "Concierge maintenance",
        "Vehicle upgrade program"
      ],
      ideal: "Luxury EV buyers"
    }
  ];

  const benefits = [
    {
      icon: <TrendingDown className="h-8 w-8 text-primary" />,
      title: "Lower Fuel Costs",
      description: "Save up to 80% on fuel costs compared to traditional vehicles"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Government Incentives",
      description: "Eligible for federal and state tax incentives and rebates"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Reduced Maintenance",
      description: "EVs require 40% less maintenance than traditional vehicles"
    },
    {
      icon: <HandHeart className="h-8 w-8 text-primary" />,
      title: "Environmental Impact",
      description: "Zero emissions driving for a cleaner environment"
    }
  ];

  const lendingPartners = [
    {
      name: "FirstBank Nigeria",
      logo: "🏦",
      specialFeatures: ["Digital-first approval", "Competitive rates", "Quick processing"]
    },
    {
      name: "GTBank",
      logo: "🏛️",
      specialFeatures: ["Flexible terms", "Premium service", "EV expertise"]
    },
    {
      name: "Zenith Bank",
      logo: "🏢",
      specialFeatures: ["Low interest rates", "Extended tenure", "Online application"]
    },
    {
      name: "Access Bank",
      logo: "🏪",
      specialFeatures: ["Fast approval", "Minimal documentation", "Customer support"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              EV Financing <span className="text-primary">Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Affordable financing options to make your electric vehicle dreams a reality. 
              Partner with Nigeria's leading banks for competitive rates and flexible terms.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="px-8">
                <Calculator className="h-5 w-5 mr-2" />
                Calculate Payment
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                <CreditCard className="h-5 w-5 mr-2" />
                Apply Now
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="container mx-auto px-6 py-16 bg-muted/30">
          <h2 className="text-3xl font-bold text-center mb-12">Why Finance an Electric Vehicle?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Financing Plans */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Financing Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {financingPlans.map((plan, index) => (
              <Card key={index} className={`h-full ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    {plan.popular && (
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-bold text-primary">{plan.downPayment}</div>
                      <div className="text-xs text-muted-foreground">Down Payment</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-bold text-primary">{plan.tenure}</div>
                      <div className="text-xs text-muted-foreground">Tenure</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-bold text-primary">{plan.interestRate}</div>
                      <div className="text-xs text-muted-foreground">Interest Rate</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3">Plan Features:</h4>
                    <div className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ideal For */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Ideal for:</span> {plan.ideal}
                    </p>
                  </div>

                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    Select This Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Lending Partners */}
        <div className="container mx-auto px-6 py-16 bg-muted/30">
          <h2 className="text-3xl font-bold text-center mb-12">Our Trusted Lending Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lendingPartners.map((partner, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <div className="text-4xl mb-2">{partner.logo}</div>
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {partner.specialFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Choose Your Vehicle</h3>
              <p className="text-muted-foreground text-sm">
                Browse our EV collection and select your preferred vehicle and financing plan.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Submit Application</h3>
              <p className="text-muted-foreground text-sm">
                Complete our simple online application with basic financial information.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Get Approved</h3>
              <p className="text-muted-foreground text-sm">
                Receive approval decision within 24-48 hours from our banking partners.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Drive Away</h3>
              <p className="text-muted-foreground text-sm">
                Complete documentation and drive away in your new electric vehicle.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 py-16 bg-primary/5 rounded-lg mx-6 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Finance Your EV?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get pre-approved in minutes and start your journey to cleaner, more efficient driving today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="px-8">
                Get Pre-Approved
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Speak to an Expert
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Finance;