// src/pages/admin/CommissionPlans/PlanTable.jsx
import React from 'react';
import { FaStar, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

/**
 * Komisyon planları tablosu
 */
const PlanTable = ({
  plans,
  onEdit,
  onDelete,
  onToggleActive,
  onSetDefault,
  styles
}) => {
  if (plans.length === 0) {
    return (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Plan Adı</th>
              <th style={styles.th}>Oran (%)</th>
              <th style={styles.th}>Açıklama</th>
              <th style={styles.th}>Durum</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" style={styles.emptyState}>
                Henüz komisyon planı eklenmemiş.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Plan Adı</th>
            <th style={styles.th}>Oran (%)</th>
            <th style={styles.th}>Açıklama</th>
            <th style={styles.th}>Durum</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id} style={styles.row}>
              <td style={styles.td}>
                <span style={{ fontWeight: '500' }}>{plan.name}</span>
                {plan.is_default && (
                  <span style={{ ...styles.badge, ...styles.badgeDefault }}>
                    <FaStar size={10} style={{ marginRight: 4 }} /> Varsayılan
                  </span>
                )}
              </td>
              <td style={styles.td}>%{plan.rate}</td>
              <td style={styles.td}>{plan.description || '-'}</td>
              <td style={styles.td}>
                <span style={{ 
                  ...styles.badge, 
                  ...(plan.is_active ? styles.badgeActive : styles.badgeInactive) 
                }}>
                  {plan.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </td>
              <td style={{ ...styles.td, textAlign: 'right' }}>
                <button 
                  onClick={() => onToggleActive(plan.id)}
                  style={{ 
                    ...styles.actionBtn, 
                    ...(plan.is_active ? styles.btnToggleOn : styles.btnToggleOff) 
                  }}
                  title={plan.is_active ? 'Pasife Al' : 'Aktife Al'}
                >
                  {plan.is_active ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                </button>
                <button 
                  onClick={() => onSetDefault(plan.id)}
                  style={{ 
                    ...styles.actionBtn, 
                    ...(plan.is_default ? styles.btnDefaultDisabled : styles.btnDefault) 
                  }}
                  title="Varsayılan Yap"
                  disabled={plan.is_default}
                >
                  <FaStar size={16} />
                </button>
                <button 
                  onClick={() => onEdit(plan)}
                  style={{ ...styles.actionBtn, ...styles.btnEdit }}
                  title="Düzenle"
                >
                  <FaEdit size={16} />
                </button>
                <button 
                  onClick={() => onDelete(plan.id)}
                  style={{ ...styles.actionBtn, ...styles.btnDelete }}
                  title="Sil"
                >
                  <FaTrash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanTable;
