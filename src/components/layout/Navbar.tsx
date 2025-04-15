
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Train, 
  Ticket, 
  User, 
  Menu, 
  X 
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-railway-600 to-railway-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Train className="h-6 w-6" />
            <span className="font-bold text-xl">RailBooker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={isActive('/') ? "secondary" : "ghost"} 
                className="text-white hover:bg-white/10"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/trains">
              <Button 
                variant={isActive('/trains') ? "secondary" : "ghost"} 
                className="text-white hover:bg-white/10"
              >
                <Train className="h-4 w-4 mr-2" />
                Trains
              </Button>
            </Link>
            <Link to="/bookings">
              <Button 
                variant={isActive('/bookings') ? "secondary" : "ghost"} 
                className="text-white hover:bg-white/10"
              >
                <Ticket className="h-4 w-4 mr-2" />
                My Bookings
              </Button>
            </Link>
            <Link to="/admin">
              <Button 
                variant={isActive('/admin') ? "secondary" : "ghost"} 
                className="text-white hover:bg-white/10"
              >
                <User className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-railway-800 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Link to="/" onClick={toggleMobileMenu}>
              <Button 
                variant={isActive('/') ? "secondary" : "ghost"} 
                className="w-full justify-start text-white hover:bg-white/10"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/trains" onClick={toggleMobileMenu}>
              <Button 
                variant={isActive('/trains') ? "secondary" : "ghost"} 
                className="w-full justify-start text-white hover:bg-white/10"
              >
                <Train className="h-4 w-4 mr-2" />
                Trains
              </Button>
            </Link>
            <Link to="/bookings" onClick={toggleMobileMenu}>
              <Button 
                variant={isActive('/bookings') ? "secondary" : "ghost"} 
                className="w-full justify-start text-white hover:bg-white/10"
              >
                <Ticket className="h-4 w-4 mr-2" />
                My Bookings
              </Button>
            </Link>
            <Link to="/admin" onClick={toggleMobileMenu}>
              <Button 
                variant={isActive('/admin') ? "secondary" : "ghost"} 
                className="w-full justify-start text-white hover:bg-white/10"
              >
                <User className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
