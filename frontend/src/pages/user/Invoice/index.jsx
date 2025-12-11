import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../../../features/checkout/api/checkoutApi';
import { FiLoader } from 'react-icons/fi';

const Invoice = () => {
  const { orderNumber } = useParams();

  const { data: orderData, isLoading } = useQuery({
    queryKey: ['invoice', orderNumber],
    queryFn: () => getOrder(orderNumber),
  });

  const order = orderData?.data?.order;

  useEffect(() => {
    if (order) {
      // Auto-print when order is loaded
      setTimeout(() => window.print(), 500);
    }
  }, [order]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);
  };

  // Calculate totals - using the same logic as vendor invoice
  const calculateTotals = () => {
    if (!order || !order.products) {
      return { subtotalWithoutTax: 0, totalTax: 0, total: 0 };
    }

    const subtotalWithoutTax = order.subtotal - (order.tax_amount || 0) - (order.coupon_discount || 0);
    const totalTax = order.tax_amount || 0;
    const total = order.amount || 0;

    return { subtotalWithoutTax, totalTax, total };
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <FiLoader className="animate-spin" size={48} color="#2563eb" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p style={{ fontSize: '18px', color: '#6b7280' }}>Fatura bulunamadı</p>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <>
      <style>{`
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.6; background-color: #FFFFFF; }
        .container { max-width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.05); background-color: #FFFFFF; }
        
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1F2937; padding-bottom: 20px; margin-bottom: 30px; }
        .brand { font-size: 28px; font-weight: 800; color: #1F2937; letter-spacing: -1px; }
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
        .grand-total { display: flex; justify-content: space-between; padding-top: 15px; margin-top: 10px; border-top: 2px solid #E5E7EB; font-size: 18px; font-weight: 800; color: #1F2937; }

        .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 20px; }
        
        @media print {
          body { padding: 0; background-color: #FFFFFF; }
          .container { border: none; box-shadow: none; background-color: #FFFFFF; }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <div className="brand">Ticaret.com</div>
          <div className="invoice-meta">
            <h3>SİPARİŞ ÖZETİ</h3>
            <div className="meta-item">No: <strong>{order.order_number}</strong></div>
            <div className="meta-item">Tarih: {order.date}</div>
          </div>
        </div>

        <div className="info-section">
          <div className="info-box">
            <h4>Müşteri Bilgileri</h4>
            <p><strong>{order.shipping_address?.full_name || 'Müşteri'}</strong></p>
            <p>{order.shipping_address?.phone || ''}</p>
            <div style={{ marginTop: '16px' }}>
              <h4>Teslimat Adresi</h4>
              <p className="address">
                {order.shipping_address?.address_line}<br />
                {order.shipping_address?.district}, {order.shipping_address?.city}<br />
                {order.shipping_address?.postal_code}
              </p>
            </div>
            <p style={{ marginTop: '12px' }}><strong>Ödeme:</strong> {order.payment_method || 'Kredi Kartı'}</p>
          </div>
          <div className="info-box">
            <h4>Fatura Adresi</h4>
            <p className="address">
              {(order.billing_address?.address_line || order.shipping_address?.address_line)}<br />
              {(order.billing_address?.district || order.shipping_address?.district)}, {(order.billing_address?.city || order.shipping_address?.city)}<br />
              {(order.billing_address?.postal_code || order.shipping_address?.postal_code)}
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th width="40%">Ürün / Hizmet</th>
              <th width="12%" className="col-price">Birim Fiyat</th>
              <th width="8%" className="col-qty">Adet</th>
              <th width="10%" className="col-price">KDV (%)</th>
              <th width="15%" className="col-price">KDV Tutarı</th>
              <th width="15%" className="col-price">Toplam</th>
            </tr>
          </thead>
          <tbody>
            {order.products?.map((product, index) => {
              const priceAfterCoupon = product.price_after_coupon || product.unit_price * product.qty;
              const taxRate = product.tax_rate || 0;
              const priceWithoutTax = product.price_without_tax || (priceAfterCoupon / (1 + taxRate / 100));
              const taxAmount = product.tax_amount || (priceAfterCoupon - priceWithoutTax);
              
              return (
                <tr key={index}>
                  <td>
                    <span className="product-name">{product.name}</span>
                    {product.variant && <span className="product-variant">{product.variant}</span>}
                  </td>
                  <td className="col-price">{formatMoney(priceWithoutTax / product.qty)}</td>
                  <td className="col-qty">{product.qty}</td>
                  <td className="col-price">{taxRate.toFixed(0)}</td>
                  <td className="col-price">{formatMoney(taxAmount)}</td>
                  <td className="col-price">{formatMoney(priceAfterCoupon)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="totals-area">
          <div className="totals-table">
            <div className="totals-row">
              <span>Ara Toplam (KDV Hariç)</span>
              <span>{formatMoney(totals.subtotalWithoutTax)}</span>
            </div>
            {order.coupon_discount > 0 && (
              <div className="totals-row">
                <span>Kupon İndirimi ({order.coupon_code})</span>
                <span>-{formatMoney(order.coupon_discount)}</span>
              </div>
            )}
            <div className="totals-row">
              <span>Toplam KDV</span>
              <span>{formatMoney(totals.totalTax)}</span>
            </div>
            <div className="totals-row">
              <span>Kargo</span>
              <span>{formatMoney(order.shipping_cost || 0)}</span>
            </div>
            <div className="grand-total">
              <span>GENEL TOPLAM</span>
              <span>{formatMoney(totals.total)}</span>
            </div>
          </div>
        </div>

        <div className="footer">
          <p>Bu belge bilgilendirme amaçlıdır. Mali değeri yoktur.</p>
          <p>Ticaret.com tarafından oluşturulmuştur.</p>
        </div>
      </div>
    </>
  );
};

export default Invoice;
