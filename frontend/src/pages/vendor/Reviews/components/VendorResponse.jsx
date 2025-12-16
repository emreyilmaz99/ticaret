import React from 'react';
import PropTypes from 'prop-types';
import { FaStore, FaTrash } from 'react-icons/fa';

const VendorResponse = ({ response, formatDate, handleDeleteResponse, styles }) => {
  return (
    <div style={styles.responseSection}>
      <div style={styles.responseHeader}>
        <span style={styles.responseTitle}>
          <FaStore size={12} /> Yanıtınız
        </span>
        <span style={styles.responseDate}>
          {formatDate(response.created_at)}
        </span>
      </div>
      <p style={styles.responseText}>{response.response}</p>
      <button
        style={styles.responseDeleteBtn}
        onClick={() => handleDeleteResponse(response.id)}
      >
        <FaTrash size={10} /> Yanıtı Sil
      </button>
    </div>
  );
};

VendorResponse.propTypes = {
  response: PropTypes.shape({
    id: PropTypes.number.isRequired,
    response: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  formatDate: PropTypes.func.isRequired,
  handleDeleteResponse: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default VendorResponse;
