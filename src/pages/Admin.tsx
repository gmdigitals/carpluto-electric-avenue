import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { MaintenanceToggle } from "@/components/admin/MaintenanceToggle";
import { WatermarkSettings } from "@/components/admin/WatermarkSettings";
import { DealershipLocations } from "@/components/admin/DealershipLocations";
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
  Settings,
  Shield,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Star
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

interface AnalyticsData {
  overview?: {
    total_users: number;
    total_cars: number;
    total_orders: number;
    total_test_drives: number;
    revenue_this_month: number;
    pending_test_drives: number;
  };
  sales_by_month?: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  top_selling_cars?: Array<{
    car_name: string;
    sales_count: number;
    total_revenue: number;
  }>;
}

export default function Admin() {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();

  // Check admin authentication
  const isAdminAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
  
  if (!isAdminAuthenticated && !(['admin', 'super_admin'].includes(profile?.role))) {
    return <Navigate to="/admin-login" />;
  }
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
  const [auditLogs, setAuditLogs] = useState([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [featureToggles, setFeatureToggles] = useState([]);
  const [reviews, setReviews] = useState([]);

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
    is_featured: false,
    images: [] as File[]
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
    if (user && profile && ['admin', 'super_admin'].includes(profile.role)) {
      fetchAdminData();
      fetchAnalytics();
    }
  }, [user, profile]);

  const fetchAdminData = async () => {
    await Promise.all([
      fetchCars(),
      fetchOrders(),
      fetchTestDrives(),
      fetchChargingStations(),
      fetchUsers(),
      fetchAuditLogs(),
      fetchFeatureToggles(),
      fetchReviews()
    ]);
  };

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          cars(brand, model),
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchTestDrives = async () => {
    try {
      const { data, error } = await supabase
        .from('test_drives')
        .select(`
          *,
          cars(brand, model),
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTestDrives(data || []);
    } catch (error) {
      console.error('Error fetching test drives:', error);
    }
  };

  const fetchChargingStations = async () => {
    try {
      const { data, error } = await supabase.from('charging_stations').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setChargingStations(data || []);
    } catch (error) {
      console.error('Error fetching charging stations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const fetchFeatureToggles = async () => {
    try {
      const { data, error } = await supabase.from('admin_settings').select('*').order('setting_key', { ascending: true });
      if (error) throw error;
      setFeatureToggles(data || []);
    } catch (error) {
      console.error('Error fetching feature toggles:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles(full_name, email),
          cars(brand, model)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Refresh analytics cache first
      await supabase.rpc('refresh_admin_analytics');
      
      // Fetch analytics data
      const { data, error } = await supabase
        .from('admin_analytics_cache')
        .select('*');

      if (error) throw error;

      const analyticsData: AnalyticsData = {};
      data?.forEach((row) => {
        const metricType = row.metric_type as keyof AnalyticsData;
        if (metricType === 'overview' || metricType === 'sales_by_month' || metricType === 'top_selling_cars') {
          analyticsData[metricType] = row.data as any;
        }
      });

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    }
  };

  const logAdminAction = async (action: string, resourceType: string, resourceId?: string, oldValues?: any, newValues?: any) => {
    try {
      await supabase.rpc('log_admin_action', {
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_old_values: oldValues,
        p_new_values: newValues
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload images first if any
      let imageUrls: string[] = [];
      if (carForm.images.length > 0) {
        for (const image of carForm.images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('car-images')
            .upload(fileName, image);

          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('car-images')
            .getPublicUrl(fileName);
          
          imageUrls.push(publicUrl);
        }
      }

      const carData = {
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
        is_featured: carForm.is_featured,
        images: imageUrls
      };

      const { error } = await supabase.from('cars').insert(carData);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        await logAdminAction('CREATE', 'car', undefined, undefined, carData);
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
          is_featured: false,
          images: []
        });
        fetchAdminData();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add car",
        variant: "destructive",
      });
    }
  };

  const handleAddChargingStation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const stationData = {
      ...stationForm,
      connector_types: stationForm.connector_types.split(',').map(c => c.trim()).filter(c => c),
      amenities: stationForm.amenities.split(',').map(a => a.trim()).filter(a => a),
      latitude: stationForm.latitude ? parseFloat(stationForm.latitude) : null,
      longitude: stationForm.longitude ? parseFloat(stationForm.longitude) : null,
      pricing_per_kwh: stationForm.pricing_per_kwh ? parseFloat(stationForm.pricing_per_kwh) : null
    };

    const { error } = await supabase.from('charging_stations').insert([stationData]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await logAdminAction('CREATE', 'charging_station', undefined, undefined, stationData);
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
    const oldStatus = testDrives.find((td: any) => td.id === id)?.status;
    
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
      await logAdminAction('UPDATE', 'test_drive', id, { status: oldStatus }, { status });
      toast({
        title: "Success",
        description: "Test drive status updated!",
      });
      fetchAdminData();
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const oldStatus = orders.find((order: any) => order.id === id)?.status;
    
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
      await logAdminAction('UPDATE', 'order', id, { status: oldStatus }, { status });
      toast({
        title: "Success",
        description: "Order status updated!",
      });
      fetchAdminData();
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const oldRole = users.find((u: any) => u.user_id === userId)?.role;
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await logAdminAction('UPDATE', 'user_role', userId, { role: oldRole }, { role: newRole });
      toast({
        title: "Success",
        description: "User role updated!",
      });
      fetchAdminData();
    }
  };

  const bulkUpdateCarStatus = async (status: string) => {
    if (selectedCars.length === 0) {
      toast({
        title: "Error",
        description: "Please select cars to update",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('cars')
      .update({ availability_status: status })
      .in('id', selectedCars);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await logAdminAction('BULK_UPDATE', 'cars', undefined, undefined, { 
        car_ids: selectedCars, 
        availability_status: status 
      });
      toast({
        title: "Success",
        description: `Updated ${selectedCars.length} cars`,
      });
      setSelectedCars([]);
      fetchAdminData();
    }
  };

  const updateFeatureToggle = async (settingKey: string, value: boolean) => {
    const { error } = await supabase
      .from('admin_settings')
      .update({ setting_value: value })
      .eq('setting_key', settingKey);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Feature toggle updated!",
      });
      fetchFeatureToggles();
    }
  };

  const updateReviewStatus = async (id: string, status: string, adminNotes?: string) => {
    const { error } = await supabase
      .from('reviews')
      .update({ status, admin_notes: adminNotes })
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
        description: `Review ${status} successfully!`,
      });
      fetchReviews();
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', carId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await logAdminAction('DELETE', 'car', carId);
      toast({
        title: "Success",
        description: "Car deleted successfully!",
      });
      fetchAdminData();
    }
  };

  const handleDeleteAllCars = async () => {
    if (!confirm('Are you sure you want to delete ALL cars? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete all car inventory. Type "DELETE ALL" to confirm.')) {
      return;
    }

    try {
      const { error } = await supabase.rpc('delete_all_cars');
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "All cars deleted successfully!",
      });
      
      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete all cars",
        variant: "destructive",
      });
    }
  };

  const exportCarsData = () => {
    const csvContent = [
      ['Brand', 'Model', 'Year', 'Price', 'Range (km)', 'Status'],
      ...cars.map((car: any) => [
        car.brand,
        car.model,
        car.year,
        car.price,
        car.range_km,
        car.availability_status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cars-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Cars data exported successfully!",
    });
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'user': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="bg-background/80 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/">
                <img 
                  src="/lovable-uploads/80acdd1a-fb67-4940-ba3e-f5696cf1959c.png" 
                  alt="CARPLUTO Logo" 
                  className="h-6 w-auto cursor-pointer"
                />
              </Link>
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CARPLUTO Admin</span>
              <Badge variant="default" className="ml-2">{profile.role}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={fetchAnalytics}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Stats Overview with Analytics */}
        {analytics.overview && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.overview.total_users}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Total Cars
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.overview.total_cars}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.overview.total_orders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{analytics.overview.revenue_this_month.toLocaleString()}</div>
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
                <div className="text-2xl font-bold">{analytics.overview.total_test_drives}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{analytics.overview.pending_test_drives}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-1">
            <TabsTrigger value="analytics" className="text-xs lg:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="users" className="text-xs lg:text-sm">Customers</TabsTrigger>
            <TabsTrigger value="cars" className="text-xs lg:text-sm">Cars</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs lg:text-sm">Orders</TabsTrigger>
            <TabsTrigger value="test-drives" className="text-xs lg:text-sm">Test Drives</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs lg:text-sm">Reviews</TabsTrigger>
            <TabsTrigger value="stations" className="text-xs lg:text-sm">Stations</TabsTrigger>
            <TabsTrigger value="add" className="text-xs lg:text-sm">Add New</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs lg:text-sm">Settings</TabsTrigger>
          </TabsList>

          {/* Analytics Dashboard */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales by Month Chart */}
              {analytics.sales_by_month && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Sales Trend (Last 12 Months)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.sales_by_month}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [
                          name === 'revenue' ? `₦${Number(value).toLocaleString()}` : value,
                          name === 'revenue' ? 'Revenue' : 'Orders'
                        ]} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                        <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Top Selling Cars */}
              {analytics.top_selling_cars && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Top Selling Cars
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.top_selling_cars}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="car_name" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [
                          name === 'total_revenue' ? `₦${Number(value).toLocaleString()}` : value,
                          name === 'total_revenue' ? 'Revenue' : 'Sales Count'
                        ]} />
                        <Legend />
                        <Bar dataKey="sales_count" fill="#8884d8" name="Sales Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Enhanced Customer Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Analytics & Management
                </CardTitle>
                <CardDescription>Complete customer overview and user management</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Customer Analytics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-primary">{users.length}</div>
                    <div className="text-sm text-muted-foreground">Total Customers</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {users.filter((u: any) => u.role === 'user').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Regular Users</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {users.filter((u: any) => u.role === 'admin').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Admins</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {users.filter((u: any) => new Date(u.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length}
                    </div>
                    <div className="text-sm text-muted-foreground">New This Month</div>
                  </Card>
                </div>

                {/* User List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">All Customers</h3>
                  {users.map((user: any) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-medium">{user.full_name || 'No name'}</h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                            {user.phone && <span>Phone: {user.phone}</span>}
                            <span>Last Updated: {new Date(user.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Select onValueChange={(value) => updateUserRole(user.user_id, value)}>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Change role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              {profile?.role === 'super_admin' && (
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Car Management with Bulk Operations */}
          <TabsContent value="cars">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Car Inventory Management
                    </CardTitle>
                    <CardDescription>Manage your EV collection with bulk operations</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {selectedCars.length > 0 && (
                      <>
                        <Select onValueChange={bulkUpdateCarStatus}>
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Bulk update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge variant="secondary">{selectedCars.length} selected</Badge>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={exportCarsData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={handleDeleteAllCars}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Cars
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cars.map((car: any) => (
                    <div key={car.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCars.includes(car.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCars([...selectedCars, car.id]);
                            } else {
                              setSelectedCars(selectedCars.filter(id => id !== car.id));
                            }
                          }}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
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
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteCar(car.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
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
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order #{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.profiles?.full_name} • ₦{parseFloat(order.total_amount).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.cars?.brand} {order.cars?.model}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Select onValueChange={(value) => updateOrderStatus(order.id, value)}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
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
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Test Drive Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testDrives.map((testDrive: any) => (
                    <div key={testDrive.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{testDrive.profiles?.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testDrive.cars?.brand} {testDrive.cars?.model} • {testDrive.preferred_date} at {testDrive.preferred_time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {testDrive.pickup_location}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(testDrive.status)}>
                            {testDrive.status}
                          </Badge>
                          <Select onValueChange={(value) => updateTestDriveStatus(testDrive.id, value)}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Update" />
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
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Charging Stations
                </CardTitle>
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
                            {station.power_output} • {station.connector_types?.join(', ')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(station.status)}>
                            {station.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add New Forms */}
          <TabsContent value="add">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Car Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Car
                  </CardTitle>
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
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          value={carForm.model}
                          onChange={(e) => setCarForm({...carForm, model: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
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
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="range_km">Range (km)</Label>
                        <Input
                          id="range_km"
                          type="number"
                          value={carForm.range_km}
                          onChange={(e) => setCarForm({...carForm, range_km: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="battery_capacity">Battery Capacity (kWh)</Label>
                        <Input
                          id="battery_capacity"
                          type="number"
                          step="0.1"
                          value={carForm.battery_capacity}
                          onChange={(e) => setCarForm({...carForm, battery_capacity: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="charging_time_hours">Charging Time (hours)</Label>
                        <Input
                          id="charging_time_hours"
                          type="number"
                          step="0.1"
                          value={carForm.charging_time_hours}
                          onChange={(e) => setCarForm({...carForm, charging_time_hours: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="exterior_color">Exterior Color</Label>
                        <Input
                          id="exterior_color"
                          value={carForm.exterior_color}
                          onChange={(e) => setCarForm({...carForm, exterior_color: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="interior_color">Interior Color</Label>
                        <Input
                          id="interior_color"
                          value={carForm.interior_color}
                          onChange={(e) => setCarForm({...carForm, interior_color: e.target.value})}
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

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={carForm.is_featured}
                        onChange={(e) => setCarForm({...carForm, is_featured: e.target.checked})}
                      />
                      <Label htmlFor="is_featured">Featured Car</Label>
                    </div>

                    <div>
                      <Label htmlFor="car_images">Car Images</Label>
                      <Input
                        id="car_images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setCarForm({...carForm, images: files});
                        }}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Select multiple images for this car
                      </p>
                    </div>

                    <Button type="submit" className="w-full">
                      Add Car
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Add New Charging Station Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Charging Station
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddChargingStation} className="space-y-4">
                    <div>
                      <Label htmlFor="station_name">Station Name</Label>
                      <Input
                        id="station_name"
                        value={stationForm.name}
                        onChange={(e) => setStationForm({...stationForm, name: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={stationForm.address}
                        onChange={(e) => setStationForm({...stationForm, address: e.target.value})}
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
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={stationForm.state}
                          onChange={(e) => setStationForm({...stationForm, state: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="power_output">Power Output</Label>
                        <Input
                          id="power_output"
                          value={stationForm.power_output}
                          onChange={(e) => setStationForm({...stationForm, power_output: e.target.value})}
                          placeholder="150kW DC Fast"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricing_per_kwh">Pricing per kWh (₦)</Label>
                        <Input
                          id="pricing_per_kwh"
                          type="number"
                          step="0.01"
                          value={stationForm.pricing_per_kwh}
                          onChange={(e) => setStationForm({...stationForm, pricing_per_kwh: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="connector_types">Connector Types (comma-separated)</Label>
                      <Input
                        id="connector_types"
                        value={stationForm.connector_types}
                        onChange={(e) => setStationForm({...stationForm, connector_types: e.target.value})}
                        placeholder="CCS, CHAdeMO, Type 2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                      <Input
                        id="amenities"
                        value={stationForm.amenities}
                        onChange={(e) => setStationForm({...stationForm, amenities: e.target.value})}
                        placeholder="WiFi, Restaurant, Shopping"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Add Charging Station
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reviews Management */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Customer Reviews Management
                </CardTitle>
                <CardDescription>Manage and moderate customer vehicle reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No reviews found</p>
                  ) : (
                    reviews.map((review: any) => (
                      <Card key={review.id} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{review.profiles?.full_name || 'Anonymous'}</span>
                              <Badge variant={
                                review.status === 'approved' ? 'default' : 
                                review.status === 'rejected' ? 'destructive' : 'secondary'
                              }>
                                {review.status}
                              </Badge>
                              {review.is_verified_purchase && (
                                <Badge variant="outline">Verified Purchase</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                for {review.cars?.brand} {review.cars?.model}
                              </span>
                            </div>
                            <h4 className="font-semibold mb-2">{review.title}</h4>
                            <p className="text-muted-foreground mb-2">{review.comment}</p>
                            {review.admin_notes && (
                              <div className="mt-2 p-2 bg-muted rounded">
                                <strong>Admin Notes:</strong> {review.admin_notes}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              Submitted: {new Date(review.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            {review.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateReviewStatus(review.id, 'approved')}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    const notes = prompt('Reason for rejection (optional):');
                                    updateReviewStatus(review.id, 'rejected', notes || undefined);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {review.status === 'approved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateReviewStatus(review.id, 'pending')}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Set Pending
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Maintenance Mode */}
              <MaintenanceToggle />
              
              {/* Watermark Settings */}
              <WatermarkSettings />
              
              {/* Dealership Locations */}
              <DealershipLocations />
              
              {/* Feature Toggles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Feature Toggles
                  </CardTitle>
                  <CardDescription>
                    Control which features are enabled or disabled site-wide
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {featureToggles.map((toggle: any) => (
                      <div key={toggle.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium capitalize">
                            {toggle.setting_key.replace(/^enable_/, '').replace(/_/g, ' ')}
                          </h3>
                          <p className="text-sm text-muted-foreground">{toggle.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={toggle.setting_value ? "default" : "secondary"}>
                            {toggle.setting_value ? "Enabled" : "Disabled"}
                          </Badge>
                          <Button
                            variant={toggle.setting_value ? "destructive" : "default"}
                            size="sm"
                            onClick={() => updateFeatureToggle(toggle.setting_key, !toggle.setting_value)}
                          >
                            {toggle.setting_value ? "Disable" : "Enable"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}