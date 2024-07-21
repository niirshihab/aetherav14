// src/components/ui/UseToast.jsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, variant = 'primary') => {
    setToasts([...toasts, { message, variant }]);
  }, [toasts]);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((toast, index) => (
          <Toast key={index} bg={toast.variant} onClose={() => setToasts(toasts.filter((_, i) => i !== index))}>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};