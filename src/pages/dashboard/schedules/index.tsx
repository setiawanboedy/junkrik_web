import { GetServerSideProps } from 'next';
import { verifyJWT } from '@/lib/jwt';
import ScheduleList from '@/components/schedules/ScheduleList';

interface SchedulesPageProps {
  user: {
    id: string;
    email: string;
    businessName: string;
  };
}

export default function SchedulesPage({ user }: SchedulesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pickup Schedules</h1>
          <p className="text-gray-600">Manage your regular waste pickup schedules</p>
        </div>
        <ScheduleList />
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
  }

  try {
    const user = verifyJWT(token);
    return {
      props: {
        user,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
};
