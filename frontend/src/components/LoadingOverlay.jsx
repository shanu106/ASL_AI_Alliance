import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoadingOverlay = ({ visible = false, message = 'Processing...', onCancel }) => {
  const { isDark } = useTheme();

  if (!visible) return null;

  return (
    <div className="loading-backdrop">
      <div className="loading-panel" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true" />
        <div className="text-left">
          <div className="font-semibold text-lg">{message}</div>
          <div className="text-sm opacity-80">This may take a few moments.</div>
        </div>
        {onCancel && (
          <button onClick={onCancel} className={`ml-4 px-3 py-1 rounded-md text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
