/**
 * Export Utilities - Merkezi Excel/CSV/Print fonksiyonları
 * Tüm admin modülleri için tekrar kullanılabilir export işlemleri
 */

/**
 * Excel/CSV formatında veri dışa aktarma
 * @param {Array} data - Dışa aktarılacak veri dizisi
 * @param {String} filename - Dosya adı (uzantı olmadan)
 * @param {Array} columns - Kolon tanımları [{key: 'id', label: 'ID'}, ...]
 */
export const exportToExcel = (data, filename, columns) => {
  if (!data || data.length === 0) {
    alert('Dışa aktarılacak veri bulunamadı!');
    return;
  }

  // CSV header oluştur
  const headers = columns.map(col => col.label).join(',');
  
  // CSV rows oluştur
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key];
      
      // Format fonksiyonu varsa uygula
      if (col.format && typeof col.format === 'function') {
        value = col.format(value, item);
      }
      
      // String'e çevir ve virgülleri temizle
      value = String(value || '').replace(/,/g, ';');
      
      return `"${value}"`;
    }).join(',');
  }).join('\n');

  // CSV içeriği
  const csvContent = `${headers}\n${rows}`;

  // Blob oluştur ve indir
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * JSON formatında veri dışa aktarma
 * @param {Array} data - Dışa aktarılacak veri dizisi
 * @param {String} filename - Dosya adı
 */
export const exportToJSON = (data, filename) => {
  if (!data || data.length === 0) {
    alert('Dışa aktarılacak veri bulunamadı!');
    return;
  }

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Veriyi yazdırma
 * @param {Array} data - Yazdırılacak veri dizisi
 * @param {String} title - Sayfa başlığı
 * @param {Array} columns - Kolon tanımları
 */
export const printData = (data, title, columns) => {
  if (!data || data.length === 0) {
    alert('Yazdırılacak veri bulunamadı!');
    return;
  }

  // HTML tablosu oluştur
  const tableHeaders = columns.map(col => `<th style="padding: 12px; border: 1px solid #ddd; background: #f8f9fa; text-align: left;">${col.label}</th>`).join('');
  
  const tableRows = data.map(item => {
    const cells = columns.map(col => {
      let value = item[col.key];
      if (col.format && typeof col.format === 'function') {
        value = col.format(value, item);
      }
      return `<td style="padding: 12px; border: 1px solid #ddd;">${value || '-'}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  // Print window
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          padding: 20px;
          color: #333;
        }
        h1 { 
          color: #2c3e50; 
          border-bottom: 3px solid #3498db; 
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        @media print {
          body { padding: 10px; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p style="color: #7f8c8d; margin-bottom: 20px;">Yazdırma Tarihi: ${new Date().toLocaleString('tr-TR')}</p>
      <table>
        <thead>
          <tr>${tableHeaders}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // Print dialog'u aç
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
