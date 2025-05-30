// Custom hook untuk form handling dengan validation
import { useState, useCallback, ChangeEvent, FormEvent, useMemo } from 'react';

interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

interface UseFormReturn<T> extends FormState<T> {
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e: FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearErrors: () => void;
  resetForm: () => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
}

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validationRules?: ValidationRules<T>
): UseFormReturn<T> {
  // Memoize initial state to prevent hydration mismatch
  const initialFormState = useMemo(() => ({
    values: initialValues,
    errors: {} as Partial<Record<keyof T, string>>,
    touched: {} as Partial<Record<keyof T, boolean>>,
    isSubmitting: false,
    isValid: true,
  }), [initialValues]);

  const [formState, setFormState] = useState<FormState<T>>(initialFormState);

  const validateField = useCallback((field: keyof T): boolean => {
    const value = formState.values[field];
    const rules = validationRules?.[field];
    
    if (!rules) return true;

    let error: string | null = null;

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      error = `${String(field)} is required`;
    }

    // MinLength validation
    if (!error && rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      error = `${String(field)} must be at least ${rules.minLength} characters`;
    }

    // MaxLength validation
    if (!error && rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      error = `${String(field)} must not exceed ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (!error && rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      error = `${String(field)} format is invalid`;
    }

    // Custom validation
    if (!error && rules.custom) {
      error = rules.custom(value);
    }

    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error || undefined,
      },
    }));

    return !error;
  }, [formState.values, validationRules]);

  const validateForm = useCallback((): boolean => {
    if (!validationRules) return true;

    const fields = Object.keys(validationRules) as (keyof T)[];
    const isValid = fields.every(field => validateField(field));

    setFormState(prev => ({ ...prev, isValid }));
    return isValid;
  }, [validateField, validationRules]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: finalValue,
      },
    }));
  }, []);

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    setFormState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }));

    validateField(name as keyof T);
  }, [validateField]);

  const handleSubmit = useCallback((onSubmit: (values: T) => Promise<void> | void) => {
    return async (e: FormEvent) => {
      e.preventDefault();
      
      const isFormValid = validateForm();
      if (!isFormValid) return;

      setFormState(prev => ({ ...prev, isSubmitting: true }));
      
      try {
        await onSubmit(formState.values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setFormState(prev => ({ ...prev, isSubmitting: false }));
      }
    };
  }, [formState.values, validateForm]);

  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setFormState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: value,
      },
    }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error,
      },
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      errors: {},
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
    });
  }, [initialValues]);

  return {
    ...formState,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    clearErrors,
    resetForm,
    validateField,
    validateForm,
  };
}
