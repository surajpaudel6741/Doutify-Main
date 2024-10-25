export const Card = ({ className = "", children }) => (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
  
  export const CardHeader = ({ className = "", children }) => (
    <div className={`px-6 py-4 ${className}`}>{children}</div>
  );
  
  export const CardTitle = ({ className = "", children }) => (
    <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>
  );
  
  export const CardContent = ({ className = "", children }) => (
    <div className={`px-6 py-4 ${className}`}>{children}</div>
  );