import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Hero from '../../components/client/Hero';
import FeaturedProducts from '../../components/client/FeaturedProducts';

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-semibold text-secondary-900 mb-4">What Our Customers Say</h2>
              <p className="text-secondary-600 max-w-xl mx-auto">
                Discover why watch enthusiasts around the world choose Chrono for their collection.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                    R
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-secondary-900">Rahul Sharma</h4>
                    <p className="text-secondary-500 text-sm">Watch Collector</p>
                  </div>
                </div>
                <p className="text-secondary-700 italic">
                  "The craftsmanship of the watches at Chrono is exceptional. I've added three pieces to my collection and each one has exceeded my expectations."
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                    A
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-secondary-900">Ananya Patel</h4>
                    <p className="text-secondary-500 text-sm">Fashion Designer</p>
                  </div>
                </div>
                <p className="text-secondary-700 italic">
                  "I'm extremely impressed with the women's collection. The designs are elegant yet modern, and the customer service was impeccable."
                </p>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                    V
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-secondary-900">Vikram Singh</h4>
                    <p className="text-secondary-500 text-sm">Business Executive</p>
                  </div>
                </div>
                <p className="text-secondary-700 italic">
                  "The attention to detail and quality of the watches is remarkable. I've received many compliments on my Chrono timepiece."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Brand Story */}
        <section className="py-16 bg-secondary-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Watchmaking workshop" 
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div>
                <h2 className="text-3xl font-serif font-semibold mb-6">Our Commitment to Excellence</h2>
                <p className="text-gray-300 mb-6">
                  For over two decades, Chrono has been dedicated to the art of watchmaking. 
                  Each timepiece reflects our commitment to precision, quality, and timeless design.
                </p>
                <p className="text-gray-300 mb-6">
                  We source the finest materials from around the world and employ skilled artisans 
                  who combine traditional techniques with innovative technology.
                </p>
                <p className="text-gray-300">
                  When you choose a Chrono watch, you're not just buying a timepiece; 
                  you're investing in a legacy of craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;