"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <AdminGuard>
      {(token) => (
        <section className="grid gap-4">
          <h2 className="text-2xl">Create project</h2>
          <ProjectForm token={token} />
        </section>
      )}
    </AdminGuard>
  );
}
