// src/pages/admin/Orders/invoiceService.js

/**
 * Sipariş verisini alır ve tarayıcıda yazdırılabilir bir fatura penceresi açar.
 */
export const printInvoice = (order) => {
  if (!order) return;

  const printWindow = window.open('', '_blank', 'width=900,height=800');
  
  if (!printWindow) {
    alert('Pop-up engelleyicisi faturanın açılmasını engelledi. Lütfen izin verin.');
    return;
  }

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const invoiceHTML = `
    <!DOCTYPE html>
    <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Fatura - ${order.id}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .container { max-width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
          
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0F172A; padding-bottom: 20px; margin-bottom: 30px; }
          .brand { font-size: 28px; font-weight: 800; color: #0F172A; letter-spacing: -1px; }
          .invoice-meta { text-align: right; }
          .invoice-meta h3 { margin: 0 0 5px 0; color: #111827; }
          .meta-item { font-size: 14px; color: #6B7280; }

          .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .info-box h4 { font-size: 12px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 8px; letter-spacing: 0.5px; }
          .info-box p { margin: 0; font-size: 14px; color: #1F2937; }
          .info-box .address { max-width: 300px; line-height: 1.5; }

          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { text-align: left; background: #F9FAFB; padding: 12px 16px; border-bottom: 1px solid #E5E7EB; font-size: 12px; text-transform: uppercase; color: #6B7280; }
          td { padding: 16px; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #374151; }
          .col-price { text-align: right; font-weight: 600; }
          .col-qty { text-align: center; }
          .product-name { display: block; font-weight: 600; color: #111827; }
          .product-variant { font-size: 12px; color: #6B7280; }

          .totals-area { display: flex; justify-content: flex-end; margin-top: 30px; }
          .totals-table { width: 300px; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #6B7280; }
          .grand-total { display: flex; justify-content: space-between; padding-top: 15px; margin-top: 10px; border-top: 2px solid #E5E7EB; font-size: 18px; font-weight: 800; color: #0F172A; }

          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 20px; }
          
          @media print {
            body { padding: 0; }
            .container { border: none; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">TicaretPanel</div>
            <div class="invoice-meta">
              <h3>SİPARİŞ ÖZETİ</h3>
              <div class="meta-item">No: <strong>${order.id}</strong></div>
              <div class="meta-item">Tarih: ${order.date}</div>
            </div>
          </div>

          <div class="info-section">
            <div class="info-box">
              <h4>Sayın</h4>
              <p><strong>${order.customer.name}</strong></p>
              <p>${order.customer.email}</p>
              <p>${order.customer.phone || ''}</p>
            </div>
            <div class="info-box">
              <h4>Teslimat Adresi</h4>
              <p class="address">${order.shippingAddress || 'Adres bilgisi bulunamadı.'}</p>
              <p style="margin-top:8px"><strong>Ödeme:</strong> ${order.paymentMethod}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th width="50%">Ürün / Hizmet</th>
                <th width="15%" class="col-price">Birim Fiyat</th>
                <th width="10%" class="col-qty">Adet</th>
                <th width="25%" class="col-price">Toplam</th>
              </tr>
            </thead>
            <tbody>
              ${order.products ? order.products.map(p => `
                <tr>
                  <td>
                    <span class="product-name">${p.name}</span>
                    <span class="product-variant">${p.variant || ''}</span>
                  </td>
                  <td class="col-price">${formatMoney(p.price)}</td>
                  <td class="col-qty">${p.qty}</td>
                  <td class="col-price">${formatMoney(p.price * p.qty)}</td>
                </tr>
              `).join('') : '<tr><td colspan="4">Ürün bilgisi yok</td></tr>'}
            </tbody>
          </table>

          <div class="totals-area">
            <div class="totals-table">
              <div class="totals-row">
                <span>Ara Toplam</span>
                <span>${formatMoney(order.amount)}</span>
              </div>
              <div class="totals-row">
                <span>Komisyon (%10)</span>
                <span>${formatMoney(order.commission || 0)}</span>
              </div>
              <div class="grand-total">
                <span>GENEL TOPLAM</span>
                <span>${formatMoney(order.amount)}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Bu belge bilgilendirme amaçlıdır. Mali değeri yoktur.</p>
            <p>TicaretPanel Yönetim Sistemi tarafından oluşturulmuştur.</p>
          </div>
        </div>
        
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
};