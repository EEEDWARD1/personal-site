export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-slate-200 bg-white/85 p-5 shadow-lg shadow-slate-200/70 backdrop-blur transition-colors duration-200 hover:border-teal-200 ${className}`}
    >
      {children}
    </div>
  );
}
