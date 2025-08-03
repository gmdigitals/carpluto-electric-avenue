import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Heart, Shield, Award, CheckCircle, TrendingUp, Users, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-4">About CARPLUTO</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Nigeria's Premier <span className="text-primary">EV Marketplace</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                We are revolutionizing Nigeria's transition to electric mobility by building the nation's most trusted EV-only marketplace.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <Card className="p-8 max-w-4xl mx-auto">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At CARPLUTO, we are revolutionizing Nigeria's transition to electric mobility by building the nation's most trusted <strong>EV-only marketplace</strong>. We connect discerning buyers with verified sellers, offering a curated selection of new and used electric vehicles—all designed to make the shift from fuel to electric seamless, affordable, and empowering.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Who We Are</h2>
              <Card className="p-8">
                <CardContent className="p-0">
                  <p className="text-lg text-muted-foreground mb-6">
                    CARPLUTO is not a dealership; we are a <strong>solutions platform</strong>. By aggregating listings from our network of certified Nigerian dealers and private sellers, we provide:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                      <p className="text-muted-foreground">Detailed vehicle descriptions, 10+ high-resolution images, and verified battery health reports.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Affordability</h3>
                      <p className="text-muted-foreground">Competitive pricing with financing options tailored to Nigerian budgets.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Intelligent Discovery</h3>
                      <p className="text-muted-foreground">AI-driven recommendations and advanced filters (range, price, charging speed).</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why We Exist */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why We Exist</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <Users className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-4">For Buyers</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Escape fuel dependency with EVs that slash monthly costs by up to 70%.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Access Nigeria's largest inventory of Tesla, BYD, and other leading EVs—all in one place.</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="p-6">
                  <CardContent className="p-0">
                    <Award className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-4">For Sellers</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Tap into a targeted audience of EV enthusiasts.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Leverage our marketing tools to maximize listing visibility.</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="p-6">
                  <CardContent className="p-0">
                    <Globe className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-4">For Nigeria</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Support the government's 2030 Green Energy Agenda by accelerating EV adoption.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Reduce carbon emissions and fuel imports through accessible electric mobility.</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Key Numbers */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">EVs Listed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">₦2B+</div>
                <div className="text-muted-foreground">Transactions Facilitated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">EV Models</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">99%</div>
                <div className="text-muted-foreground">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Our Commitment</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6">
                  <CardContent className="p-0 text-center">
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-4">Trust</h3>
                    <p className="text-muted-foreground">
                      Every listing undergoes rigorous verification (battery diagnostics, accident history).
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="p-6">
                  <CardContent className="p-0 text-center">
                    <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                    <p className="text-muted-foreground">
                      Tools like range calculators and charging station maps simplify EV ownership.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="p-6">
                  <CardContent className="p-0 text-center">
                    <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-4">Customer-Centricity</h3>
                    <p className="text-muted-foreground">
                      Dedicated support via WhatsApp, 7 days a week at 09021475523.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;