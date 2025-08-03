import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, Battery, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroEv1 from '@/assets/hero-ev-1.jpg';
import heroEv2 from '@/assets/hero-ev-2.jpg';
import heroEv3 from '@/assets/hero-ev-3.jpg';

const heroSlides = [
  {
    id: 1,
    image: heroEv1,
    title: "Tesla Model 3",
    subtitle: "The Future of Driving",
    description: "Experience electric luxury with cutting-edge technology and unmatched performance.",
    range: "500km",
    power: "350kW",
    charging: "Supercharge",
    price: "₦18,500,000",
    cta: "Configure Now"
  },
  {
    id: 2,
    image: heroEv2,
    subtitle: "BYD Electric SUV",
    title: "Power Meets Efficiency",
    description: "Premium electric SUV designed for Nigerian roads with global technology.",
    range: "420km",
    power: "180kW", 
    charging: "Fast Charge",
    price: "₦12,800,000",
    cta: "Learn More"
  },
  {
    id: 3,
    image: heroEv3,
    subtitle: "Charging Network",
    title: "Electrify Your Journey",
    description: "Comprehensive charging infrastructure across Nigeria's major cities.",
    range: "24/7",
    power: "150kW",
    charging: "DC Fast",
    price: "Find Stations",
    cta: "Explore Map"
  }
];

export function EVHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-hero">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover transition-all duration-1000 ease-electric"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Subtitle */}
            <p className="text-primary font-medium text-lg mb-2 animate-fade-in">
              {slide.subtitle}
            </p>
            
            {/* Title */}
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
              {slide.title}
            </h1>
            
            {/* Description */}
            <p className="text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {slide.description}
            </p>

            {/* Specs */}
            <div className="flex flex-wrap gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{slide.range} Range</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">{slide.power} Power</span>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{slide.charging}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-electric transition-all duration-300 animate-electric-pulse"
                onClick={() => navigate('/vehicles')}
              >
                {slide.cta}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => navigate('/cost-calculator')}
              >
                {slide.price}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          {/* Dots */}
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary shadow-glow' 
                    : 'bg-background/40 hover:bg-background/60'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 transition-all duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}