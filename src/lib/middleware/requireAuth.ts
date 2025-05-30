import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function requireAuth() {
  // Ambil token dari cookie (bisa disesuaikan jika pakai header lain)
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/auth/login');
  }
  // Bisa tambahkan validasi token di sini jika perlu (misal: jwt.verify)
  return token;
}
