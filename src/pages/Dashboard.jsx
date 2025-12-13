// Dashboard.jsx
export default function Dashboard({ user }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome, {user.fullName}!</h1>
      <p className="mt-2 text-gray-600">This is your dashboard.</p>
    </div>
  );
}

