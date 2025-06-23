import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Package, ChevronRight } from 'lucide-react';
import api from '../../utils/api';

interface Order {
  _id: string;
  items?: Array<{
    name: string;
    quantity: number;
    image: string;
    price: number;
  }>;
  orderItems?: Array<{
    name: string;
    quantity: number;
    image: string;
    price: number;
  }>;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

const UserProfilePage = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Only fetch orders if user is authenticated
        if (!user || !user._id) {
          setError('Please log in to view your orders');
          setLoading(false);
          return;
        }
        
        setLoading(true);
        const response = await api.get('/api/orders/myorders');
        setOrders(response.data);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        // Provide more specific error messages based on the error
        if (err.response && err.response.status === 401) {
          setError('Your session has expired. Please log in again to view your orders.');
        } else {
          setError('Failed to load your orders. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="mt-1 text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <p className="mt-1 text-gray-900">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || user?.lastName || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update Profile
                  </button>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-4"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
                    <Link 
                      to="/collection" 
                      className="inline-flex items-center text-primary-600 hover:text-primary-800"
                    >
                      Browse our collection
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              #{order._id.slice(-6)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{order.totalPrice.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {order.isDelivered ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Delivered
                                </span>
                              ) : order.isPaid ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Processing
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <Link 
                                to={`/order/${order._id}`} 
                                className="text-primary-600 hover:text-primary-900"
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default UserProfilePage;