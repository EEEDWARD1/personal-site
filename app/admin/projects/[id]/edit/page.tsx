"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNotice from "@/components/admin/AdminNotice";
import ProjectForm from "@/components/admin/ProjectForm";
import { adminApi, Project } from "@/lib/api";

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();

  return (
    <AdminGuard>
      {(token) => <EditProject token={token} id={params.id} />}
    </AdminGuard>
  );
}

function EditProject({ token, id }: { token: string; id: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .project(token, id)
      .then(setProject)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load project."))
      .finally(() => setLoading(false));
  }, [token, id]);

  return (
    <section className="grid gap-4">
      <h2 className="text-2xl">Edit project</h2>
      <AdminNotice loading={loading} error={error} />
      {project ? <ProjectForm token={token} project={project} /> : null}
    </section>
  );
}
