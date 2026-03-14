import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="input-label">{label}</label>}
      <input 
        className={`input-field ${error ? 'input-field-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] font-black text-error px-2 uppercase tracking-wide">{error}</p>}
    </div>
  );
};

export default Input;
