import Link from "next/link"
import Card from "./ui/card"

interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
}

interface BlogCardProps {
  posts: Post[];
}

export default function BlogCard({ posts }: BlogCardProps) {
  return (
    <Card>
      <h1>Blog</h1>
      <hr className="my-2"/>
      <ul className="flex flex-col divide-y">
        {posts.map(post => (
          <li key={post.id} className="py-2">
            <Link href={`/blogs/${post.id}`} className="flex justify-between items-center hover:opacity-70">
              <span>{post.title}</span>
              <span className="text-sm opacity-50">
                {new Date(post.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}