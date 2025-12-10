import React from 'react';
import { FaThLarge, FaList, FaChevronDown } from 'react-icons/fa';
// styles.js dosyasını düzelttiğimiz için artık bu import sorunsuz çalışır
import { styles } from '../styles'; 

// --- HATA ÇÖZÜMÜ ---
// Aşağıda 'export const SortBar' diyerek "Named Export" yapıyoruz.
// Bu sayede index.js dosyası { SortBar } şeklinde aradığında bulabilecek.

export const SortBar = ({ 
  productCount = 0, 
  viewMode, 
  setViewMode, 
  sortOption, 
  setSortOption 
}) => {
  return (
    <div style={styles.toolbar}>
      
      {/* Sol Taraf: Ürün Sayısı */}
      <div style={styles.resultCount}>
        Toplam <span style={styles.resultNumber}>{productCount}</span> ürün bulundu
      </div>

      {/* Sağ Taraf: Kontroller */}
      <div style={styles.controlsRight}>
        
        {/* Sıralama Seçimi */}
        <div style={styles.sortWrapper}>
          <select 
            style={styles.sortSelect} 
            value={sortOption} 
            onChange={(e) => setSortOption && setSortOption(e.target.value)}
          >
            <option value="featured">Öne Çıkanlar</option>
            <option value="priceAsc">En Düşük Fiyat</option>
            <option value="priceDesc">En Yüksek Fiyat</option>
            <option value="newest">En Yeniler</option>
          </select>
          <FaChevronDown style={styles.sortIcon} />
        </div>

        {/* Görünüm Değiştirme (Izgara / Liste) */}
        <div style={styles.viewToggle}>
          <button 
            style={viewMode === 'grid' ? styles.viewBtnActive : styles.viewBtn} 
            onClick={() => setViewMode && setViewMode('grid')}
            title="Izgara Görünüm"
          >
            <FaThLarge size={16} />
          </button>
          <button 
            style={viewMode === 'list' ? styles.viewBtnActive : styles.viewBtn} 
            onClick={() => setViewMode && setViewMode('list')}
            title="Liste Görünüm"
          >
            <FaList size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

// Hem Named hem Default export veriyoruz ki her türlü çalışsın.
export default SortBar;