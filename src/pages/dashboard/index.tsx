import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { verifyJWT } from '@/lib/jwt';
import DashboardStats from '@/components/dashboard/DashboardStats';

interface DashboardPageProps {
  user: {
    id: string;
    email: string;
    businessName: string;
  };
}

export default function DashboardPage({ user }: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.businessName}!
          </h1>
          <p className="text-gray-600">
            Track your waste management progress and schedule pickups
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/dashboard/pickups/new"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📦</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Request Pickup</h3>
                <p className="text-gray-600 text-sm">Schedule a waste collection</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/schedules"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📅</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Schedules</h3>
                <p className="text-gray-600 text-sm">Set up regular pickups</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/reports"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">View Reports</h3>
                <p className="text-gray-600 text-sm">Track your impact</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Link
              href="/dashboard/pickups"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="text-gray-600 text-center py-8">
            <p>Recent pickup requests and schedule updates will appear here</p>
            <Link
              href="/dashboard/pickups/new"
              className="inline-flex items-center mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Request Your First Pickup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }  try {
    const user = verifyJWT(token);
    return {
      props: {
        user,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
};
