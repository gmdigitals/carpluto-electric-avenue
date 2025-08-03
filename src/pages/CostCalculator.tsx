import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Fuel, Zap, TrendingDown, Leaf, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function CostCalculator() {
  const [distance, setDistance] = useState(50);
  const [petrolPrice, setPetrolPrice] = useState(1037.66);
  const [gridTariff, setGridTariff] = useState(209.5);
  const [solarTariff, setSolarTariff] = useState(45.75);
  const [carEfficiency, setCarEfficiency] = useState(8);
  const [evEfficiency, setEvEfficiency] = useState(15);
  const [chargingType, setChargingType] = useState('grid');

  const calculateCosts = () => {
    const petrolDaily = (distance / 100) * carEfficiency * petrolPrice;
    const evGridDaily = (distance / 100) * evEfficiency * gridTariff;
    const evSolarDaily = (distance / 100) * evEfficiency * solarTariff;
    
    const evDaily = chargingType === 'solar' ? evSolarDaily : evGridDaily;
    
    return {
      petrol: {
        daily: petrolDaily,
        weekly: petrolDaily * 7,
        monthly: petrolDaily * 30,
        yearly: petrolDaily * 365
      },
      ev: {
        daily: evDaily,
        weekly: evDaily * 7,
        monthly: evDaily * 30,
        yearly: evDaily * 365
      },
      savings: {
        daily: petrolDaily - evDaily,
        weekly: (petrolDaily - evDaily) * 7,
        monthly: (petrolDaily - evDaily) * 30,
        yearly: (petrolDaily - evDaily) * 365
      }
    };
  };

  const costs = calculateCosts();

  const comparisonData = [
    { name: 'Daily', petrol: costs.petrol.daily, ev: costs.ev.daily },
    { name: 'Weekly', petrol: costs.petrol.weekly, ev: costs.ev.weekly },
    { name: 'Monthly', petrol: costs.petrol.monthly, ev: costs.ev.monthly },
    { name: 'Yearly', petrol: costs.petrol.yearly, ev: costs.ev.yearly }
  ];

  const pieData = [
    { name: 'Petrol Car', value: costs.petrol.yearly, color: '#E82127' },
    { name: 'EV Car', value: costs.ev.yearly, color: '#0F4DAD' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-background via-background to-primary/10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Calculator className="h-8 w-8 text-primary" />
                <h1 className="text-4xl lg:text-5xl font-bold">
                  Nigeria Fuel vs EV Cost Calculator
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8">
                Compare real-time fuel costs with electric vehicle expenses using 2025 Nigeria data
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4" />
                  <span>Petrol: ₦{petrolPrice}/L</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Grid: ₦{gridTariff}/kWh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  <span>Solar: ₦{solarTariff}/kWh</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculator Settings
                  </CardTitle>
                  <CardDescription>
                    Adjust parameters to match your usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Daily Distance (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(Number(e.target.value))}
                      min="1"
                      max="500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="charging">Charging Type</Label>
                    <Select value={chargingType} onValueChange={setChargingType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid Electricity</SelectItem>
                        <SelectItem value="solar">Solar Minigrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="petrol-price">Petrol Price (₦/L)</Label>
                      <Input
                        id="petrol-price"
                        type="number"
                        step="0.01"
                        value={petrolPrice}
                        onChange={(e) => setPetrolPrice(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="electricity-price">
                        {chargingType === 'solar' ? 'Solar' : 'Grid'} Price (₦/kWh)
                      </Label>
                      <Input
                        id="electricity-price"
                        type="number"
                        step="0.01"
                        value={chargingType === 'solar' ? solarTariff : gridTariff}
                        onChange={(e) => {
                          if (chargingType === 'solar') {
                            setSolarTariff(Number(e.target.value));
                          } else {
                            setGridTariff(Number(e.target.value));
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="car-efficiency">Car Efficiency (L/100km)</Label>
                      <Input
                        id="car-efficiency"
                        type="number"
                        step="0.1"
                        value={carEfficiency}
                        onChange={(e) => setCarEfficiency(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ev-efficiency">EV Efficiency (kWh/100km)</Label>
                      <Input
                        id="ev-efficiency"
                        type="number"
                        step="0.1"
                        value={evEfficiency}
                        onChange={(e) => setEvEfficiency(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Panel */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cost Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="text-center p-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Fuel className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">Petrol Car</h3>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(costs.petrol.daily)}
                    </div>
                    <p className="text-sm text-muted-foreground">per day</p>
                  </Card>

                  <Card className="text-center p-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold">EV Car</h3>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(costs.ev.daily)}
                    </div>
                    <p className="text-sm text-muted-foreground">per day</p>
                  </Card>

                  <Card className="text-center p-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold">Daily Savings</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(costs.savings.daily)}
                    </div>
                    <p className="text-sm text-muted-foreground">with EV</p>
                  </Card>
                </div>

                {/* Detailed Analysis */}
                <Tabs defaultValue="comparison" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="comparison">Cost Comparison</TabsTrigger>
                    <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
                    <TabsTrigger value="savings">Savings Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="comparison">
                    <Card>
                      <CardHeader>
                        <CardTitle>Annual Cost Comparison</CardTitle>
                        <CardDescription>
                          Compare yearly running costs between petrol and electric vehicles
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `₦${(value/1000).toFixed(0)}k`} />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Bar dataKey="petrol" fill="#E82127" name="Petrol Car" />
                            <Bar dataKey="ev" fill="#0F4DAD" name="EV Car" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="breakdown">
                    <Card>
                      <CardHeader>
                        <CardTitle>Annual Cost Breakdown</CardTitle>
                        <CardDescription>
                          Visual representation of yearly expenses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="savings">
                    <Card>
                      <CardHeader>
                        <CardTitle>Potential Savings with EV</CardTitle>
                        <CardDescription>
                          How much you could save by switching to electric
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(costs.savings.daily)}
                            </div>
                            <p className="text-sm text-muted-foreground">Daily</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(costs.savings.weekly)}
                            </div>
                            <p className="text-sm text-muted-foreground">Weekly</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(costs.savings.monthly)}
                            </div>
                            <p className="text-sm text-muted-foreground">Monthly</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(costs.savings.yearly)}
                            </div>
                            <p className="text-sm text-muted-foreground">Yearly</p>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                          <h4 className="font-semibold mb-2">Key Insights:</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• EVs are {Math.round(costs.petrol.yearly / costs.ev.yearly)}x cheaper to run than petrol cars in Nigeria</li>
                            <li>• {chargingType === 'solar' ? 'Solar minigrids' : 'Grid charging'} maximizes your savings</li>
                            <li>• Break-even point: EV upfront costs offset by fuel savings in ~5 years</li>
                            <li>• Annual CO₂ reduction: ~2.3 tons with electric driving</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Additional Cost Considerations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Petrol Car Additional Costs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Maintenance: ₦30,000/year (oil changes, parts)</li>
                      <li>• Engine servicing and repairs</li>
                      <li>• Emission testing fees</li>
                      <li>• Fluctuating fuel prices</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>EV Additional Costs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Maintenance: ₦10,000/year (fewer moving parts)</li>
                      <li>• Home charger: ₦500k–₦2M installation</li>
                      <li>• Battery replacement: ₦5M–₦15M after 8–15yrs</li>
                      <li>• Potential government incentives</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Disclaimer
                </h3>
                <p className="text-sm text-muted-foreground">
                  Prices fluctuate based on market conditions. Check{' '}
                  <a href="https://nigerianstat.gov.ng" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    NBS
                  </a>{' '}
                  for current fuel prices. Solar rates vary by state and provider. 
                  This calculator provides estimates based on 2025 data and should be used for planning purposes only.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}