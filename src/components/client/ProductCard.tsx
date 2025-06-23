import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';
import { getProductImageUrl } from '../../utils/imageUtils';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string; // Single image field (new schema)
    images?: string[]; // Array of images (old schema)
    category: string;
    description?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore(state => state.addItem);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.info('Please log in before adding to cart');
      return;
    }
    
    // Use the utility function to get the correct image URL
    const productImage = getProductImageUrl(product);
      
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: productImage,
    });
    
    toast.success(`${product.name} added to cart`);
  };
  
  return (
    <div className="group relative">
      <Link to={`/product-detail?id=${product._id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 group-hover:shadow-lg">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-100">
            <img
              src={getProductImageUrl(product)}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {/* Quick add button */}
          <div className="absolute bottom-4 right-4 transform translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center rounded-full bg-primary-600 p-2.5 text-white shadow-md hover:bg-primary-700 transition-all"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
          
          {/* Product Info */}
          <div className="p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-accent-500">
              {product.category}
            </div>
            <h3 className="mt-1 font-serif text-lg font-medium text-secondary-900 transition-colors group-hover:text-primary-600">
              {product.name}
            </h3>
            <p className="mt-1 font-medium text-secondary-800">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;