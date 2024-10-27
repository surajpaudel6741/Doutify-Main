// export const Button = ({ className = "", children, ...props }) => (
//     <button
//       className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );


// Button.jsx




import React from 'react';

export const Button = ({ children, onClick, variant = 'primary' }) => {
  const baseStyles = 'px-5 py-2.5 rounded-full font-medium shadow-lg transition-all transform hover:scale-105';
  const variants = {
    primary: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};