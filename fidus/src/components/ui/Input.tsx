import React, { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', type, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && <label className="text-secondary text-sm font-medium font-body">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </div>
        )}
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          className={`w-full bg-surface border border-border rounded-lg px-4 py-2 text-primary font-body focus:outline-none focus:ring-2 focus:ring-trust-blue/50 focus:border-trust-blue transition-all ${
            icon ? 'pl-10' : ''
          } ${type === 'password' ? 'pr-10' : ''} ${error ? 'border-rose focus:ring-rose/50 focus:border-rose' : ''} ${className}`}
          {...rest}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="text-rose text-xs font-body">{error}</span>}
    </div>
  );
};
