import React from 'react';
import PropTypes from 'prop-types';

/**
 * TransactionTable Component - İşlem geçmişi tablosu
 */
const TransactionTable = ({ transactions, styles }) => {
  return (
    <div style={styles.tableContainer}>
      <h3 style={styles.tableTitle}>Son İşlemler</h3>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>İŞLEM ID</th>
            <th style={styles.th}>TARİH</th>
            <th style={styles.th}>AÇIKLAMA</th>
            <th style={styles.thRight}>TUTAR</th>
            <th style={styles.thRight}>DURUM</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((trx, index) => (
            <tr key={trx.id} style={styles.tr(index === transactions.length - 1)}>
              <td style={styles.tdId}>{trx.id}</td>
              <td style={styles.tdDate}>{trx.date}</td>
              <td style={styles.tdDescription}>{trx.description}</td>
              <td style={styles.tdAmount(trx.amount.startsWith('-'))}>
                {trx.amount}
              </td>
              <td style={styles.tdStatus}>
                <span style={styles.statusBadge(trx.status === 'completed')}>
                  {trx.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TransactionTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  styles: PropTypes.object.isRequired,
};

export default TransactionTable;
