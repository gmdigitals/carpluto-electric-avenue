import { Navigation } from '@/components/Navigation';
import { VehicleShowcase } from '@/components/VehicleShowcase';
import Footer from '@/components/Footer';

const Vehicles = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Electric Vehicle <span className="text-primary">Collection</span>
            </h1>
          </div>
        </div>
        <VehicleShowcase />
      </div>
      <Footer />
    </div>
  );
};

export default Vehicles;