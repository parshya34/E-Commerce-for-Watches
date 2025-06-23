import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  List, 
  Package, 
  LayoutDashboard, 
  LogOut, 
  Watch 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  return (
    <div className="min-h-screen bg-secondary-900 text-white w-64 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-secondary-700">
        <div className="flex items-center space-x-2">
          <Watch className="h-8 w-8 text-accent-400" />
          <span className="text-xl font-serif font-semibold">Chrono Admin</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary-700 text-white'
                    : 'text-gray-300 hover:bg-secondary-800 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/add-product"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary-700 text-white'
                    : 'text-gray-300 hover:bg-secondary-800 hover:text-white'
                }`
              }
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Product</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary-700 text-white'
                    : 'text-gray-300 hover:bg-secondary-800 hover:text-white'
                }`
              }
            >
              <List className="h-5 w-5" />
              <span>List Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary-700 text-white'
                    : 'text-gray-300 hover:bg-secondary-800 hover:text-white'
                }`
              }
            >
              <Package className="h-5 w-5" />
              <span>Orders</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      {/* Logout */}
      <div className="p-4 border-t border-secondary-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg transition text-gray-300 hover:bg-secondary-800 hover:text-white w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;