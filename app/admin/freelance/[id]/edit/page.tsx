"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNotice from "@/components/admin/AdminNotice";
import FreelanceForm from "@/components/admin/FreelanceForm";
import { adminApi, FreelanceWork } from "@/lib/api";

export default function EditFreelancePage() {
  const params = useParams<{ id: string }>();

  return (
    <AdminGuard>
      {(token) => <EditFreelance token={token} id={params.id} />}
    </AdminGuard>
  );
}

function EditFreelance({ token, id }: { token: string; id: string }) {
  const [entry, setEntry] = useState<FreelanceWork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .freelanceEntry(token, id)
      .then(setEntry)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load entry."))
      .finally(() => setLoading(false));
  }, [token, id]);

  return (
    <section className="grid gap-4">
      <h2 className="text-2xl">Edit freelance entry</h2>
      <AdminNotice loading={loading} error={error} />
      {entry ? <FreelanceForm token={token} entry={entry} /> : null}
    </section>
  );
}
