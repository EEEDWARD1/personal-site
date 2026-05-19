"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNotice from "@/components/admin/AdminNotice";
import Card from "@/components/ui/card";
import { adminApi, BlogPost, FreelanceWork, Project } from "@/lib/api";

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      {(token) => <Dashboard token={token} />}
    </AdminGuard>
  );
}

function Dashboard({ token }: { token: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [freelance, setFreelance] = useState<FreelanceWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      adminApi.blog(token),
      adminApi.projects(token),
      adminApi.freelance(token),
    ])
      .then(([blog, projectData, freelanceData]) => {
        setPosts(blog);
        setProjects(projectData);
        setFreelance(freelanceData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load dashboard."))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <>
      <AdminNotice loading={loading} error={error} />
      {!loading && !error ? (
        <div className="grid gap-4 md:grid-cols-4">
          <SummaryCard title="Blog posts" count={posts.length} href="/admin/blog" />
          <SummaryCard title="Projects" count={projects.length} href="/admin/projects" />
          <SummaryCard title="Freelance entries" count={freelance.length} href="/admin/freelance" />
          <SecurityCard />
        </div>
      ) : null}
    </>
  );
}

function SecurityCard() {
  return (
    <Card>
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
        Security
      </p>
      <p className="mt-3 text-lg font-bold text-slate-950">Two-factor auth</p>
      <Link href="/admin/mfa-setup" className="mt-5 inline-block text-sm font-semibold text-teal-700">
        Set up MFA
      </Link>
    </Card>
  );
}

function SummaryCard({
  title,
  count,
  href,
}: {
  title: string;
  count: number;
  href: string;
}) {
  return (
    <Card>
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{count}</p>
      <Link href={href} className="mt-5 inline-block text-sm font-semibold text-teal-700">
        Manage
      </Link>
    </Card>
  );
}
