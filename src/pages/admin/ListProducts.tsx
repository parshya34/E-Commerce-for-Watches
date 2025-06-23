import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { getProductImageUrl } from '../../utils/imageUtils';

interface Product {
  _id: string; // MongoDB uses _id instead of id
  name: string;
  price: number;
  description: string;
  image?: string; // Single image URL (new schema)
  images?: string[]; // Array of image URLs (old schema)
  category: string;
  stock?: number;
  isBestseller?: boolean;
}

export default function ListProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      // Make sure we're setting an array of products
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && typeof response.data === 'object') {
        // If the response is an object but not an array, check if it has products property
        if (Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          // Log the actual response structure for debugging
          console.log('Unexpected API response format:', response.data);
          setProducts([]);
          setError('Unexpected API response format');
        }
      } else {
        setProducts([]);
        setError('Invalid API response');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/api/products/${productId}`);
      
      setProducts(products.filter(product => product._id !== productId));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;
  
  // Ensure products is always an array
  const productsList = Array.isArray(products) ? products : [];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <a
            href="/admin/add-product"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Product
          </a>
        </div>

        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productsList.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={getProductImageUrl(product)}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900 mr-4"
                    >
                      Delete
                    </button>
                    <a
                      href={`/admin/edit-product/${product._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}