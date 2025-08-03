export function EVBrandLogos() {
  const brands = [
    { name: 'Tesla', logo: '🅃' },
    { name: 'BYD', logo: 'BYD' },
    { name: 'Hyundai', logo: 'H' },
    { name: 'Kia', logo: 'KIA' },
    { name: 'Nissan', logo: 'NISSAN' },
    { name: 'BMW', logo: 'BMW' },
    { name: 'Mercedes', logo: 'MB' },
    { name: 'Audi', logo: 'AUDI' },
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
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {brand.logo}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {brand.name}
                </p>
              </div>
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