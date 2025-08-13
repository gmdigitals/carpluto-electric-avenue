import { useState } from 'react';
import { useFeatureToggles } from '@/hooks/useFeatureToggles';
import { Mail, Phone, MessageCircle, Twitter, Instagram, Linkedin, Shield, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { features } = useFeatureToggles();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    try {
      const response = await supabase.functions.invoke('newsletter-signup', {
        body: { email: email.trim() }
      });

      if (response.error) {
        throw response.error;
      }

      setEmail('');
      alert('Thank you for subscribing to our newsletter!');
    } catch (error) {
      console.error('Newsletter signup error:', error);
      alert('Failed to subscribe. Please try again.');
    }
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/08155132360?text=Hello%20CARPLUTO,%20I%20need%20assistance%20with%20electric%20vehicles', '_blank');
  };

  return (
    <footer className="bg-footer text-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Explore EVs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Explore EVs</h3>
            <ul className="space-y-3">
              <li>
                <a href="/vehicles" className="text-slate-300 hover:text-primary transition-colors duration-200">
                  All Vehicles
                </a>
              </li>
              <li>
                <a href="/cost-calculator" className="text-slate-300 hover:text-primary transition-colors duration-200">
                  Cost Calculator
                </a>
              </li>
              {features.enableChargingStations && (
                <li>
                  <a href="/charging" className="text-slate-300 hover:text-primary transition-colors duration-200">
                    Charging Stations
                  </a>
                </li>
              )}
              {features.enableFinancing && (
                <li>
                  <a href="/finance" className="text-slate-300 hover:text-primary transition-colors duration-200">
                    Financing Options
                  </a>
                </li>
              )}
              <li>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.href = '/test-drive'}
                  className="border-primary text-primary hover:bg-primary hover:text-white mt-2"
                >
                  Book Test Drive
                </Button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Customer Support</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:hello@carpluto.com.ng" className="text-slate-300 hover:text-primary transition-colors duration-200">
                  hello@carpluto.com.ng
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:08155132360" className="text-slate-300 hover:text-primary transition-colors duration-200">
                  08155132360
                </a>
              </li>
              <li>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleWhatsAppContact}
                  className="flex items-center space-x-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Live Chat</span>
                </Button>
              </li>
              {features.enableEvSupport && (
                <li>
                  <a href="/support" className="text-slate-300 hover:text-primary transition-colors duration-200">
                    Customer Support
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Legal & Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-slate-300 hover:text-primary transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-slate-300 hover:text-primary transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-slate-300 hover:text-primary transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              {features.enableEvSupport && (
                <li>
                  <a href="/support" className="text-slate-300 hover:text-primary transition-colors duration-200">
                    Returns & Support
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Stay Connected */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <p className="text-slate-300 text-sm mb-3">Get EV news & deals</p>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 flex-1"
                />
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </form>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-slate-300 text-sm mb-3">Follow Us</p>
              <div className="flex space-x-3">
                <a 
                  href="https://twitter.com/carpluto" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-primary transition-colors duration-200"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://instagram.com/carpluto" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-primary transition-colors duration-200"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/company/carpluto" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-primary transition-colors duration-200"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Future App Download */}
            <div className="pt-4">
              <p className="text-slate-400 text-sm">
                Mobile app coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm">
                © 2025 <span className="text-white font-semibold">CARPLUTO</span> – Nigeria's Trusted EV Marketplace (A Pluto EV Service)
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6">
              {/* Paystack Badge */}
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-slate-400 text-sm">Paystack Secured</span>
              </div>

              {/* Accessibility Toggle */}
              <button 
                className="flex items-center space-x-2 text-slate-400 hover:text-primary transition-colors duration-200"
                onClick={() => {
                  // Accessibility toggle logic will be implemented later
                  console.log('Accessibility toggle clicked');
                }}
              >
                <Accessibility className="h-4 w-4" />
                <span className="text-sm">Accessibility</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;