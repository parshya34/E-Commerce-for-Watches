import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/client/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useEffect, useState } from 'react';
import api from '../../utils/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[]; // Changed from image to images array
  category: string;
  isBestseller?: boolean;
}

const CollectionPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      // Use our authenticated API utility
      let url = '/api/products';
      
      if (selectedCategory !== 'all') {
        url = `${url}?category=${selectedCategory}`;
      }

      const response = await api.get(url);
      console.log('Collection products response:', response.data);
      
      // Handle different response formats
      let productsArray = [];
      if (Array.isArray(response.data)) {
        productsArray = response.data;
      } else if (response.data && Array.isArray(response.data.products)) {
        productsArray = response.data.products;
      }
      
      // Cache all products in localStorage for offline use
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
        console.log('Cached all products for offline use');
      } catch (cacheError) {
        console.error('Error caching products:', cacheError);
      }
      
      setProducts(productsArray);
      
      // Get unique categories only if we have products
      if (productsArray.length > 0) {
        const uniqueCategories = [...new Set(productsArray.map((product: Product) => product.category))];
        setCategories(uniqueCategories as string[]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Collection</h1>
          
          {/* Category Filter */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* No Products Message */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollectionPage;