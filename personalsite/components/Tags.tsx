export default function Tags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;

  return (
    <ul aria-label="Tags" className="flex flex-wrap gap-2 text-sm text-foreground/70">
      {tags.map((tag) => (
        <li key={tag} className="border border-line px-2 py-1 break-words">
          {tag}
        </li>
      ))}
    </ul>
  );
}
