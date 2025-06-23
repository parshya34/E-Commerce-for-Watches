import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Upload, X } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../../config/constants';
import api from '../../utils/api';
import Sidebar from '../../components/admin/Sidebar';
import Button from '../../components/common/Button';

interface FormData {
  name: string;
  price: number;
  description: string;
  category: string;
  isBestseller: boolean;
}

const AddProduct: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Generate preview URL
      const newPreviewUrl = URL.createObjectURL(selectedFile);
      
      // Revoke previous URL to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setPreviewUrl(newPreviewUrl);
    }
  };
  
  const removeImage = () => {
    setImage(null);
    
    // Revoke the URL to avoid memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };
  
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      if (!image) {
        toast.error('Please upload a product image');
        return;
      }
      
      // Create form data for the API request
      const formData = new FormData();
      
      formData.append('name', data.name);
      formData.append('price', data.price.toString());
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('isBestseller', data.isBestseller ? 'true' : 'false');
      
      // Add the single image
      formData.append('image', image);
      
      // Using our authenticated API utility
      await api.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Product added successfully!');
      reset();
      setImage(null);
      setPreviewUrl('');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-serif font-semibold text-secondary-900 mb-6">Add New Product</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                  Watch Name <span className="text-error-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Product name is required' })}
                  className={`block w-full rounded-md border ${errors.name ? 'border-error-300' : 'border-gray-300'} px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="Elegant Chronograph"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error-500">{errors.name.message}</p>
                )}
              </div>
              
              {/* Product Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-secondary-700 mb-1">
                  Price (₹) <span className="text-error-500">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be greater than 0' }
                  })}
                  className={`block w-full rounded-md border ${errors.price ? 'border-error-300' : 'border-gray-300'} px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="12500"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-error-500">{errors.price.message}</p>
                )}
              </div>
            </div>
            
            {/* Product Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-1">
                Description <span className="text-error-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description', { required: 'Description is required' })}
                className={`block w-full rounded-md border ${errors.description ? 'border-error-300' : 'border-gray-300'} px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="Detailed description of the watch..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-500">{errors.description.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Product Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-1">
                  Category <span className="text-error-500">*</span>
                </label>
                <select
                  id="category"
                  {...register('category', { required: 'Category is required' })}
                  className={`block w-full rounded-md border ${errors.category ? 'border-error-300' : 'border-gray-300'} px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500`}
                >
                  <option value="">Select a category</option>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-error-500">{errors.category.message}</p>
                )}
              </div>
              
              {/* Bestseller Checkbox */}
              <div className="flex items-center h-full pt-6">
                <input
                  id="isBestseller"
                  type="checkbox"
                  {...register('isBestseller')}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isBestseller" className="ml-2 text-sm font-medium text-secondary-700">
                  Add to Bestsellers
                </label>
              </div>
            </div>
            
            {/* Image Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Product Image <span className="text-error-500">*</span>
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="mb-4">
                    <div className="relative group inline-block">
                      <img
                        src={previewUrl}
                        alt="Product preview"
                        className="h-48 w-48 object-cover rounded-md mx-auto"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-error-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center h-32 cursor-pointer"
                  >
                    <Upload className="h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Click to upload a product image
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      (PNG, JPG, JPEG up to 5MB)
                    </p>
                  </label>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;