/**
 * Utility functions for handling image URLs
 */

// Get the base API URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Formats an image URL to ensure it's properly accessible
 * Handles both new format (single image) and old format (images array)
 * 
 * @param image Image path or URL
 * @returns Properly formatted image URL
 */
export const getImageUrl = (image?: string | null): string => {
  if (!image) {
    return '/placeholder-image.jpg';
  }
  
  // If the image is already a full URL, return it as is
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  
  // If the image is a relative path starting with /uploads, prepend the API base URL
  if (image.startsWith('/uploads/')) {
    return `${API_BASE_URL}${image}`;
  }
  
  // Otherwise, assume it's a relative path and prepend /uploads/ and API base URL
  return `${API_BASE_URL}/uploads/${image}`;
};

/**
 * Gets the image URL from a product, handling both new and old formats
 * 
 * @param product Product object that may have image or images property
 * @returns Properly formatted image URL
 */
export const getProductImageUrl = (product: any): string => {
  // Check for new format (single image)
  if (product.image) {
    return getImageUrl(product.image);
  }
  
  // Check for old format (images array)
  if (product.images && product.images.length > 0) {
    return getImageUrl(product.images[0]);
  }
  
  // Fallback to placeholder
  return '/placeholder-image.jpg';
};
