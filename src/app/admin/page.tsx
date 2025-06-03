export const metadata = {
  title: 'Admin Dashboard',
  description: 'Panel admin untuk monitoring dan approval Junkrik',
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-primary-700">Dashboard Admin</h2>
      <p className="mb-6 text-gray-600 max-w-xl">
        Selamat datang di panel admin Junkrik. Di sini Anda dapat memantau pickup, approval reward, user/bisnis, dan laporan global. Gunakan menu di samping untuk navigasi fitur utama.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-semibold text-gray-700 mb-2">Pickup Hari Ini</div>
          <div className="text-3xl font-bold text-primary-600">-</div>
          <div className="text-sm text-gray-400 mt-2">Total pickup terjadwal hari ini</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-semibold text-gray-700 mb-2">Reward Pending</div>
          <div className="text-3xl font-bold text-primary-600">-</div>
          <div className="text-sm text-gray-400 mt-2">Permintaan reward menunggu approval</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-semibold text-gray-700 mb-2">User/Bisnis Aktif</div>
          <div className="text-3xl font-bold text-primary-600">-</div>
          <div className="text-sm text-gray-400 mt-2">Total user/bisnis aktif</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-semibold text-gray-700 mb-2">Volume Sampah Bulan Ini</div>
          <div className="text-3xl font-bold text-primary-600">-</div>
          <div className="text-sm text-gray-400 mt-2">Total volume sampah terkelola bulan ini</div>
        </div>
      </div>
    </div>
  );
}
