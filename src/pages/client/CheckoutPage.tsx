import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { Phone, CreditCard } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: ''
  });
  
  // Initialize form data and check for redirects
  useEffect(() => {
    // Restore form data if available in session storage
    const savedFormData = sessionStorage.getItem('checkout-form-data');
    if (savedFormData) {
      try {
        const parsedFormData = JSON.parse(savedFormData);
        setFormData(prevData => ({
          ...prevData,
          ...parsedFormData
        }));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
    
    // Restore payment method if available
    const savedPaymentMethod = sessionStorage.getItem('checkout-payment-method');
    if (savedPaymentMethod) {
      setPaymentMethod(savedPaymentMethod);
    }
    
    // Check if user is returning from WhatsApp
    const whatsappRedirect = sessionStorage.getItem('whatsappRedirect');
    if (whatsappRedirect === 'true') {
      // Check if user is authenticated
      if (!user || !user._id) {
        toast.error('Your session has expired. Please log in again to complete your order.');
        navigate('/login', { state: { from: '/checkout' } });
        return;
      }
      
      setShowConfirmation(true);
      setShowPaymentOptions(true);
      sessionStorage.removeItem('whatsappRedirect');
    }
    
    // Cleanup function
    return () => {
      // Don't clear session storage on unmount unless navigating to success page
      // This allows the data to persist if the user is redirected to login
      if (window.location.pathname === '/order-success') {
        sessionStorage.removeItem('checkout-form-data');
        sessionStorage.removeItem('checkout-payment-method');
        sessionStorage.removeItem('whatsappRedirect');
      }
    };
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmitShippingInfo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    
    // Show payment options
    setShowPaymentOptions(true);
  };
  
  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    
    if (method === 'Confirm your payment from WhatsApp') {
      // Check if user is authenticated
      if (!user || !user._id) {
        toast.error('You must be logged in to place an order. Please log in and try again.');
        navigate('/login', { state: { from: '/checkout' } });
        return;
      }
      
      // Store form data and cart information in session storage
      sessionStorage.setItem('checkout-form-data', JSON.stringify(formData));
      sessionStorage.setItem('checkout-payment-method', method);
      
      // Store information that we're redirecting to WhatsApp
      sessionStorage.setItem('whatsappRedirect', 'true');
      
      // Open WhatsApp with the specified number
      const whatsappNumber = '919136771025';
      const message = `Hello, I would like to confirm my order. My details:\n\nName: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nTotal Amount: ₹${totalAmount().toLocaleString('en-IN')}\n\nItems:\n${items.map(item => `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n')}`;
      
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      // Proceed with order placement for Cash on Delivery
      handlePlaceOrder();
    }
  };
  
  const handleConfirmation = (confirmed: boolean) => {
    setShowConfirmation(false);
    
    if (confirmed) {
      handlePlaceOrder();
    }
  };
  
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      if (!user || !user._id) {
        toast.error('You must be logged in to place an order. Please log in and try again.');
        navigate('/login', { state: { from: '/checkout' } });
        return;
      }
      
      // Format order items for the backend
      const orderItems = items.map(item => ({
        product: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      }));
      
      // Calculate total
      const total = totalAmount();
      
      // Create order object
      const orderData = {
        items: orderItems,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: paymentMethod,
        totalPrice: total
      };
      
      // Submit order to backend
      const response = await api.post('/api/orders', orderData);
      console.log('Order created:', response.data);
      
      // Clear cart after successful order
      clearCart();
      
      // Store order ID in localStorage for reference on the success page
      localStorage.setItem('lastOrderId', response.data._id);
      
      // Clear checkout session storage after successful order
      sessionStorage.removeItem('checkout-form-data');
      sessionStorage.removeItem('checkout-payment-method');
      sessionStorage.removeItem('whatsappRedirect');
      
      // Navigate to success page
      navigate('/order-success');
      
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Check if it's an authentication error
      if ((error as any).response && ((error as any).response.status === 401 || (error as any).response.status === 403)) {
        toast.error('Authentication error. Please log in again.');
        navigate('/login', { state: { from: '/checkout' } });
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-800">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">Total</p>
                  <p className="font-semibold text-gray-800">₹{totalAmount().toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmitShippingInfo} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    id="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : showPaymentOptions ? 'Continue to Payment' : 'Continue to Payment'}
              </Button>
            </div>
            
            {/* Payment Options */}
            {showPaymentOptions && (
              <div className="mt-8 border-t pt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-colors ${paymentMethod === 'Cash on Delivery' ? 'border-primary-500 bg-primary-50' : ''}`}
                    onClick={() => handlePaymentMethodSelect('Cash on Delivery')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${paymentMethod === 'Cash on Delivery' ? 'border-primary-500' : 'border-gray-400'}`}>
                        {paymentMethod === 'Cash on Delivery' && <div className="w-3 h-3 rounded-full bg-primary-500"></div>}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when your order is delivered</p>
                      </div>
                      <CreditCard className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-colors ${paymentMethod === 'Confirm your payment from WhatsApp' ? 'border-primary-500 bg-primary-50' : ''}`}
                    onClick={() => handlePaymentMethodSelect('Confirm your payment from WhatsApp')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${paymentMethod === 'Confirm your payment from WhatsApp' ? 'border-primary-500' : 'border-gray-400'}`}>
                        {paymentMethod === 'Confirm your payment from WhatsApp' && <div className="w-3 h-3 rounded-full bg-primary-500"></div>}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Confirm your payment from WhatsApp</p>
                        <p className="text-sm text-gray-500">Chat with us on WhatsApp to confirm your payment</p>
                      </div>
                      <Phone className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="button" 
                    className="w-full" 
                    disabled={loading}
                    onClick={() => handlePaymentMethodSelect(paymentMethod)}
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            )}
            
            {/* WhatsApp Confirmation Dialog */}
            {showConfirmation && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-semibold mb-4">Confirm Your Order</h3>
                  <p className="mb-6">Is your order confirmed with the seller on WhatsApp?</p>
                  <div className="flex space-x-4">
                    <Button 
                      type="button" 
                      variant="secondary"
                      className="flex-1" 
                      onClick={() => handleConfirmation(false)}
                    >
                      No
                    </Button>
                    <Button 
                      type="button" 
                      className="flex-1" 
                      onClick={() => handleConfirmation(true)}
                    >
                      Yes, Confirm Order
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default CheckoutPage;