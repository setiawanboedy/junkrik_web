/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/utils/apiClient';
import toast from 'react-hot-toast';
import { validateCreatePickup } from '@/lib/validations/pickup';

interface Schedule {
  id: string;
  dayOfWeek: number;
  time: string;
}

interface PickupFormData {
  scheduleId?: string;
  pickupDate: string;
  wasteTypes: string[];
  estimatedWeight?: number;
  specialInstructions?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
}

const WASTE_TYPES = [
  { value: 'PLASTIC', label: 'Plastic' },
  { value: 'ORGANIC', label: 'Organic' },
  { value: 'PAPER', label: 'Paper' },
  { value: 'METAL', label: 'Metal' },
  { value: 'GLASS', label: 'Glass' },
  { value: 'MIXED', label: 'Mixed' }
];

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function PickupForm() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [formData, setFormData] = useState<PickupFormData>({
    pickupDate: '',
    wasteTypes: [],
    address: {
      street: '',
      city: '',
      postalCode: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedules();
    // Set default pickup date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      pickupDate: tomorrow.toISOString().slice(0, 16)
    }));
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/schedules');
      setSchedules(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
    }
  };

  const handleWasteTypeToggle = (wasteType: string) => {
    setFormData(prev => ({
      ...prev,
      wasteTypes: prev.wasteTypes.includes(wasteType)
        ? prev.wasteTypes.filter(type => type !== wasteType)
        : [...prev.wasteTypes, wasteType]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Convert pickupDate to ISO string if needed
    // eslint-disable-next-line prefer-const
    let submitData = { ...formData };
    if (formData.pickupDate && !formData.pickupDate.endsWith('Z')) {
      // Convert 'YYYY-MM-DDTHH:mm' to ISO
      const date = new Date(formData.pickupDate);
      submitData.pickupDate = date.toISOString();
    }
    // Robust client-side validation
    try {
      validateCreatePickup(submitData);
    } catch (validationErr: any) {
      const msg = validationErr?.errors?.[0]?.message || validationErr?.message || 'Invalid input';
      setError(msg);
      toast.error(msg);
      return;
    }
    if (formData.wasteTypes.length === 0) {
      setError('Please select at least one waste type');
      toast.error('Please select at least one waste type');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/pickups', submitData);
      toast.success('Pickup request created successfully!');
      router.push('/dashboard/pickups');
    } catch (err: unknown) {
      let msg = 'An error occurred';
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response
      ) {
        const data = (err.response as { data?: unknown }).data;
        if (data && typeof data === 'object' && 'error' in data) {
          msg = (data as { error?: string }).error || 'Failed to create pickup request';
        } else {
          msg = 'Failed to create pickup request';
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Helper: get next pickup date from schedule
  function getNextPickupDate(schedule: Schedule): string {
    const now = new Date();
    const today = now.getDay();
    let daysToAdd = (schedule.dayOfWeek - today + 7) % 7;
    if (daysToAdd === 0) {
      // If time already passed today, set to next week
      const [hour, minute] = schedule.time.split(':').map(Number);
      if (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute)) {
        daysToAdd = 7;
      }
    }
    const next = new Date(now);
    next.setDate(now.getDate() + daysToAdd);
    // Set jam dan menit persis sesuai schedule, tanpa pengaruh offset lokal
    const [hour, minute] = schedule.time.split(':').map(Number);
    next.setHours(hour, minute, 0, 0);
    // Koreksi offset agar hasil toISOString sesuai jam lokal yang diinginkan
    const pad = (n: number) => n.toString().padStart(2, '0');
    const local = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}T${pad(hour)}:${pad(minute)}`;
    return local;
  }

  // When scheduleId changes, update pickupDate
  useEffect(() => {
    if (formData.scheduleId) {
      const schedule = schedules.find(s => s.id === formData.scheduleId);
      if (schedule) {
        setFormData(prev => ({ ...prev, pickupDate: getNextPickupDate(schedule) }));
      }
    }
  }, [formData.scheduleId, schedules]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Pickup</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Schedule Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link to Schedule (Opsional)
          </label>
          <select
            value={formData.scheduleId || ''}
            onChange={(e) => setFormData({ ...formData, scheduleId: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
          >
            <option value="">Tidak ada (pickup manual)</option>
            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>
                {DAYS_OF_WEEK[schedule.dayOfWeek]} jam {schedule.time}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Pilih jadwal rutin jika ingin pickup otomatis sesuai pola. Jika tidak, isi tanggal pickup manual.
          </p>
        </div>

        {/* Pickup Date */}
        <div>
          <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Date & Time *
          </label>
          <input
            type="datetime-local"
            id="pickupDate"
            value={formData.pickupDate ? formData.pickupDate.slice(0, 16) : ''}
            onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
            required
            readOnly={!!formData.scheduleId}
          />
          {formData.scheduleId && (
            <p className="text-xs text-blue-600 mt-1">Tanggal pickup otomatis mengikuti jadwal rutin yang dipilih.</p>
          )}
        </div>

        {/* Waste Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waste Types *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {WASTE_TYPES.map((type) => (
              <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wasteTypes.includes(type.value)}
                  onChange={() => handleWasteTypeToggle(type.value)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Estimated Weight */}
        <div>
          <label htmlFor="estimatedWeight" className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Weight (kg)
          </label>
          <input
            type="number"
            id="estimatedWeight"
            value={formData.estimatedWeight || ''}
            onChange={(e) => setFormData({ ...formData, estimatedWeight: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder="e.g., 10"
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
          />
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Pickup Address</h3>
          
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              id="street"
              value={formData.address.street}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, street: e.target.value }
              })}
              placeholder="e.g., Jl. Sudirman No. 123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                value={formData.address.city}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })}
                placeholder="e.g., Jakarta"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                id="postalCode"
                value={formData.address.postalCode}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, postalCode: e.target.value }
                })}
                placeholder="e.g., 12345"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="addressNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Address Notes
            </label>
            <input
              type="text"
              id="addressNotes"
              value={formData.address.notes || ''}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, notes: e.target.value }
              })}
              placeholder="e.g., Building A, 2nd floor"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
            />
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions
          </label>
          <textarea
            id="specialInstructions"
            value={formData.specialInstructions || ''}
            onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            placeholder="Any special instructions for the pickup team..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 cursor-pointer py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 cursor-pointer py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Request Pickup'}
          </button>
        </div>
      </form>
    </div>
  );
}
