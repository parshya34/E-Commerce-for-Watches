import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Watch 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { isAuthenticated, logout, user } = useAuthStore();
  const totalItems = useCartStore(state => state.totalItems());
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/collection?search=${searchQuery}`);
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Watch className="h-8 w-8 text-primary-600 mr-2" />
            <span className="text-2xl font-serif font-semibold text-primary-800">Chrono</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-secondary-800 hover:text-primary-600 font-medium transition">
              Home
            </Link>
            <Link to="/collection" className="text-secondary-800 hover:text-primary-600 font-medium transition">
              Collection
            </Link>
            <Link to="/about" className="text-secondary-800 hover:text-primary-600 font-medium transition">
              About
            </Link>
            <Link to="/contact" className="text-secondary-800 hover:text-primary-600 font-medium transition">
              Contact
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Search className="h-5 w-5 text-secondary-800" />
            </button>

            <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 transition relative">
              <ShoppingCart className="h-5 w-5 text-secondary-800" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <User className="h-5 w-5 text-secondary-800" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        {user?.email}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 rounded-full hover:bg-gray-100 transition">
                <User className="h-5 w-5 text-secondary-800" />
              </Link>
            )}

            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition md:hidden"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6 text-secondary-800" /> : 
                <Menu className="h-6 w-6 text-secondary-800" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 animate-fade-in">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-secondary-800 hover:text-primary-600 font-medium py-2 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/collection" 
                className="text-secondary-800 hover:text-primary-600 font-medium py-2 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Collection
              </Link>
              <Link 
                to="/about" 
                className="text-secondary-800 hover:text-primary-600 font-medium py-2 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-secondary-800 hover:text-primary-600 font-medium py-2 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 px-4 z-50 animate-fade-in">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Search Products</h2>
              <button 
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5 text-secondary-800" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for watches..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-lg transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;