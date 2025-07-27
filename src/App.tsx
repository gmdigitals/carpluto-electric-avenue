import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import Vehicles from "./pages/Vehicles";
import TestDrive from "./pages/TestDrive";
import Charging from "./pages/Charging";
import Finance from "./pages/Finance";
import Support from "./pages/Support";
import VehicleDetails from "./pages/VehicleDetails";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/test-drive" element={<TestDrive />} />
            <Route path="/charging" element={<Charging />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/support" element={<Support />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
