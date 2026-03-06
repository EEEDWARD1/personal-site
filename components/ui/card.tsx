export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-md p-5 shadow-lg shadow-black/40 hover:border-zinc-500 transition-colors duration-200">
      {children}
    </div>
  );
}