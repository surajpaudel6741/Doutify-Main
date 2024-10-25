export const Button = ({ className = "", children, ...props }) => (
    <button
      className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );