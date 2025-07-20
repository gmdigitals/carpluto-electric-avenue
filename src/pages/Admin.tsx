import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Car, 
  Users, 
  Calendar, 
  ShoppingBag, 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings
} from "lucide-react";

export default function Admin() {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalTestDrives: 0,
    totalChargingStations: 0
  });
  
  const [cars, setCars] = useState([]);
  const [orders, setOrders] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [chargingStations, setChargingStations] = useState([]);
  const [users, setUsers] = useState([]);

  const [carForm, setCarForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    range_km: '',
    battery_capacity: '',
    charging_time_hours: '',
    top_speed: '',
    acceleration_0_100: '',
    exterior_color: '',
    interior_color: '',
    features: '',
    is_featured: false
  });

  const [stationForm, setStationForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
    connector_types: '',
    power_output: '',
    pricing_per_kwh: '',
    operating_hours: '',
    amenities: ''
  });

  useEffect(() => {
    if (user && profile?.role && ['admin', 'super_admin'].includes(profile.role)) {
      fetchAdminData();
    }
  }, [user, profile]);

  const fetchAdminData = async () => {
    try {
      // Fetch stats
      const [carsRes, usersRes, ordersRes, testDrivesRes, stationsRes] = await Promise.all([
        supabase.from('cars').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('test_drives').select('id', { count: 'exact' }),
        supabase.from('charging_stations').select('id', { count: 'exact' })
      ]);

      setStats({
        totalCars: carsRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalTestDrives: testDrivesRes.count || 0,
        totalChargingStations: stationsRes.count || 0
      });

      // Fetch detailed data
      const { data: carsData } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          cars (brand, model, year),
          profiles (full_name, email)
        `)
        .order('created_at', { ascending: false });

      const { data: testDrivesData } = await supabase
        .from('test_drives')
        .select(`
          *,
          cars (brand, model, year),
          profiles (full_name, email)
        `)
        .order('created_at', { ascending: false });

      const { data: stationsData } = await supabase
        .from('charging_stations')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setCars(carsData || []);
      setOrders(ordersData || []);
      setTestDrives(testDrivesData || []);
      setChargingStations(stationsData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('cars').insert({
      brand: carForm.brand,
      model: carForm.model,
      year: carForm.year,
      price: parseFloat(carForm.price),
      range_km: parseInt(carForm.range_km),
      battery_capacity: carForm.battery_capacity ? parseFloat(carForm.battery_capacity) : null,
      charging_time_hours: carForm.charging_time_hours ? parseFloat(carForm.charging_time_hours) : null,
      top_speed: carForm.top_speed ? parseInt(carForm.top_speed) : null,
      acceleration_0_100: carForm.acceleration_0_100 ? parseFloat(carForm.acceleration_0_100) : null,
      exterior_color: carForm.exterior_color || null,
      interior_color: carForm.interior_color || null,
      features: carForm.features.split(',').map(f => f.trim()).filter(f => f),
      is_featured: carForm.is_featured
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Car added successfully!",
      });
      setCarForm({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        range_km: '',
        battery_capacity: '',
        charging_time_hours: '',
        top_speed: '',
        acceleration_0_100: '',
        exterior_color: '',
        interior_color: '',
        features: '',
        is_featured: false
      });
      fetchAdminData();
    }
  };

  const handleAddChargingStation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('charging_stations').insert([{
      ...stationForm,
      connector_types: stationForm.connector_types.split(',').map(c => c.trim()).filter(c => c),
      amenities: stationForm.amenities.split(',').map(a => a.trim()).filter(a => a),
      latitude: stationForm.latitude ? parseFloat(stationForm.latitude) : null,
      longitude: stationForm.longitude ? parseFloat(stationForm.longitude) : null,
      pricing_per_kwh: stationForm.pricing_per_kwh ? parseFloat(stationForm.pricing_per_kwh) : null
    }]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Charging station added successfully!",
      });
      setStationForm({
        name: '',
        address: '',
        city: '',
        state: '',
        latitude: '',
        longitude: '',
        connector_types: '',
        power_output: '',
        pricing_per_kwh: '',
        operating_hours: '',
        amenities: ''
      });
      fetchAdminData();
    }
  };

  const updateTestDriveStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('test_drives')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Test drive status updated!",
      });
      fetchAdminData();
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Order status updated!",
      });
      fetchAdminData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !profile || !['admin', 'super_admin'].includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'delivered': return 'bg-green-500';
      case 'paid': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="bg-background/80 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CarPluto Admin</span>
            </div>
            <Badge variant="default">{profile.role}</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Car className="h-4 w-4" />
                Cars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCars}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Test Drives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTestDrives}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Stations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChargingStations}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="cars" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="cars">Cars</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="test-drives">Test Drives</TabsTrigger>
            <TabsTrigger value="stations">Stations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>

          {/* Cars Management */}
          <TabsContent value="cars">
            <Card>
              <CardHeader>
                <CardTitle>Car Inventory</CardTitle>
                <CardDescription>Manage your EV collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cars.map((car: any) => (
                    <div key={car.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{car.brand} {car.model} ({car.year})</h3>
                        <p className="text-sm text-muted-foreground">
                          ₦{parseFloat(car.price).toLocaleString()} • {car.range_km}km range
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={car.is_featured ? 'default' : 'secondary'}>
                            {car.is_featured ? 'Featured' : 'Regular'}
                          </Badge>
                          <Badge className={getStatusColor(car.availability_status)}>
                            {car.availability_status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Track and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">#{order.order_number}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.cars?.brand} {order.cars?.model} for {order.profiles?.full_name}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">₦{parseFloat(order.total_amount).toLocaleString()}</p>
                        <div className="flex gap-2">
                          <Select onValueChange={(value) => updateOrderStatus(order.id, value)}>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Drives Management */}
          <TabsContent value="test-drives">
            <Card>
              <CardHeader>
                <CardTitle>Test Drive Requests</CardTitle>
                <CardDescription>Manage test drive appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testDrives.map((testDrive: any) => (
                    <div key={testDrive.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">
                            {testDrive.cars?.brand} {testDrive.cars?.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {testDrive.profiles?.full_name} • {testDrive.preferred_date} at {testDrive.preferred_time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Pickup: {testDrive.pickup_location}
                          </p>
                        </div>
                        <Badge className={getStatusColor(testDrive.status)}>
                          {testDrive.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Select onValueChange={(value) => updateTestDriveStatus(testDrive.id, value)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charging Stations */}
          <TabsContent value="stations">
            <Card>
              <CardHeader>
                <CardTitle>Charging Stations</CardTitle>
                <CardDescription>Manage charging station network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chargingStations.map((station: any) => (
                    <div key={station.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{station.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {station.address}, {station.city}, {station.state}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {station.power_output} • ₦{station.pricing_per_kwh}/kWh
                          </p>
                        </div>
                        <Badge className={getStatusColor(station.status)}>
                          {station.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user: any) => (
                    <div key={user.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{user.full_name || 'No name set'}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">{user.phone || 'No phone'}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add New Items */}
          <TabsContent value="add">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Car Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Car</CardTitle>
                  <CardDescription>Add a new EV to the inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCar} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={carForm.brand}
                          onChange={(e) => setCarForm({...carForm, brand: e.target.value})}
                          placeholder="Tesla"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          value={carForm.model}
                          onChange={(e) => setCarForm({...carForm, model: e.target.value})}
                          placeholder="Model 3"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          type="number"
                          value={carForm.year}
                          onChange={(e) => setCarForm({...carForm, year: parseInt(e.target.value)})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (₦)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={carForm.price}
                          onChange={(e) => setCarForm({...carForm, price: e.target.value})}
                          placeholder="8000000"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="range">Range (km)</Label>
                        <Input
                          id="range"
                          type="number"
                          value={carForm.range_km}
                          onChange={(e) => setCarForm({...carForm, range_km: e.target.value})}
                          placeholder="500"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="battery">Battery (kWh)</Label>
                        <Input
                          id="battery"
                          type="number"
                          step="0.1"
                          value={carForm.battery_capacity}
                          onChange={(e) => setCarForm({...carForm, battery_capacity: e.target.value})}
                          placeholder="75.0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="features">Features (comma-separated)</Label>
                      <Textarea
                        id="features"
                        value={carForm.features}
                        onChange={(e) => setCarForm({...carForm, features: e.target.value})}
                        placeholder="Autopilot, Premium Audio, Glass Roof"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Car
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Add Charging Station Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Charging Station</CardTitle>
                  <CardDescription>Add a new charging station location</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddChargingStation} className="space-y-4">
                    <div>
                      <Label htmlFor="stationName">Station Name</Label>
                      <Input
                        id="stationName"
                        value={stationForm.name}
                        onChange={(e) => setStationForm({...stationForm, name: e.target.value})}
                        placeholder="Lagos Fast Charge Hub"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={stationForm.address}
                        onChange={(e) => setStationForm({...stationForm, address: e.target.value})}
                        placeholder="123 Victoria Island Road"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={stationForm.city}
                          onChange={(e) => setStationForm({...stationForm, city: e.target.value})}
                          placeholder="Lagos"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={stationForm.state}
                          onChange={(e) => setStationForm({...stationForm, state: e.target.value})}
                          placeholder="Lagos State"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="power">Power Output</Label>
                        <Input
                          id="power"
                          value={stationForm.power_output}
                          onChange={(e) => setStationForm({...stationForm, power_output: e.target.value})}
                          placeholder="150kW"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricing">Price per kWh (₦)</Label>
                        <Input
                          id="pricing"
                          type="number"
                          step="0.01"
                          value={stationForm.pricing_per_kwh}
                          onChange={(e) => setStationForm({...stationForm, pricing_per_kwh: e.target.value})}
                          placeholder="120.00"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="connectors">Connector Types (comma-separated)</Label>
                      <Input
                        id="connectors"
                        value={stationForm.connector_types}
                        onChange={(e) => setStationForm({...stationForm, connector_types: e.target.value})}
                        placeholder="CCS, CHAdeMO, Type 2"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Station
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}