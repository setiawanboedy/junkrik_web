import AdminDashboardSummaryClient from "./AdminDashboardSummaryClient";

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Panel admin untuk monitoring dan approval Junkrik',
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Dashboard Admin</h2>
      <p className="mb-6 text-gray-600 max-w-xl">
        Selamat datang di panel admin Junkrik. Di sini Anda dapat memantau pickup, approval reward, user/bisnis, dan laporan global. Gunakan menu di atas untuk navigasi fitur utama.
      </p>
      <AdminDashboardSummaryClient />
    </div>
  );
}
