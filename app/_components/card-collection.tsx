import type { ReactNode } from "react";
import { EmptyState, ErrorState } from "@/app/_components/site-shell";
import type { ApiState } from "@/app/_lib/api";

export function CardCollection<T>({
  state,
  limit,
  emptyTitle,
  children,
  renderItem,
}: {
  state: ApiState<T[]>;
  limit?: number;
  emptyTitle: string;
  children: ReactNode;
  renderItem: (item: T) => ReactNode;
}) {
  if (!state.ok) {
    return <ErrorState message={state.message} />;
  }

  const items =
    typeof limit === "number" ? state.data.slice(0, limit) : state.data;

  if (!items.length) {
    return <EmptyState title={emptyTitle}>{children}</EmptyState>;
  }

  return <div className="card-grid">{items.map(renderItem)}</div>;
}

export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="card-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="content-card skeleton-card" key={index}>
          <div className="skeleton-media" />
          <div className="skeleton-line skeleton-line-short" />
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line-medium" />
        </div>
      ))}
    </div>
  );
}
