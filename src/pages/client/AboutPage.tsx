import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-4">
              Welcome to our store. We are dedicated to providing the highest quality products
              and exceptional customer service to our valued customers.
            </p>
            <p className="text-gray-600 mb-4">
              Our mission is to deliver an outstanding shopping experience while offering
              carefully curated products that meet our strict standards of quality and value.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;