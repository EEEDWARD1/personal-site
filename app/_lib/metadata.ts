import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://eduardteodor.co.uk";

export const siteDescription =
  "London-based recent Computer Science graduate building practical digital systems for people, small businesses, and teams.";

export function pageMetadata({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
  };
}
