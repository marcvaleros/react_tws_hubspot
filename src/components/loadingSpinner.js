import React from 'react';
import WebSocketProgress from './progressBar'

const LoadingSpinner = () => {
  return (
    <div role="status">
        <WebSocketProgress/>
    </div>
  );
};

export default LoadingSpinner;