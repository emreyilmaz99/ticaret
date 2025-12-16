import React from 'react';
import PropTypes from 'prop-types';
import { FaReply } from 'react-icons/fa';

const ReplyForm = ({ replyText, setReplyText, isSubmitting, handleCancelReply, handleSubmitReply, styles }) => {
  return (
    <div style={styles.replyForm}>
      <div style={styles.replyFormTitle}>
        <FaReply size={12} /> Yanıtınızı yazın
      </div>
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Müşteriye yanıtınızı yazın..."
        style={styles.replyTextarea}
        maxLength={1000}
      />
      <div style={styles.replyCharCount}>
        {replyText.length}/1000
      </div>
      <div style={styles.replyActions}>
        <button
          style={styles.cancelBtn}
          onClick={handleCancelReply}
        >
          İptal
        </button>
        <button
          style={styles.replyBtn}
          onClick={handleSubmitReply}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Yanıtla'}
        </button>
      </div>
    </div>
  );
};

ReplyForm.propTypes = {
  replyText: PropTypes.string.isRequired,
  setReplyText: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleCancelReply: PropTypes.func.isRequired,
  handleSubmitReply: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default ReplyForm;
