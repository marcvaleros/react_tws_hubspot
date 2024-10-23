import React from 'react';
import WebSocketProgress from './progressBar'

const LoadingSpinner = ({setLoading,toggleModal}) => {
  return (
    <div role="status">
        <WebSocketProgress setLoading={setLoading} toggleModal={toggleModal}/>
    </div>
  );
};

export default LoadingSpinner;