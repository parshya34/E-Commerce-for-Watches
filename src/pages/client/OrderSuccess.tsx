import { useEffect, useState } from 'react';
import { CheckCircle, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';

interface OrderItem {
  product: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  items?: OrderItem[];
  orderItems?: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
}

const OrderSuccess = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderId = localStorage.getItem('lastOrderId');
        
        if (!orderId) {
          setError('Order information not found');
          setLoading(false);
          return;
        }
        
        const response = await api.get(`/api/orders/${orderId}`);
        console.log('Order response:', response.data);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link
                to="/"
                className="inline-block bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Successful!</h1>
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase. Your order #{order?._id.slice(-6)} has been successfully placed and is being processed.
                </p>
                
                <div className="flex justify-center space-x-4 mt-8">
                  <Link
                    to="/profile"
                    className="inline-block bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    View All Orders
                  </Link>
                  <Link
                    to="/collection"
                    className="inline-block bg-gray-100 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
              
              {/* Order Details */}
              {order && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Details</h2>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Items Ordered</h3>
                      <div className="space-y-4">
                        {(order.items || order.orderItems || []).map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                              <img 
                                src={item.image || '/placeholder-image.jpg'} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-800">₹{item.price.toLocaleString('en-IN')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Shipping & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Shipping Address</h3>
                        <div className="bg-gray-50 p-4 rounded">
                          <div className="flex items-start space-x-2">
                            <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-800">{order.shippingAddress.address}</p>
                              <p className="text-sm text-gray-800">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                              <p className="text-sm text-gray-800">{order.shippingAddress.country}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Payment Method</h3>
                        <div className="bg-gray-50 p-4 rounded">
                          <p className="text-sm text-gray-800">{order.paymentMethod}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {order.isPaid ? 
                              `Paid on ${new Date(order.paidAt!).toLocaleDateString()}` : 
                              'Payment pending'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Order Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="text-sm font-medium text-gray-800">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-600">Shipping</p>
                          <p className="text-sm font-medium text-gray-800">Free</p>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <p className="text-base font-medium text-gray-800">Total</p>
                          <p className="text-base font-medium text-gray-800">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;