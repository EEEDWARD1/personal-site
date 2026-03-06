import Card from "./card";

export default function Nav() {
  return (
    <Card>
      <nav className="flex items-center justify-between px-4 py-2">
        <span className="text-zinc-100 font-bold text-lg tracking-tight">Eduard</span>
        <ul className="flex gap-6 text-zinc-400 text-sm">
          <li><a href="/" className="hover:text-sky-400 transition-colors duration-200">Home</a></li>
          <li><a href="/blog" className="hover:text-sky-400 transition-colors duration-200">Blog</a></li>
          <li><a href="/about" className="hover:text-sky-400 transition-colors duration-200">About</a></li>
        </ul>
      </nav>
    </Card>
  );
}