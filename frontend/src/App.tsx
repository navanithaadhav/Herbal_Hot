import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import OrderRedirect from './components/OrderRedirect';
import PrivateRoute from './components/PrivateRoute';
import { Loader2 } from 'lucide-react';

// Lazy Load Pages
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserListPage = lazy(() => import('./pages/admin/UserListPage'));
const OrderListPage = lazy(() => import('./pages/admin/OrderListPage'));
const ReviewListPage = lazy(() => import('./pages/admin/ReviewListPage'));
const ShippingPage = lazy(() => import('./pages/ShippingPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const PlaceOrderPage = lazy(() => import('./pages/PlaceOrderPage'));
const AdminProductListPage = lazy(() => import('./pages/admin/ProductListPage'));
const ProductEditPage = lazy(() => import('./pages/admin/ProductEditPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const AddressBookPage = lazy(() => import('./pages/AddressBookPage'));

const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <Loader2 className="animate-spin text-yellow-600 h-12 w-12" />
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/:id" element={<ProductDetailsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="shipping" element={<ShippingPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="placeorder" element={<PlaceOrderPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="order/:id" element={<PrivateRoute><OrderRedirect /></PrivateRoute>} />
            <Route path="addresses" element={<PrivateRoute><AddressBookPage /></PrivateRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="userlist" element={<UserListPage />} />
            <Route path="productlist" element={<AdminProductListPage />} />
            <Route path="product/:id/edit" element={<ProductEditPage />} />
            <Route path="orderlist" element={<OrderListPage />} />
            <Route path="reviewlist" element={<ReviewListPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
