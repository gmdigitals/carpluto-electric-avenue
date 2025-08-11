import { Navigation } from '@/components/Navigation';
import { VehicleShowcase } from '@/components/VehicleShowcase';
import Footer from '@/components/Footer';

const Vehicles = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <VehicleShowcase />
      </div>
      <Footer />
    </div>
  );
};

export default Vehicles;