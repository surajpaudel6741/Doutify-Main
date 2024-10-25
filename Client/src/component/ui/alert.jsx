export const Alert = ({ variant = "default", className = "", children }) => (
    <div
      className={`p-4 rounded-md mb-4 ${
        variant === "destructive"
          ? "bg-red-50 text-red-900 border border-red-200"
          : "bg-blue-50 text-blue-900 border border-blue-200"
      } ${className}`}
    >
      {children}
    </div>
  );
  
  export const AlertDescription = ({ className = "", children }) => (
    <div className={`text-sm ${className}`}>{children}</div>
  );