'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/hooks/useLogout';

const menu = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/pickups', label: 'Pickup' },
  { href: '/dashboard/schedules', label: 'Jadwal' },
  { href: '/dashboard/report', label: 'Laporan' },
  { href: '/dashboard/reward', label: 'Reward' },
  { href: '/dashboard/profile', label: 'Profil' },
];

export default function DashboardHeader() {
  const pathname = usePathname();
  const logout = useLogout();
  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center group">
            <div className="bg-green-600 text-white p-2 rounded-lg mr-3 group-hover:bg-green-700 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">Junkrik</h1>
            </Link>
          <nav className="hidden md:flex gap-2 lg:gap-4 items-center">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive(item.href) ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-green-50'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={logout}
            className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
