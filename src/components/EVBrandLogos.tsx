import teslaLogo from '@/assets/brands/tesla-logo.png';
import bydLogo from '@/assets/brands/byd-logo.png';
import hyundaiLogo from '@/assets/brands/hyundai-logo.png';
import kiaLogo from '@/assets/brands/kia-logo.png';
import nissanLogo from '@/assets/brands/nissan-logo.png';
import bmwLogo from '@/assets/brands/bmw-logo.png';
import mercedesLogo from '@/assets/brands/mercedes-logo.png';
import audiLogo from '@/assets/brands/audi-logo.png';

export function EVBrandLogos() {
  const brands = [
    { name: 'Tesla', logo: teslaLogo },
    { name: 'BYD', logo: bydLogo },
    { name: 'Hyundai', logo: hyundaiLogo },
    { name: 'Kia', logo: kiaLogo },
    { name: 'Nissan', logo: nissanLogo },
    { name: 'BMW', logo: bmwLogo },
    { name: 'Mercedes', logo: mercedesLogo },
    { name: 'Audi', logo: audiLogo },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Trusted EV Brands
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover Nigeria's largest selection of premium electric vehicles from world-leading manufacturers
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className="flex items-center justify-center p-6 bg-background rounded-lg border border-border hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <img 
                src={brand.logo} 
                alt={`${brand.name} logo`}
                className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            And many more premium EV brands available on our platform
          </p>
        </div>
      </div>
    </section>
  );
}