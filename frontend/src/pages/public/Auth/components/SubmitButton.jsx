// src/pages/public/Auth/components/SubmitButton.jsx
import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

/**
 * Submit button component
 */
export const SubmitButton = ({ isLoading, loadingText, text, styles }) => {
  return (
    <button
      type="submit"
      style={{
        ...styles.submitBtn,
        opacity: isLoading ? 0.7 : 1,
        cursor: isLoading ? 'not-allowed' : 'pointer',
      }}
      disabled={isLoading}
    >
      {isLoading ? loadingText : (
        <>
          {text} <FaArrowRight />
        </>
      )}
    </button>
  );
};
