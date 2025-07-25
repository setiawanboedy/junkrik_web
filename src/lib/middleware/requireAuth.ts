import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  // Ambil token dari cookie (bisa disesuaikan jika pakai header lain)
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token || token.trim() === '') {
    redirect('/auth/login');
    return null;
  }
  // TODO: Tambahkan validasi token (misal: jwt.verify) jika ingin validasi lebih lanjut
  return token;
}
