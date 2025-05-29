# Separation of Concerns - Authentication System

## Overview
Dokumentasi ini menjelaskan bagaimana **Separation of Concerns (SoC)** telah diterapkan pada sistem authentication aplikasi Junkrik, khususnya pada halaman login.

## Sebelum Refactoring ❌

### Masalah yang Ditemukan:
1. **Mixed Responsibilities**: Component `LoginPage` mencampur berbagai tanggung jawab
2. **Direct API Calls**: Hardcoded fetch di dalam component
3. **Manual State Management**: Direct localStorage manipulation
4. **No Reusability**: Logic terikat pada satu component
5. **Poor Error Handling**: Basic error handling tanpa proper states

### Code Structure Lama:
```tsx
// ❌ BURUK - Semua logic di dalam satu component
export default function LoginPage() {
  // State management
  const [formData, setFormData] = useState({...});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form handling
  const handleChange = (e) => {...};
  
  // API calls + business logic
  const handleSubmit = async (e) => {
    // Validation
    // API call
    // Token management
    // Navigation
  };

  // UI rendering
  return (
    <div>
      {/* Hardcoded form UI */}
    </div>
  );
}
```

## Setelah Refactoring ✅

### Struktur Baru dengan Separation of Concerns:

#### 1. **Custom Hooks Layer** (`/src/hooks/`)

**`useAuth.ts`** - Authentication Business Logic
```tsx
// ✅ BAIK - Isolated authentication logic
export const useAuth = (): UseAuthReturn => {
  // Authentication state management
  // Login/logout logic
  // Token management
  // Auto-redirect logic
};
```

**`useForm.ts`** - Form State Management
```tsx
// ✅ BAIK - Reusable form logic
export function useForm<T>(initialValues, validationRules) {
  // Form state management
  // Validation logic
  // Form submission handling
  // Error management
};
```

#### 2. **UI Components Layer** (`/src/components/ui/`)

**`FormComponents.tsx`** - Reusable UI Components
```tsx
// ✅ BAIK - Pure UI components
export const InputField = ({ ... }) => { /* Pure UI */ };
export const SubmitButton = ({ ... }) => { /* Pure UI */ };
export const ErrorAlert = ({ ... }) => { /* Pure UI */ };
export const FormContainer = ({ ... }) => { /* Pure UI */ };
```

#### 3. **Service Layer** (`/src/lib/services/`)

**`auth.service.ts`** - Business Logic
```tsx
// ✅ BAIK - Isolated business logic
export class AuthService {
  static async login(data: LoginRequest): Promise<AuthResponse> {
    // Database operations
    // Password validation
    // Token generation
  }
}
```

#### 4. **Validation Layer** (`/src/lib/validations/`)

**`auth.ts`** - Data Validation
```tsx
// ✅ BAIK - Isolated validation logic
export function validateLoginInput(data: any): LoginRequest {
  // Input validation
  // Type safety
  // Error handling
}
```

#### 5. **Page Component** (`/src/app/auth/login/page.tsx`)

**`page.tsx`** - Pure Orchestration
```tsx
// ✅ BAIK - Pure orchestration, no business logic
export default function LoginPage() {
  // Hook compositions
  const { login, loading, error, clearError } = useAuth();
  const { values, errors, touched, handleChange, handleSubmit } = useForm(...);
  
  // Simple event handler
  const onSubmit = async (formData) => {
    const success = await login(formData);
    if (success) router.push('/dashboard');
  };

  // Pure UI rendering
  return <FormContainer>...</FormContainer>;
}
```

## Benefits dari Separation of Concerns

### 1. **Reusability** ♻️
- `useAuth` dapat digunakan di berbagai component
- `useForm` dapat digunakan untuk semua form
- UI components dapat digunakan di seluruh aplikasi

### 2. **Testability** 🧪
- Setiap layer dapat ditest secara terpisah
- Mock dependencies lebih mudah
- Unit testing lebih focused

### 3. **Maintainability** 🔧
- Perubahan business logic tidak affect UI
- Bug fixing lebih terfokus
- Code easier to understand

### 4. **Scalability** 📈
- Mudah menambah fitur authentication baru
- Pattern dapat direplikasi untuk fitur lain
- Team dapat bekerja parallel pada layer berbeda

### 5. **Type Safety** 🛡️
- Setiap layer memiliki type definitions yang jelas
- Compile-time error detection
- Better IDE support

## Layer Responsibilities

| Layer | Responsibility | Should NOT |
|-------|----------------|------------|
| **Page Component** | Orchestration, UI composition | Business logic, API calls |
| **Custom Hooks** | State management, side effects | UI rendering, direct DOM manipulation |
| **Service Layer** | Business logic, API communication | UI concerns, component state |
| **UI Components** | Presentation, user interaction | Business logic, API calls |
| **Validation Layer** | Data validation, type safety | UI rendering, side effects |

## Best Practices Applied

### 1. **Single Responsibility Principle**
- Setiap function/component memiliki satu tanggung jawab
- Clear separation antara UI dan business logic

### 2. **Dependency Inversion**
- High-level modules tidak depend pada low-level modules
- Abstract interfaces untuk communication

### 3. **Open/Closed Principle**
- Components open for extension, closed for modification
- Easy to add new features tanpa mengubah existing code

### 4. **DRY (Don't Repeat Yourself)**
- Reusable hooks dan components
- Shared validation logic

## File Structure
```
src/
├── hooks/
│   ├── useAuth.ts          # Authentication logic
│   └── useForm.ts          # Form management logic
├── components/
│   └── ui/
│       └── FormComponents.tsx  # Reusable UI components
├── lib/
│   ├── services/
│   │   └── auth.service.ts     # Business logic
│   └── validations/
│       └── auth.ts             # Validation logic
└── app/
    └── auth/
        └── login/
            └── page.tsx        # Pure orchestration
```

## Conclusion

Dengan menerapkan Separation of Concerns:

1. **Code lebih modular** dan easy to maintain
2. **Reusability** meningkat drastis
3. **Testing** menjadi lebih mudah dan focused
4. **Team collaboration** menjadi lebih efisien
5. **Debugging** menjadi lebih targeted

Pattern ini harus diterapkan konsisten di seluruh aplikasi untuk mendapatkan benefit maksimal.
