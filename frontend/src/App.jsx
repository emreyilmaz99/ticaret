import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- LAYOUTS (DÜZENLER) ---
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout'; // Sidebar yapısı burada

// --- GÜVENLİK ---
import AdminPrivateRoute from './components/AdminPrivateRoute'; 

// --- SAYFALAR ---
// 1. Müşteri Sayfaları
import Home from './pages/Home';
import Login from './pages/Login'; // Müşteri Girişi (Dosya: src/pages/Login.jsx)

// 2. Admin Sayfaları (Senin klasör yapına göre: src/pages/admin/...)
import AdminLogin from './pages/admin/AdminLogin'; // Admin Girişi
import Dashboard from './pages/admin/Dashboard';   // Admin Paneli
import VendorsPage from './pages/admin/VendorsPage'; // Satıcı Yönetimi
import AdminsPage from './pages/admin/AdminsPage'; // Yönetici Yönetimi

function App() {
  return (
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
            </>
          } />
          
          <Route path="/login" element={
            <>
              <Navbar />
              <Login />
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
              <Route path="/admin/vendors" element={<VendorsPage />} />
              <Route path="/admin/admins" element={<AdminsPage />} />
              
              {/* İleride eklenecekler buraya gelecek */}
              {/* <Route path="/admin/products" element={<ProductList />} /> */}

            </Route>

          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;