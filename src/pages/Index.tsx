import { Navigation } from '@/components/Navigation';
import { EVHero } from '@/components/EVHero';
import { VehicleShowcase } from '@/components/VehicleShowcase';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <EVHero />
      <VehicleShowcase />
    </div>
  );
};

export default Index;
