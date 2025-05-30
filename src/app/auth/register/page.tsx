'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { RegisterRequest } from '@/lib/validations/auth';
import { 
  FormContainer, 
  InputField, 
  TextAreaField,
  SelectField,
  SubmitButton, 
  ErrorAlert 
} from '@/components/ui/FormComponents';
import { useEffect, useState } from 'react';

// Form data interface (all strings from form inputs)
interface RegisterFormData {
  businessName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  wasteType: string;
  wasteVolume: string;
  [key: string]: unknown;
}

// Waste type options
const wasteTypeOptions = [
  { value: 'plastik', label: 'Plastik' },
  { value: 'organik', label: 'Organik' },
  { value: 'kertas', label: 'Kertas' },
  { value: 'logam', label: 'Logam' },
  { value: 'campuran', label: 'Campuran' },
];

// Form validation rules
const validationRules = {
  businessName: {
    required: true,
    minLength: 2,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 6,
  },
  phone: {
    required: true,
    pattern: /^[0-9+\-\s()]+$/,
  },
  address: {
    required: true,
    minLength: 10,
  },  wasteVolume: {
    custom: (value: unknown) => {
      if (value === '' || value === null || value === undefined) {
        return null; // Optional field
      }
      const numValue = typeof value === 'string' ? Number(value) : value;
      if (isNaN(numValue as number)) {
        return 'Volume harus berupa angka';
      }
      if ((numValue as number) <= 0) {
        return 'Volume harus lebih dari 0';
      }
      return null;
    },
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, clearError } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering form after mount
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
  } = useForm<RegisterFormData>(
    {
      businessName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      wasteType: '',
      wasteVolume: '',
    },
    validationRules
  );
  const onSubmit = async (formData: RegisterFormData) => {
    // Convert form data to RegisterRequest format
    const registerData: RegisterRequest = {
      businessName: formData.businessName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      wasteType: formData.wasteType || undefined,
      wasteVolume: formData.wasteVolume ? Number(formData.wasteVolume) : undefined,
    };

    const success = await register(registerData);
    if (success) {
      alert('Registrasi berhasil! Silakan login.');
      router.push('/auth/login');    }
  };

  // Don't render form until component is mounted to prevent hydration mismatch
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
      title="Daftar Bisnis Junkrik"
      subtitle="Solusi pengelolaan sampah untuk bisnis Anda"
      onSubmit={handleSubmit(onSubmit)}
    >
      {error && (
        <ErrorAlert error={error} onDismiss={clearError} />
      )}

      <InputField
        id="businessName"
        name="businessName"
        type="text"
        label="Nama Bisnis"
        value={values.businessName}
        error={errors.businessName}
        touched={touched.businessName}
        required
        onChange={handleChange}
        onBlur={handleBlur}
      />

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

      <InputField
        id="phone"
        name="phone"
        type="tel"
        label="Nomor Telepon"
        value={values.phone}
        error={errors.phone}
        touched={touched.phone}
        required
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextAreaField
        id="address"
        name="address"
        label="Alamat"
        value={values.address}
        error={errors.address}
        touched={touched.address}
        required
        rows={3}
        onChange={handleChange}
        onBlur={handleBlur}
      />      <SelectField
        id="wasteType"
        name="wasteType"
        label="Jenis Sampah Utama"
        value={values.wasteType}
        error={errors.wasteType}
        touched={touched.wasteType}
        options={wasteTypeOptions}
        placeholder="Pilih jenis sampah"
        onChange={handleChange}
        onBlur={handleBlur}
      />      <InputField
        id="wasteVolume"
        name="wasteVolume"
        type="number"
        label="Volume Sampah per Hari (kg)"
        value={values.wasteVolume}
        error={errors.wasteVolume}
        touched={touched.wasteVolume}
        placeholder="Contoh: 50"
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SubmitButton
        loading={loading || isSubmitting}
        className="w-full"
      >
        {loading || isSubmitting ? 'Mendaftar...' : 'Daftar'}
      </SubmitButton>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Sudah punya akun?{' '}
          <a href="/auth/login" className="font-medium text-green-600 hover:text-green-500">
            Login di sini
          </a>
        </p>
      </div>
    </FormContainer>
  );
}
