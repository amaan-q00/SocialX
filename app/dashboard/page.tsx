import ProtectedRoute from '@/components/ProtectedRoutes';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to your dashboard 🧙</h1>
      </div>
    </ProtectedRoute>
  );
}
