'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { LoginRequest } from '@/lib/validations/auth';
import { 
  FormContainer, 
  InputField, 
  SubmitButton, 
  ErrorAlert 
} from '@/components/ui/FormComponents';

// Form validation rules
const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 6,
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuth();
  
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<LoginRequest>(
    { email: '', password: '' },
    validationRules
  );

  const onSubmit = async (formData: LoginRequest) => {
    const success = await login(formData);
    if (success) {
      router.push('/dashboard');
    }
  };
  return (
    <FormContainer
      title="Login Junkrik"
      subtitle="Masuk ke akun bisnis Anda"
      onSubmit={handleSubmit(onSubmit)}
    >
      {error && (
        <ErrorAlert error={error} onDismiss={clearError} />
      )}

      <InputField
        id="email"
        name="email"
        type="email"
        label="Email"
        value={values.email}
        error={errors.email}
        touched={touched.email}
        required
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <InputField
        id="password"
        name="password"
        type="password"
        label="Password"
        value={values.password}
        error={errors.password}
        touched={touched.password}
        required
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SubmitButton
        loading={loading || isSubmitting}
        className="w-full"
      >
        {loading || isSubmitting ? 'Masuk...' : 'Masuk'}
      </SubmitButton>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Belum punya akun?{' '}
          <a href="/auth/register" className="font-medium text-green-600 hover:text-green-500">
            Daftar di sini
          </a>
        </p>
      </div>
    </FormContainer>
  );
}
