import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Truck } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
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
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  orderItems?: OrderItem[];
  items?: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCloseModal = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const handleMarkAsPaid = async (orderId: string) => {
    try {
      // Create a payment result object with the necessary fields
      const paymentResult = {
        id: `manual-payment-${Date.now()}`,
        status: 'completed',
        update_time: new Date().toISOString(),
        email: 'admin@example.com' // Fallback email for manual payments
      };
      
      await api.put(`/api/orders/${orderId}/pay`, paymentResult);
      
      // Refresh orders after updating
      const response = await api.get('/api/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error marking order as paid:', err);
    }
  };

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      console.log(`Marking order ${orderId} as delivered`);
      const deliverResponse = await api.put(`/api/orders/${orderId}/deliver`);
      console.log('Deliver response:', deliverResponse.data);
      
      // Refresh orders after updating
      const response = await api.get('/api/orders');
      console.log('Updated orders:', response.data);
      
      // Update the orders state with the new data
      setOrders(response.data);
      
      // Show success message
      alert('Order marked as delivered successfully');
    } catch (err: any) {
      console.error('Error marking order as delivered:', err);
      alert(`Error marking order as delivered: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Orders Management</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{order._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.user ? (
                          <>
                            <div>{order.user.firstName} {order.user.lastName}</div>
                            <div className="text-xs text-gray-500">{order.user.email}</div>
                          </>
                        ) : (
                          <span className="text-gray-500">Unknown user</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{order.totalPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isDelivered ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Delivered
                          </span>
                        ) : order.isPaid ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Paid
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View Order"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          {!order.isPaid && (
                            <button
                              onClick={() => handleMarkAsPaid(order._id)}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Paid"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          )}
                          {order.isPaid && !order.isDelivered && (
                            <button
                              onClick={() => handleMarkAsDelivered(order._id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Mark as Delivered"
                            >
                              <Truck className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
        
        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Order #{selectedOrder._id.slice(-6)}</h2>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">Name:</span> {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">Email:</span> {selectedOrder.user?.email}
                    </p>
                  </div>
                </div>
                
                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Order Items</h3>
                  <div className="overflow-hidden border border-gray-200 rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(selectedOrder.orderItems || selectedOrder.items || []).map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-100 overflow-hidden">
                                  <img 
                                    src={item.image || '/placeholder-image.jpg'} 
                                    alt={item.name} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Shipping & Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Shipping Address</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-sm text-gray-800">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                      <p className="text-sm text-gray-800">{selectedOrder.shippingAddress.address}</p>
                      <p className="text-sm text-gray-800">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                      <p className="text-sm text-gray-800">{selectedOrder.shippingAddress.country}</p>
                      <p className="text-sm text-gray-800 mt-2">
                        <span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.phone}
                      </p>
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">Email:</span> {selectedOrder.shippingAddress.email}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Payment Information</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">Method:</span> {selectedOrder.paymentMethod}
                      </p>
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">Status:</span> {selectedOrder.isPaid ? 'Paid' : 'Not Paid'}
                      </p>
                      {selectedOrder.isPaid && selectedOrder.paidAt && (
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">Paid on:</span> {new Date(selectedOrder.paidAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm font-medium text-gray-900">₹{selectedOrder.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Shipping</span>
                      <span className="text-sm font-medium text-gray-900">Free</span>
                    </div>
                    <div className="flex justify-between py-1 border-t border-gray-200 mt-2 pt-2">
                      <span className="text-base font-medium text-gray-900">Total</span>
                      <span className="text-base font-medium text-gray-900">₹{selectedOrder.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 border-t pt-4">
                  {!selectedOrder.isPaid && (
                    <button
                      onClick={() => {
                        handleMarkAsPaid(selectedOrder._id);
                        handleCloseModal();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Mark as Paid
                    </button>
                  )}
                  {selectedOrder.isPaid && !selectedOrder.isDelivered && (
                    <button
                      onClick={() => {
                        handleMarkAsDelivered(selectedOrder._id);
                        handleCloseModal();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;