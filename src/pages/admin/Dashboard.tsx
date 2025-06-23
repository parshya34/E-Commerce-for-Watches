import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, Users, ShoppingBag, DollarSign, TrendingUp, PlusCircle } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../utils/api';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Using our authenticated API utility
        const response = await api.get('/api/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Use mock data for demo purposes
        setStats({
          totalOrders: 128,
          totalProducts: 45,
          totalUsers: 312,
          totalRevenue: 456000,
          recentOrders: [
            { _id: '1', user: { email: 'john@example.com' }, totalAmount: 12500, status: 'Delivered', date: '2023-06-15' },
            { _id: '2', user: { email: 'sarah@example.com' }, totalAmount: 8700, status: 'Shipped', date: '2023-06-14' },
            { _id: '3', user: { email: 'mike@example.com' }, totalAmount: 24300, status: 'Packing', date: '2023-06-13' },
            { _id: '4', user: { email: 'lisa@example.com' }, totalAmount: 6500, status: 'Order placed', date: '2023-06-12' },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-semibold text-secondary-900 mb-6">Dashboard</h1>
          
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          )}
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-secondary-600">Total Orders</h2>
                  <p className="text-2xl font-semibold text-secondary-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            
            {/* Total Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-accent-100 text-accent-600">
                  <BarChart className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-secondary-600">Products</h2>
                  <p className="text-2xl font-semibold text-secondary-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
            
            {/* Total Users */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-success-100 text-success-500">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-secondary-600">Users</h2>
                  <p className="text-2xl font-semibold text-secondary-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            
            {/* Total Revenue */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-warning-100 text-warning-500">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-secondary-600">Revenue</h2>
                  <p className="text-2xl font-semibold text-secondary-900">
                    ₹{stats.totalRevenue.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-medium text-secondary-900">Recent Orders</h2>
              </div>
              <div className="p-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">
                          {order.user.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">
                          ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${order.status === 'Delivered' ? 'bg-success-100 text-success-800' : 
                              order.status === 'Shipped' ? 'bg-primary-100 text-primary-800' :
                              order.status === 'Packing' ? 'bg-warning-100 text-warning-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">
                          {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-medium text-secondary-900">Sales Statistics</h2>
              </div>
              <div className="p-6 flex justify-center items-center h-64">
                <div className="text-center text-secondary-500">
                  <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Sales charts will be available when you have more data.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-medium text-secondary-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/admin/add-product"
                  className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition"
                >
                  <PlusCircle className="h-6 w-6 text-primary-600 mr-3" />
                  <span className="text-primary-800 font-medium">Add New Product</span>
                </a>
                <a
                  href="/admin/orders"
                  className="flex items-center p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition"
                >
                  <ShoppingBag className="h-6 w-6 text-accent-600 mr-3" />
                  <span className="text-accent-800 font-medium">View Orders</span>
                </a>
                <a
                  href="/"
                  className="flex items-center p-4 bg-success-50 rounded-lg hover:bg-success-100 transition"
                >
                  <TrendingUp className="h-6 w-6 text-success-600 mr-3" />
                  <span className="text-success-800 font-medium">Visit Store</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;