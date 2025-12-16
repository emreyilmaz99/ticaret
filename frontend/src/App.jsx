import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';

// --- LAYOUTS (DÜZENLER) ---
import Navbar from './components/navigation/Navbar';
import Footer from './components/common/Footer';
import AdminLayout from './components/layouts/AdminLayout'; // Sidebar yapısı burada
import UserLayout from './components/layouts/UserLayout'; // User panel layout
import PublicLayout from './components/layouts/PublicLayout'; // Public layout wrapper

// --- GÜVENLİK ---
import AdminPrivateRoute from './components/admin/AdminPrivateRoute'; 

// --- SAYFALAR ---
// 1. Müşteri Sayfaları (Modüler Yapı)
import Home from './pages/public/Home';
import CategoryProducts from './pages/public/CategoryProducts';
import ProductDetail from './pages/public/ProductDetail';
import VendorStore from './pages/public/VendorStore'; // Satıcı Mağaza Sayfası
import { Login, Register } from './pages/public/Auth'; // Modüler Auth
import Favorites from './pages/user/Favorites'; // Favorilerim Sayfası
import Cart from './pages/user/Cart'; // Sepet Sayfası
import UserProfile from './pages/user/UserProfile'; // Kullanıcı Profil
import UserAddresses from './pages/user/UserAddresses'; // Kullanıcı Adresleri
import PaymentSuccess from './pages/user/PaymentSuccess'; // Ödeme Başarılı
import PaymentFailed from './pages/user/PaymentFailed'; // Ödeme Başarısız
import UserOrders from './pages/user/UserOrders'; // Kullanıcı Siparişleri
import UserOrderDetail from './pages/user/UserOrderDetail'; // Sipariş Detayı
import Invoice from './pages/user/Invoice'; // Fatura

// 2. Admin Sayfaları
import AdminLogin from './pages/admin/AdminLogin'; // Admin Girişi
import Dashboard from './pages/admin/Dashboard';   // Admin Paneli
import ActiveVendorsPage from './pages/admin/ActiveVendorsPage'; // Aktif Satıcılar
import AdminsPage from './pages/admin/AdminsPage'; // Yönetici Yönetimi
import UsersPage from './pages/admin/UsersPage'; // Kullanıcı Yönetimi

// Modüler Admin Sayfaları
import { FullApplicationsPage, VendorApplicationsPage } from './pages/admin/Applications';
import CommissionPlans from './pages/admin/CommissionPlans';
import TaxClasses from './pages/admin/TaxClasses';
import ProductsPage from './pages/admin/Products';
import CategoriesPage from './pages/admin/Categories';
// YENİ EKLENEN: Admin Siparişler Sayfası
import AdminOrders from './pages/admin/Orders';
import FeaturedDealsPage from './pages/admin/FeaturedDeals'; 
import ReviewsPage from './pages/admin/Reviews';

// 3. Satıcı Sayfaları
import VendorLogin from './pages/vendor/Auth/Login';
import VendorRegister from './pages/vendor/Register';
import VendorFullApplication from './pages/vendor/FullApplication';
import VendorStatusPage from './pages/vendor/StatusPage';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorOnboarding from './pages/vendor/Auth/Onboarding';
import VendorProducts from './pages/vendor/Products';
import VendorOrders from './pages/vendor/Orders'; 
import VendorFinance from './pages/vendor/Finance';
import VendorSettings from './pages/vendor/Settings';
import VendorShipping from './pages/vendor/Shipping';
import VendorPromotions from './pages/vendor/Promotions';
import VendorReviews from './pages/vendor/Reviews';
import VendorLayout from './components/layouts/VendorLayout';
import VendorCategories from './pages/vendor/Categories';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <FavoritesProvider>
          <CartProvider>
            <Router>
                <div className="App">
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
                <Route path="/store/:slug" element={<VendorStore />} />
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
                  <Route path="/admin/tax-classes" element={<TaxClasses />} />
                  <Route path="/admin/products" element={<ProductsPage />} />
                  <Route path="/admin/categories" element={<CategoriesPage />} />
                  <Route path="/admin/admins" element={<AdminsPage />} />
                  <Route path="/admin/users" element={<UsersPage />} />
                  
                  {/* YENİ EKLENEN ROTA: SİPARİŞ YÖNETİMİ */}
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  
                  {/* YENİ EKLENEN ROTA: ÖNE ÇIKAN ÜRÜNLER */}
                  <Route path="/admin/featured-deals" element={<FeaturedDealsPage />} />
                  
                  {/* YENİ EKLENEN ROTA: DEĞERLENDİRME YÖNETİMİ */}
                  <Route path="/admin/reviews" element={<ReviewsPage />} />
                  
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
                 <Route path="reviews" element={<VendorReviews />} />
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
                <Route path="orders/:orderNumber" element={<UserOrderDetail />} />
              </Route>

              {/* Fatura Sayfası - Layout dışında tam ekran */}
              <Route path="/invoice/:orderNumber" element={<Invoice />} />

              </Routes>
              </div>
            </Router>
          </CartProvider>
        </FavoritesProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;