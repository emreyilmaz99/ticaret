import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // api.js'i çağırdık

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Sayfa açılınca Admin bilgilerini çek (/api/v1/admin/me senaryosu)
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Token otomatik ekleniyor (interceptor sayesinde)
        // Arkadaşının endpoint'i: '/user' veya '/admin/me' olabilir. Kontrol et.
        const response = await api.get('/user'); 
        setUser(response.data);
      } catch (error) {
        console.error("Yetkisiz erişim:", error);
        // Token geçersizse çıkış yap
        handleLogout();
      }
    };
    
    // fetchAdminData(); // Backend hazır olunca burayı açacağız
  }, []);

  const handleLogout = async () => {
    try {
      // 1. Backend'e haber ver (Opsiyonel ama önerilir)
      // await api.post('/logout'); 
    } catch (error) {
      console.log("Çıkış hatası", error);
    } finally {
      // 2. Frontend temizliği (KESİN YAPILMALI)
      localStorage.removeItem('admin_token');
      // 3. Giriş sayfasına yönlendir
      navigate('/admin/login');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Yönetici Paneli</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Çıkış Yap
        </button>
      </div>
      
      <p>Hoş geldin, {user ? user.name : 'Admin'}!</p>
      
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
        <h3>İstatistikler</h3>
        <p>Burada grafikler ve kullanıcı sayıları olacak.</p>
      </div>
    </div>
  );
};

export default Dashboard;