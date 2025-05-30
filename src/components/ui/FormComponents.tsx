// Reusable Form Components dengan proper separation
import React from 'react';

// Input Field Component
interface InputFieldProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  label: string;
  value: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type = 'text',
  label,
  value,
  error,
  touched,
  required,
  placeholder,
  disabled,
  onChange,
  onBlur,
}) => {
  const hasError = touched && error;

  return (    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-900 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-offset-2
          text-gray-900 placeholder-gray-500
          ${hasError 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-600' : 'bg-white'}
        `}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// TextArea Field Component
interface TextAreaFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  id,
  name,
  label,
  value,
  error,
  touched,
  required,
  placeholder,
  disabled,
  rows = 3,
  onChange,
  onBlur,
}) => {
  const hasError = touched && error;

  return (    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-900 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>      <textarea
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-offset-2
          text-gray-900 placeholder-gray-500
          ${hasError 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-600' : 'bg-white'}
        `}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Select Field Component
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  options: SelectOption[];
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  error,
  touched,
  required,
  disabled,
  options,
  placeholder,
  onChange,
  onBlur,
}) => {
  const hasError = touched && error;

  return (    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-900 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>      <select
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-offset-2
          text-gray-900
          ${hasError 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-600' : 'bg-white'}
        `}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Submit Button Component
interface SubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const disabledClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${disabledClasses}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Error Alert Component
interface ErrorAlertProps {
  error: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss }) => {
  return (
    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <div className="flex">
        <div className="flex-1">
          <p className="text-sm">{error}</p>
        </div>
        {onDismiss && (
          <div className="ml-4">
            <button
              type="button"
              onClick={onDismiss}
              className="text-red-400 hover:text-red-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Success Alert Component
interface SuccessAlertProps {
  message: string;
  onDismiss?: () => void;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onDismiss }) => {
  return (
    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
      <div className="flex">
        <div className="flex-1">
          <p className="text-sm">{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-4">
            <button
              type="button"
              onClick={onDismiss}
              className="text-green-400 hover:text-green-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Form Container Component
interface FormContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  subtitle,
  onSubmit,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            {children}
          </form>
        </div>
      </div>
    </div>
  );
};
