export default function AdminNotice({
  loading,
  error,
}: {
  loading?: boolean;
  error?: string | null;
}) {
  if (loading) {
    return (
      <div className="rounded-md border border-slate-200 bg-white/85 p-5">
        <p>Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-5">
        <h2 className="text-lg text-red-900">Something went wrong</h2>
        <p className="mt-2 text-red-700">{error}</p>
      </div>
    );
  }

  return null;
}
