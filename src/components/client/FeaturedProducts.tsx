import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string; // Single image field (new schema)
  images?: string[]; // Array of images (old schema)
  category: string;
  isBestseller: boolean;
  description?: string;
}

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/products?bestseller=true&limit=8');
        
        // Log the response for debugging
        console.log('Featured products response:', response.data);
        
        // Ensure data is always an array
        let productsArray = [];
        if (Array.isArray(response.data)) {
          productsArray = response.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          productsArray = response.data.products;
        }
        
        // Cache products in localStorage for offline fallback
        try {
          // First, try to get existing cached products
          const existingCache = localStorage.getItem('cached-products');
          let allCachedProducts: Product[] = [];
          
          if (existingCache) {
            allCachedProducts = JSON.parse(existingCache) as Product[];
            
            // Update cache with new products
            productsArray.forEach((newProduct: Product) => {
              const existingIndex = allCachedProducts.findIndex((p: Product) => p._id === newProduct._id);
              if (existingIndex >= 0) {
                // Update existing product
                allCachedProducts[existingIndex] = newProduct;
              } else {
                // Add new product
                allCachedProducts.push(newProduct);
              }
            });
          } else {
            // No existing cache, use current products
            allCachedProducts = productsArray;
          }
          
          // Save updated cache
          localStorage.setItem('cached-products', JSON.stringify(allCachedProducts));
        } catch (cacheError) {
          console.error('Error caching products:', cacheError);
        }
        
        setProducts(productsArray);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching featured products:', err);
        
        // Try to load from cache if network error
        if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
          try {
            const cachedProducts = localStorage.getItem('cached-products');
            if (cachedProducts) {
              const parsedProducts = JSON.parse(cachedProducts) as Product[];
              // Filter to only bestseller products
              const bestsellerProducts = parsedProducts.filter((p: Product) => p.isBestseller).slice(0, 4);
              if (bestsellerProducts.length > 0) {
                console.log('Using cached bestseller products:', bestsellerProducts);
                setProducts(bestsellerProducts);
                setError(''); // Clear error if we have cached data
                setLoading(false);
                return;
              }
            }
          } catch (cacheError) {
            console.error('Error reading cached products:', cacheError);
          }
        }
        
        setError('Failed to load featured products');
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-semibold text-secondary-900 mb-4">Bestselling Timepieces</h2>
          <p className="text-secondary-600 max-w-xl mx-auto">
            Our most popular watches, handpicked for their exceptional design and craftsmanship.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No bestselling products found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;