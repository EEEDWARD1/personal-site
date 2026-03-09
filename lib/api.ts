const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://wbapi.eduardteodor.co.uk';

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/blogs`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${API_BASE}/blogs/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}