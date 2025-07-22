import { Navigation } from '@/components/Navigation';
import { EVHero } from '@/components/EVHero';
import { VehicleShowcase } from '@/components/VehicleShowcase';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <EVHero />
      <VehicleShowcase />
      <Footer />
    </div>
  );
};

export default Index;
