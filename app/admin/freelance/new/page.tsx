"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import FreelanceForm from "@/components/admin/FreelanceForm";

export default function NewFreelancePage() {
  return (
    <AdminGuard>
      {(token) => (
        <section className="grid gap-4">
          <h2 className="text-2xl">Create freelance entry</h2>
          <FreelanceForm token={token} />
        </section>
      )}
    </AdminGuard>
  );
}
