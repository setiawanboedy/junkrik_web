"use client";
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
import { useEffect, useState } from 'react';

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

export default function LoginForm() {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormContainer
      title="Login Junkrik"
      subtitle="Masuk untuk mengelola pengumpulan sampah bisnis Anda"
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
      <SubmitButton loading={loading || isSubmitting} className="w-full">
        {loading || isSubmitting ? 'Masuk...' : 'Masuk'}
      </SubmitButton>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Belum punya akun?{' '}
          <a href="/auth/register" className="font-medium cursor-pointer text-green-600 hover:text-green-500">
            Daftar di sini
          </a>
        </p>
      </div>
    </FormContainer>
  );
}
