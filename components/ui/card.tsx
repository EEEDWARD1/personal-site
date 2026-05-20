export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition duration-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/80 ${className}`}
    >
      {children}
    </div>
  );
}
