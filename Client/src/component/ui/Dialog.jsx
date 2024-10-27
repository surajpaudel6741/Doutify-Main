// Dialog.jsx
import React from 'react';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-6 shadow-xl w-full max-w-lg">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={() => onOpenChange(false)}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

export const DialogHeader = ({ children }) => (
  <div className="border-b border-gray-200 pb-4 mb-6 text-center">
    {children}
  </div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-2xl font-semibold text-gray-800">
    {children}
  </h2>
);
