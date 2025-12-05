import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock,
  FiChevronRight,
  FiShoppingBag,
  FiMapPin,
  FiCalendar,
  FiLoader
} from 'react-icons/fi';
import { getUserOrders } from '../../features/checkout/api/checkoutApi';

function UserOrders() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['userOrders', currentPage],
    queryFn: () => getUserOrders({ page: currentPage, per_page: 10 }),
  });

  const orders = data?.data?.orders || [];
  const pagination = data?.data?.pagination;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Beklemede',
        icon: FiClock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100'
      },
      processing: {
        label: 'Hazırlanıyor',
        icon: FiPackage,
        color: 'text-blue-600',
        bg: 'bg-blue-100'
      },
      shipped: {
        label: 'Kargoda',
        icon: FiTruck,
        color: 'text-purple-600',
        bg: 'bg-purple-100'
      },
      delivered: {
        label: 'Teslim Edildi',
        icon: FiCheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-100'
      },
      cancelled: {
        label: 'İptal Edildi',
        icon: FiXCircle,
        color: 'text-red-600',
        bg: 'bg-red-100'
      }
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Ödeme Bekliyor',
        color: 'text-yellow-600',
        bg: 'bg-yellow-100'
      },
      paid: {
        label: 'Ödendi',
        color: 'text-green-600',
        bg: 'bg-green-100'
      },
      failed: {
        label: 'Başarısız',
        color: 'text-red-600',
        bg: 'bg-red-100'
      },
      refunded: {
        label: 'İade Edildi',
        color: 'text-gray-600',
        bg: 'bg-gray-100'
      }
    };
    return configs[status] || configs.pending;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <FiXCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-800 mb-1">Siparişler yüklenemedi</h3>
        <p className="text-red-600 text-sm">{error.message || 'Bir hata oluştu'}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz sipariş yok</h3>
        <p className="text-gray-500 mb-6">İlk siparişinizi vermek için alışverişe başlayın!</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparişlerim</h1>
          <p className="text-gray-500 text-sm mt-1">
            Toplam {pagination?.total || orders.length} sipariş
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const paymentConfig = getPaymentStatusConfig(order.payment_status);
          const StatusIcon = statusConfig.icon;

          return (
            <div 
              key={order.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Sipariş No</p>
                      <p className="font-semibold text-gray-900">{order.order_number}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm text-gray-500">Tarih</p>
                      <p className="font-medium text-gray-700 flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentConfig.bg} ${paymentConfig.color}`}>
                      {paymentConfig.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.bg} ${statusConfig.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-4">
                  {/* Products */}
                  <div className="flex-1 min-w-0">
                    <div className="flex -space-x-2">
                      {(order.items || []).slice(0, 4).map((item, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 overflow-hidden flex-shrink-0"
                          title={item.product_name}
                        >
                          {item.product_image ? (
                            <img 
                              src={item.product_image} 
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiPackage className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                      {(order.items?.length || 0) > 4 && (
                        <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-gray-600">
                            +{order.items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {order.items_count || order.items?.length || 0} ürün
                    </p>
                  </div>

                  {/* Address */}
                  {order.shipping_address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="max-w-[200px] truncate">
                        {order.shipping_address.city}, {order.shipping_address.district}
                      </span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Toplam</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-500 sm:hidden">
                  <FiCalendar className="w-4 h-4 inline mr-1" />
                  {formatDate(order.created_at)}
                </div>
                <Link
                  to={`/account/orders/${order.order_number}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 ml-auto"
                >
                  Detayları Görüntüle
                  <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            {currentPage} / {pagination.last_page}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
            disabled={currentPage === pagination.last_page}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}

export default UserOrders;
