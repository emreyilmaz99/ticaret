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

// --- GÜVENLİK ---
import AdminPrivateRoute from './components/AdminPrivateRoute'; 

// --- SAYFALAR ---
// 1. Müşteri Sayfaları
import Home from './pages/public/Home';
import CategoryProducts from './pages/public/CategoryProducts';
import Login from './pages/public/Login'; // Müşteri Girişi
import Register from './pages/public/Register'; // Müşteri Kayıt
import Favorites from './pages/user/Favorites'; // Favorilerim Sayfası
import Cart from './pages/user/Cart'; // Sepet Sayfası
import UserProfile from './pages/user/UserProfile'; // Kullanıcı Profil
import UserAddresses from './pages/user/UserAddresses'; // Kullanıcı Adresleri

// 2. Admin Sayfaları (Senin klasör yapına göre: src/pages/admin/...)
import AdminLogin from './pages/admin/AdminLogin'; // Admin Girişi
import Dashboard from './pages/admin/Dashboard';   // Admin Paneli
import VendorsPage from './pages/admin/VendorsPage'; // Satıcı Yönetimi (UNUSED NOW, replaced by FullApplicationsPage)
import FullApplicationsPage from './pages/admin/FullApplicationsPage'; // Tam Başvurular
import ActiveVendorsPage from './pages/admin/ActiveVendorsPage'; // Aktif Satıcılar
import AdminsPage from './pages/admin/AdminsPage'; // Yönetici Yönetimi
import UsersPage from './pages/admin/UsersPage'; // Kullanıcı Yönetimi
import VendorApplications from './pages/admin/VendorApplications'; // Satıcı Başvuruları
import CommissionPlans from './pages/admin/CommissionPlans'; // Komisyon Planları
import ProductsPage from './pages/admin/ProductsPage'; // Ürün Yönetimi
import CategoriesPage from './pages/admin/CategoriesPage'; // Kategori Yönetimi

// 3. Satıcı Sayfaları
import VendorLogin from './pages/vendor/VendorLogin';
import VendorRegister from './pages/vendor/VendorRegister';
import VendorFullApplication from './pages/vendor/VendorFullApplication';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorOnboarding from './pages/vendor/VendorOnboarding';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorFinance from './pages/vendor/VendorFinance';
import VendorSettings from './pages/vendor/VendorSettings';
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
              <Route path="/" element={
                <>
                  <Navbar />
                  <Home />
                  <Footer />
                </>
              } />
              
              <Route path="/login" element={
                <>
                  <Navbar />
                  <Login />
                  <Footer />
                </>
              } />

              <Route path="/register" element={
                <>
                  <Navbar />
                  <Register />
                  <Footer />
                </>
              } />

              <Route path="/products" element={
                <CategoryProducts />
              } />

              <Route path="/favorites" element={
                <>
                  <Navbar />
                  <Favorites />
                  <Footer />
                </>
              } />

              <Route path="/cart" element={
                <>
                  <Navbar />
                  <Cart />
                  <Footer />
                </>
              } />


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
                  <Route path="/admin/vendor-applications" element={<VendorApplications />} />
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
              <Route path="/vendor/full-application/:id" element={<VendorFullApplication />} />
              <Route path="/vendor/onboarding" element={<VendorOnboarding />} />

              <Route path="/vendor" element={<VendorLayout />}>
                 <Route path="dashboard" element={<VendorDashboard />} />
                 <Route path="products" element={<VendorProducts />} />
                 <Route path="categories" element={<VendorCategories />} />
                 <Route path="orders" element={<VendorOrders />} />
                 <Route path="finance" element={<VendorFinance />} />
                 <Route path="settings" element={<VendorSettings />} />
              </Route>

              {/* ======================================= */}
              {/* 5. KULLANICI HESABI (USER ACCOUNT)      */}
              {/* ======================================= */}
              <Route path="/account" element={<UserLayout />}>
                <Route path="profile" element={<UserProfile />} />
                <Route path="addresses" element={<UserAddresses />} />
                {/* İleride eklenecekler */}
                {/* <Route path="orders" element={<UserOrders />} /> */}
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