import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Action button component
 */
const ActionButton = ({ text, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...styles.actionButton,
        ...(isHovered ? styles.actionButtonHover : {})
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      {text}
      <FaArrowRight size={14} />
    </button>
  );
};

export default ActionButton;
