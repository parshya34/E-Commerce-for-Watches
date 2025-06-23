import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuthStore } from './store/authStore';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy-loaded components
const HomePage = lazy(() => import('./pages/client/HomePage.tsx'));
const ProductPage = lazy(() => import('./pages/client/ProductPage.tsx'));
const CartPage = lazy(() => import('./pages/client/CartPage.tsx'));
const CheckoutPage = lazy(() => import('./pages/client/CheckoutPage.tsx'));
const LoginPage = lazy(() => import('./pages/client/LoginPage.tsx'));
const RegisterPage = lazy(() => import('./pages/client/RegisterPage.tsx'));
const CollectionPage = lazy(() => import('./pages/client/CollectionPage.tsx'));
const AboutPage = lazy(() => import('./pages/client/AboutPage.tsx'));
const ContactPage = lazy(() => import('./pages/client/ContactPage.tsx'));
const OrderSuccessPage = lazy(() => import('./pages/client/OrderSuccess.tsx'));
const UserProfilePage = lazy(() => import('./pages/client/UserProfilePage.tsx'));
const ForgotPasswordPage = lazy(() => import('./pages/client/ForgotPasswordPage.tsx'));

// Admin pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage.tsx'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.tsx'));
const AdminAddProduct = lazy(() => import('./pages/admin/AddProduct.tsx'));
const AdminListProducts = lazy(() => import('./pages/admin/ListProducts.tsx'));
const AdminOrders = lazy(() => import('./pages/admin/Orders.tsx'));

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin protected route
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuthStore();
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Client routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product-detail" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-success" 
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/add-product" 
          element={
            <AdminProtectedRoute>
              <AdminAddProduct />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <AdminProtectedRoute>
              <AdminListProducts />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <AdminProtectedRoute>
              <AdminOrders />
            </AdminProtectedRoute>
          } 
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;