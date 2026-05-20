export default function SectionHeader({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="mt-2 text-2xl sm:text-3xl">
        {title}
      </h2>
      {children ? <div className="mt-3 text-slate-600">{children}</div> : null}
    </div>
  );
}
