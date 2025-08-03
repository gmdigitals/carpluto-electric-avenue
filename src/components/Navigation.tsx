import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureToggles } from '@/hooks/useFeatureToggles';
import { Menu, X, Zap, Search, User, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { features } = useFeatureToggles();

  const navItems = [
    { label: 'Vehicles', href: '/vehicles' },
    { label: 'Test Drive', href: '/test-drive' },
    ...(features.enableChargingStations ? [{ label: 'Charging', href: '/charging' }] : []),
    ...(features.enableFinancing ? [{ label: 'Finance', href: '/finance' }] : []),
    ...(features.enableEvSupport ? [{ label: 'Support', href: '/support' }] : [])
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/80acdd1a-fb67-4940-ba3e-f5696cf1959c.png" 
              alt="CARPLUTO Logo" 
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                className="w-64 pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
            
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                
                {profile?.role && ['admin', 'super_admin'].includes(profile.role) && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    0
                  </span>
                </Button>
                
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles..."
                  className="w-full pl-10 bg-muted/50 border-none"
                />
              </div>
              
              {/* Mobile Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Actions */}
              <div className="flex gap-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <div className="w-full text-sm text-muted-foreground mb-2">
                      <p className="font-medium">{profile?.full_name || user.email}</p>
                      {profile?.role && (
                        <Badge variant="secondary" className="mt-1">
                          {profile.role}
                        </Badge>
                      )}
                    </div>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    {profile?.role && ['admin', 'super_admin'].includes(profile.role) && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="w-full">
                        <Button variant="outline" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="w-full">
                    <Button className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}