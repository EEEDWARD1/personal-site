export default function StatusMessage({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <h2 className="text-lg">{title}</h2>
      <p className="mt-2">{message}</p>
    </div>
  );
}
