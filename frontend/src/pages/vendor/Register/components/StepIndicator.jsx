import React from 'react';
import { getStepDotStyle } from '../styles';

/**
 * Step indicator dots
 */
const StepIndicator = ({ step, styles }) => {
  return (
    <div style={styles.stepIndicator}>
      <div style={getStepDotStyle(step === 1)}></div>
      <div style={getStepDotStyle(step === 2)}></div>
    </div>
  );
};

export default StepIndicator;
