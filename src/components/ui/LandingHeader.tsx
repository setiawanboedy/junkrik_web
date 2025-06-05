"use client";
import Link from "next/link";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function LandingHeader() {
  const { user, loading } = useAuthUser();
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Junkrik</h1>
          </div>
          <div className="flex space-x-4">
            {loading ? null : user ? (
              user.status === 'SUSPENDED' ? (
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold border border-red-300">Akun Anda disuspend</span>
              ) : (
                <Link
                  href={user.role === 'admin' ? "/admin" : "/dashboard"}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Dashboard
                </Link>
              )
            ) : (
              <Link
                href="/auth/login"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
