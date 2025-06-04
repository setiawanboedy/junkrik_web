"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/hooks/useLogout';

const adminMenu = [
  { href: '/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/pickups', label: 'Pickup', icon: '🚚' },
  { href: '/admin/drivers', label: 'Drivers', icon: '🚚' },
  { href: '/admin/reward', label: 'Approval Reward', icon: '🎁' },
  { href: '/admin/users', label: 'User/Bisnis', icon: '👤' },
  { href: '/admin/reports', label: 'Laporan', icon: '📊' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const logout = useLogout();
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Junkrik Admin</h1>
          </div>
          <nav className="flex gap-2 lg:gap-4 items-center">
            {adminMenu.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={item.href !== '/admin'}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none
                    ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-green-50'}`}
                >
                  {/* <span className="text-lg" aria-hidden>{item.icon}</span>  */}
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500 font-semibold bg-gray-100 px-3 py-1 rounded-full">Admin</div>
            <button
              onClick={logout}
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors ml-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// NOTE: Komponen ini dipindahkan ke src/components/admin/AdminHeader.tsx
