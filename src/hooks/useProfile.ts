import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  businessName: string;
  address: string;
  phone: string;
  businessType: string;
  dailyWasteVolume: number;
  // Tambahkan field lain sesuai kebutuhan
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/profile');
      setProfile(res.data.data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      const errorMsg = axiosErr.response?.data?.error || 'Gagal memuat profil';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<ProfileData>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put('/api/profile', data);
      setProfile(res.data.data);
      return true;
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      const errorMsg = axiosErr.response?.data?.error || 'Gagal memperbarui profil';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, fetchProfile, updateProfile };
}
