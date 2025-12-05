import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- LAYOUTS (DÜZENLER) ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout'; // Sidebar yapısı burada
import UserLayout from './components/UserLayout'; // User panel layout
import PublicLayout from './components/PublicLayout'; // Public layout wrapper

// --- GÜVENLİK ---
import AdminPrivateRoute from './components/AdminPrivateRoute'; 

// --- SAYFALAR ---
// 1. Müşteri Sayfaları
import Home from './pages/public/Home';
import CategoryProducts from './pages/public/CategoryProducts';
import ProductDetail from './pages/public/ProductDetail';
import Login from './pages/public/Login'; // Müşteri Girişi
import Register from './pages/public/Register'; // Müşteri Kayıt
import Favorites from './pages/user/Favorites'; // Favorilerim Sayfası
import Cart from './pages/user/Cart'; // Sepet Sayfası
import UserProfile from './pages/user/UserProfile'; // Kullanıcı Profil
import UserAddresses from './pages/user/UserAddresses'; // Kullanıcı Adresleri
import PaymentSuccess from './pages/user/PaymentSuccess'; // Ödeme Başarılı
import PaymentFailed from './pages/user/PaymentFailed'; // Ödeme Başarısız
import UserOrders from './pages/user/UserOrders'; // Kullanıcı Siparişleri

// 2. Admin Sayfaları (Senin klasör yapına göre: src/pages/admin/...)
import AdminLogin from './pages/admin/AdminLogin'; // Admin Girişi
import Dashboard from './pages/admin/Dashboard';   // Admin Paneli
import VendorsPage from './pages/admin/VendorsPage'; // Satıcı Yönetimi (UNUSED NOW, replaced by FullApplicationsPage)
import ActiveVendorsPage from './pages/admin/ActiveVendorsPage'; // Aktif Satıcılar
import AdminsPage from './pages/admin/AdminsPage'; // Yönetici Yönetimi
import UsersPage from './pages/admin/UsersPage'; // Kullanıcı Yönetimi

// Modüler Admin Sayfaları
import { FullApplicationsPage, VendorApplicationsPage } from './pages/admin/Applications';
import CommissionPlans from './pages/admin/CommissionPlans';
import ProductsPage from './pages/admin/Products';
import CategoriesPage from './pages/admin/Categories';

// 3. Satıcı Sayfaları
import VendorLogin from './pages/vendor/VendorLogin';
import VendorRegister from './pages/vendor/VendorRegister';
import VendorFullApplication from './pages/vendor/VendorFullApplication';
import VendorStatusPage from './pages/vendor/VendorStatusPage';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorOnboarding from './pages/vendor/VendorOnboarding';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorFinance from './pages/vendor/VendorFinance';
import VendorSettings from './pages/vendor/VendorSettings';
import VendorShipping from './pages/vendor/VendorShipping';
import VendorPromotions from './pages/vendor/VendorPromotions';
import VendorLayout from './components/VendorLayout';
import VendorCategories from './pages/vendor/VendorCategories';

// QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <FavoritesProvider>
            <CartProvider>
              <Router>
                <div className="App">
                  {/* Not: Navbar'ı buradan kaldırdık, aşağıda sadece müşteri sayfalarına ekledik */}
                  
                  <Routes>
              
              {/* ======================================= */}
              {/* 1. MÜŞTERİ BÖLÜMÜ (Navbar GÖRÜNSÜN)     */}
              {/* ======================================= */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<CategoryProducts />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/odeme/basarili" element={<PaymentSuccess />} />
                <Route path="/odeme/basarisiz" element={<PaymentFailed />} />
              </Route>


              {/* ======================================= */}
              {/* 2. ADMIN GİRİŞ (Sade Sayfa, Navbar YOK) */}
              {/* ======================================= */}
              <Route path="/admin/login" element={<AdminLogin />} />


              {/* ======================================= */}
              {/* 3. GÜVENLİ ADMIN PANELİ (Sidebar VAR)   */}
              {/* ======================================= */}
              
              {/* AŞAMA 1: Güvenlik Kontrolü (Token var mı?) */}
              <Route element={<AdminPrivateRoute />}>
                
                {/* AŞAMA 2: Tasarım Kontrolü (Sidebar gelsin) */}
                <Route element={<AdminLayout />}>
                  
                  {/* İçerik: Dashboard */}
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/active-vendors" element={<ActiveVendorsPage />} />
                  <Route path="/admin/vendors" element={<FullApplicationsPage />} />
                  <Route path="/admin/vendor-applications" element={<VendorApplicationsPage />} />
                  <Route path="/admin/commission-plans" element={<CommissionPlans />} />
                  <Route path="/admin/products" element={<ProductsPage />} />
                  <Route path="/admin/categories" element={<CategoriesPage />} />
                  <Route path="/admin/admins" element={<AdminsPage />} />
                  <Route path="/admin/users" element={<UsersPage />} />
                  
                </Route>

              </Route>

              {/* ======================================= */}
              {/* 4. SATICI (VENDOR) BÖLÜMÜ               */}
              {/* ======================================= */}
              <Route path="/vendor/login" element={<VendorLogin />} />
              <Route path="/vendor/register" element={<VendorRegister />} />
              <Route path="/vendor/application" element={<VendorFullApplication />} />
              <Route path="/vendor/full-application" element={<VendorFullApplication />} />
              <Route path="/vendor/status" element={<VendorStatusPage />} />
              <Route path="/vendor/onboarding" element={<VendorOnboarding />} />

              <Route path="/vendor" element={<VendorLayout />}>
                 <Route path="dashboard" element={<VendorDashboard />} />
                 <Route path="products" element={<VendorProducts />} />
                 <Route path="categories" element={<VendorCategories />} />
                 <Route path="orders" element={<VendorOrders />} />
                 <Route path="finance" element={<VendorFinance />} />
                 <Route path="shipping" element={<VendorShipping />} />
                 <Route path="promotions" element={<VendorPromotions />} />
                 <Route path="settings" element={<VendorSettings />} />
              </Route>

              {/* ======================================= */}
              {/* 5. KULLANICI HESABI (USER ACCOUNT)      */}
              {/* ======================================= */}
              <Route path="/account" element={<UserLayout />}>
                <Route path="profile" element={<UserProfile />} />
                <Route path="addresses" element={<UserAddresses />} />
                <Route path="orders" element={<UserOrders />} />
                {/* İleride eklenecekler */}
                {/* <Route path="favorites" element={<UserFavorites />} /> */}
                {/* <Route path="reviews" element={<UserReviews />} /> */}
              </Route>

              </Routes>
              </div>
            </Router>
          </CartProvider>
        </FavoritesProvider>
      </ToastProvider>
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;