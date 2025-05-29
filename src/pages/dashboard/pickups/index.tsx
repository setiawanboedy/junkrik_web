import { GetServerSideProps } from 'next';
import { verifyJWT } from '@/lib/jwt';
import PickupList from '@/components/pickups/PickupList';

interface PickupsPageProps {
  user: {
    id: string;
    email: string;
    businessName: string;
  };
}

export default function PickupsPage({ user }: PickupsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pickup Requests</h1>
          <p className="text-gray-600">Track your waste pickup requests and status</p>
        </div>
        <PickupList />
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
