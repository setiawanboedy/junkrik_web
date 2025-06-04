// src/app/admin/drivers/page.tsx
'use client';
import React, { useState } from 'react';
import { useAdminDrivers, AdminDriver } from '@/hooks/useAdminDrivers';

export default function AdminDriversPage() {
  const { drivers, loading, error, createDriver } = useAdminDrivers();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-700">Manajemen Driver</h2>
      <p className="mb-6 text-gray-600 max-w-xl">Daftar dan kelola akun driver di sini.</p>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700"
      >
        {showForm ? 'Batal' : 'Tambah Driver'}
      </button>
      {showForm && (
        <form
          onSubmit={async e => {
            e.preventDefault();
            await createDriver({ email, password, businessName, address, phone });
            // reset form
            setEmail(''); setPassword(''); setBusinessName(''); setAddress(''); setPhone('');
            setShowForm(false);
          }}
          className="mb-6 p-4 bg-white rounded shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border p-2 rounded" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="border p-2 rounded" />
            <input type="text" placeholder="Nama" value={businessName} onChange={e => setBusinessName(e.target.value)} className="border p-2 rounded" />
            <input type="text" placeholder="Alamat" value={address} onChange={e => setAddress(e.target.value)} className="border p-2 rounded" />
            <input type="text" placeholder="Telepon" value={phone} onChange={e => setPhone(e.target.value)} className="border p-2 rounded" />
          </div>
          <button type="submit" className="mt-4 px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700">Tambah</button>
        </form>
      )}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
          <table className="min-w-full text-sm text-left border-t">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 font-semibold text-gray-700">Email</th>
                <th className="py-2 px-4 font-semibold text-gray-700">Nama</th>
                <th className="py-2 px-4 font-semibold text-gray-700">Alamat</th>
                <th className="py-2 px-4 font-semibold text-gray-700">Telepon</th>
                <th className="py-2 px-4 font-semibold text-gray-700">Dibuat</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d: AdminDriver) => (
                <tr key={d.id} className="border-b hover:bg-gray-50 text-gray-700">
                  <td className="py-2 px-4">{d.email}</td>
                  <td className="py-2 px-4">{d.businessName}</td>
                  <td className="py-2 px-4">{d.address}</td>
                  <td className="py-2 px-4">{d.phone}</td>
                  <td className="py-2 px-4">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
