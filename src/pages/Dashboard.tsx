import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, ShoppingBag, Calendar, Settings, LogOut, Car, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    // Fetch orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select(`
        *,
        cars (brand, model, year, price)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Fetch test drives
    const { data: testDrivesData } = await supabase
      .from('test_drives')
      .select(`
        *,
        cars (brand, model, year)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setOrders(ordersData || []);
    setTestDrives(testDrivesData || []);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="bg-background/80 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <Zap className="h-4 w-4 text-accent" />
            <span className="font-bold text-xl">CarPluto Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {profile?.full_name || user.email}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={signOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.full_name || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.phone || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                    {profile?.role || 'user'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="test-drives">Test Drives</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{orders.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Test Drives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{testDrives.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ₦{orders.reduce((sum: number, order: any) => 
                          sum + (order.payment_status === 'paid' ? parseFloat(order.total_amount) : 0), 0
                        ).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...orders.slice(0, 3), ...testDrives.slice(0, 2)].map((item: any, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                          <div className="flex-1">
                            <p className="font-medium">
                              {item.cars ? `${item.cars.brand} ${item.cars.model}` : 'Activity'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.total_amount ? `Order - ₦${parseFloat(item.total_amount).toLocaleString()}` : 'Test Drive Request'}
                            </p>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      My Orders
                    </CardTitle>
                    <CardDescription>
                      View and track your EV purchases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No orders yet. Start browsing our EV collection!
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order: any) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">
                                  {order.cars?.brand} {order.cars?.model} ({order.cars?.year})
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Order #{order.order_number}
                                </p>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-bold">
                                ₦{parseFloat(order.total_amount).toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="test-drives" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Test Drive Requests
                    </CardTitle>
                    <CardDescription>
                      Manage your test drive appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {testDrives.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No test drive requests yet. Book one today!
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {testDrives.map((testDrive: any) => (
                          <div key={testDrive.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">
                                  {testDrive.cars?.brand} {testDrive.cars?.model}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {testDrive.preferred_date} at {testDrive.preferred_time}
                                </p>
                              </div>
                              <Badge className={getStatusColor(testDrive.status)}>
                                {testDrive.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Pickup: {testDrive.pickup_location}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Profile Settings
                    </CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+234 800 000 0000"
                        />
                      </div>
                      <Button type="submit">Update Profile</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}