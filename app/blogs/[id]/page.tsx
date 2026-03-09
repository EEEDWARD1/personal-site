import Card from "../../../components/ui/card"
import { getPost } from "../../../lib/api"
import Link from "next/link"

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(Number(id))

  return (
    <main className="flex flex-col gap-4">
      <Card>
        <Link href="/" className="text-sm opacity-50 hover:opacity-100">← Back</Link>
        <h1 className="mt-2">{post.title}</h1>
        <hr className="my-2"/>
        <p className="text-sm opacity-50 mb-4">
          {new Date(post.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </p>
        <p>{post.content}</p>
      </Card>
    </main>
  )
}