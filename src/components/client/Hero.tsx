import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-primary-950 to-secondary-900 min-h-[100vh] flex items-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')] bg-cover bg-center opacity-10"></div>
      
      <div className="container mx-auto px-4 py-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
              Timeless Elegance on Your Wrist
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
              Discover our exquisite collection of premium watches crafted with precision and designed for those who value both style and functionality.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="accent" 
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
                onClick={() => {}}
              >
                <Link to="/collection">
                  Explore Collection
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => {}}
              >
                <Link to="/about">
                  About Our Craftsmanship
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 animate-slide-up">
              <img 
                src="https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Luxury Watch" 
                className="mx-auto rounded-lg shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;