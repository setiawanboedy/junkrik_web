import React, { useState, useMemo } from 'react';
import type { AdminUser } from '@/hooks/useAdminUsers';
import { InputField, TextAreaField, SelectField } from '@/components/ui/FormComponents';

interface AdminUserTableProps {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  onEdit: (userId: string, data: Partial<AdminUser>) => void;
  onSuspend: (userId: string) => void;
  onActivate: (userId: string) => void;
  onResetPassword: (userId: string) => void;
}

export default function AdminUserTable({ users, loading, error, onEdit, onSuspend, onActivate, onResetPassword }: AdminUserTableProps) {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterWasteType, setFilterWasteType] = useState('');

  // Modal state
  const [editId, setEditId] = useState<string|null>(null);
  const [editData, setEditData] = useState<Partial<AdminUser>>({});
  const [resetId, setResetId] = useState<string|null>(null);

  // Filtering & searching
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch =
        u.businessName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole ? (u.role || 'USER').toLowerCase() === filterRole : true;
      const matchWaste = filterWasteType ? (u.wasteType || '').toLowerCase() === filterWasteType : true;
      return matchSearch && matchRole && matchWaste;
    });
  }, [users, search, filterRole, filterWasteType]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Daftar User/Bisnis</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <InputField
          id="search"
          name="search"
          placeholder="Cari nama/email/telepon..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onBlur={() => {}}
          label=""
        />
        <SelectField
          id="filterRole"
          name="filterRole"
          label=""
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          onBlur={() => {}}
          options={[
            { value: '', label: 'Semua Role' },
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' },
          ]}
        />
        <SelectField
          id="filterWasteType"
          name="filterWasteType"
          label=""
          value={filterWasteType}
          onChange={e => setFilterWasteType(e.target.value)}
          onBlur={() => {}}
          options={[
            { value: '', label: 'Semua Jenis Sampah' },
            { value: 'plastik', label: 'Plastik' },
            { value: 'organik', label: 'Organik' },
            { value: 'kertas', label: 'Kertas' },
            { value: 'logam', label: 'Logam' },
            { value: 'campuran', label: 'Campuran' },
          ]}
        />
      </div>
      {loading ? (
        <div className="py-8 text-center">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-8 text-center text-gray-500">Tidak ada user/bisnis ditemukan</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-t">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-2 font-semibold text-gray-700">Nama Bisnis</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Email</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Telepon</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Jenis Sampah</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Volume Sampah (kg/minggu)</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Alamat</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Role</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b">
                   <td className="py-2 px-2">
                    <span className="font-semibold text-gray-900">{u.businessName}</span>
                    {u.status === 'SUSPENDED' && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-red-200 text-red-800 text-xs font-bold align-middle">SUSPENDED</span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-blue-700">{u.email}</td>
                  <td className="py-2 px-2 text-gray-700">{u.phone}</td>
                  <td className="py-2 px-2 text-gray-700">{u.wasteType || <span className='text-gray-400'>-</span>}</td>
                  <td className="py-2 px-2 text-gray-700">{u.wasteVolume ? `${u.wasteVolume} kg` : <span className='text-gray-400'>-</span>}</td>
                  <td className="py-2 px-2 text-gray-700 max-w-xs truncate" title={u.address}>{u.address}</td>
                  <td className="py-2 px-2 text-gray-700">{u.role ? u.role.toUpperCase() : 'USER'}</td>
                    <td className="py-2 px-2 flex gap-2">
                    <button
                      className="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      onClick={() => { setEditId(u.id); setEditData(u); }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 cursor-pointer bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs"
                      onClick={() => setResetId(u.id)}
                    >
                      Reset PW
                    </button>
                    {u.status === 'SUSPENDED' ? (
                      <button
                      className="px-3 py-1 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                      onClick={() => onActivate(u.id)}
                      >
                      Aktifkan
                      </button>
                    ) : (
                      <button
                      className="px-3 py-1 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      onClick={() => onSuspend(u.id)}
                      >
                      Suspend
                      </button>
                    )}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal Edit User */}
      {editId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg border border-gray-200">
            <h4 className="text-xl font-bold mb-4 text-gray-900">Edit User/Bisnis</h4>
            <form
              onSubmit={e => {
                e.preventDefault();
                onEdit(editId, editData);
                setEditId(null);
              }}
              className="space-y-4"
            >
              <InputField
                id="businessName"
                name="businessName"
                label="Nama Bisnis"
                value={editData.businessName || ''}
                onChange={e => setEditData({ ...editData, businessName: e.target.value })}
                onBlur={() => {}}
                required
                placeholder="Contoh: Restoran Sederhana"
              />
              <InputField
                id="email"
                name="email"
                type="email"
                label="Email"
                value={editData.email || ''}
                onChange={e => setEditData({ ...editData, email: e.target.value })}
                onBlur={() => {}}
                required
                placeholder="nama@email.com"
              />
              <InputField
                id="phone"
                name="phone"
                label="Telepon"
                value={editData.phone || ''}
                onChange={e => setEditData({ ...editData, phone: e.target.value })}
                onBlur={() => {}}
                required
                placeholder="08xxxxxxxxxx"
              />
              <SelectField
                id="wasteType"
                name="wasteType"
                label="Jenis Sampah"
                value={editData.wasteType || ''}
                onChange={e => setEditData({ ...editData, wasteType: e.target.value })}
                onBlur={() => {}}
                required
                options={[
                  { value: 'plastik', label: 'Plastik' },
                  { value: 'organik', label: 'Organik' },
                  { value: 'kertas', label: 'Kertas' },
                  { value: 'logam', label: 'Logam' },
                  { value: 'campuran', label: 'Campuran' },
                ]}
                placeholder="Pilih Jenis Sampah"
              />
              <InputField
                id="wasteVolume"
                name="wasteVolume"
                type="number"
                label="Volume Sampah (kg/minggu)"
                value={editData.wasteVolume?.toString() || ''}
                onChange={e => setEditData({ ...editData, wasteVolume: Number(e.target.value) })}
                onBlur={() => {}}
                required
                placeholder="Contoh: 50"
              />
              <TextAreaField
                id="address"
                name="address"
                label="Alamat"
                value={editData.address || ''}
                onChange={e => setEditData({ ...editData, address: e.target.value })}
                onBlur={() => {}}
                required
                placeholder="Alamat lengkap bisnis"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 cursor-pointer bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300"
                  onClick={() => setEditId(null)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-semibold"
                  disabled={false}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Reset Password */}
      {resetId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
            <h4 className="text-xl font-bold mb-4 text-gray-900">Konfirmasi Reset Password</h4>
            <p className="mb-6 text-gray-700">Apakah Anda yakin ingin mereset password user ini? Password baru akan digenerate dan dikirim ke email user.</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 cursor-pointer bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300"
                onClick={() => setResetId(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="px-4 py-2 cursor-pointer bg-yellow-600 text-white rounded hover:bg-yellow-700 font-semibold"
                onClick={() => { onResetPassword(resetId); setResetId(null); }}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
