const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  starred: boolean;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  summary: string;
  techStack: string;
  githubUrl: string;
  liveUrl: string;
  status: "in_progress" | "completed";
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FreelanceWork = {
  id: string;
  clientName: string;
  projectTitle: string;
  description: string;
  services: string;
  testimonial?: string | null;
  websiteUrl?: string | null;
  featured: boolean;
  published: boolean;
  completedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogPostInput = Omit<
  BlogPost,
  "id" | "createdAt" | "updatedAt"
>;
export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type FreelanceWorkInput = Omit<
  FreelanceWork,
  "id" | "createdAt" | "updatedAt"
>;

export type LoginResponse =
  | { token: string; status?: never; preAuthToken?: never }
  | { status: "MFA_REQUIRED"; preAuthToken: string; token?: never };

export type MfaSetupResponse = {
  secret: string;
  qrCode: string;
};

type FetchOptions = RequestInit & {
  token?: string | null;
};

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...init } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(
      data?.message ?? data?.error ?? "The API request failed.",
      res.status,
    );
  }

  return data as T;
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("eduard_admin_token");
}

export function setAuthToken(token: string) {
  window.localStorage.setItem("eduard_admin_token", token);
  window.localStorage.setItem(
    "eduard_admin_token_expires",
    String(Date.now() + 24 * 60 * 60 * 1000),
  );
}

export function clearAuthToken() {
  window.localStorage.removeItem("eduard_admin_token");
  window.localStorage.removeItem("eduard_admin_token_expires");
}

export function hasValidAuthToken() {
  if (typeof window === "undefined") return false;
  const token = getAuthToken();
  const expires = Number(window.localStorage.getItem("eduard_admin_token_expires"));

  if (!token || !expires || Date.now() > expires) {
    clearAuthToken();
    return false;
  }

  return true;
}

export function formatDate(value?: string | null) {
  if (!value) return "Not dated";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function splitCsv(value?: string | null) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function login(username: string, password: string) {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function verifyMfaLogin(preAuthToken: string, code: string) {
  return request<{ token: string }>("/api/auth/mfa/login", {
    method: "POST",
    body: JSON.stringify({ preAuthToken, code }),
  });
}

export async function setupMfa(token: string) {
  return request<MfaSetupResponse>("/api/auth/mfa/setup", {
    method: "POST",
    token,
  });
}

export async function verifyMfaSetup(token: string, code: string) {
  return request<{ message: string }>("/api/auth/mfa/verify-setup", {
    method: "POST",
    token,
    body: JSON.stringify({ code }),
  });
}

export const publicApi = {
  blog: () =>
    request<BlogPost[]>("/api/blog", { next: { revalidate: 300 } }),
  homepageBlog: () =>
    request<BlogPost[]>("/api/blog/homepage", { next: { revalidate: 300 } }),
  blogPost: (slug: string) =>
    request<BlogPost>(`/api/blog/${slug}`, { next: { revalidate: 300 } }),
  projects: () =>
    request<Project[]>("/api/projects", { next: { revalidate: 300 } }),
  homepageProjects: () =>
    request<Project[]>("/api/projects/homepage", {
      next: { revalidate: 300 },
    }),
  project: (id: string) =>
    request<Project>(`/api/projects/${id}`, { next: { revalidate: 300 } }),
  freelance: () =>
    request<FreelanceWork[]>("/api/freelance", {
      next: { revalidate: 300 },
    }),
};

export const adminApi = {
  blog: (token: string) => request<BlogPost[]>("/api/admin/blog", { token }),
  createBlog: (token: string, body: BlogPostInput) =>
    request<BlogPost>("/api/admin/blog", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),
  updateBlog: (token: string, id: string, body: BlogPostInput) =>
    request<BlogPost>(`/api/admin/blog/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(body),
    }),
  deleteBlog: (token: string, id: string) =>
    request<void>(`/api/admin/blog/${id}`, { method: "DELETE", token }),
  toggleBlogStar: (token: string, id: string) =>
    request<BlogPost>(`/api/admin/blog/${id}/star`, {
      method: "PATCH",
      token,
    }),
  projects: (token: string) =>
    request<Project[]>("/api/admin/projects", { token }),
  project: (token: string, id: string) =>
    request<Project>(`/api/admin/projects/${id}`, { token }),
  createProject: (token: string, body: ProjectInput) =>
    request<Project>("/api/admin/projects", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),
  updateProject: (token: string, id: string, body: ProjectInput) =>
    request<Project>(`/api/admin/projects/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(body),
    }),
  deleteProject: (token: string, id: string) =>
    request<void>(`/api/admin/projects/${id}`, { method: "DELETE", token }),
  freelance: (token: string) =>
    request<FreelanceWork[]>("/api/admin/freelance", { token }),
  freelanceEntry: (token: string, id: string) =>
    request<FreelanceWork>(`/api/admin/freelance/${id}`, { token }),
  createFreelance: (token: string, body: FreelanceWorkInput) =>
    request<FreelanceWork>("/api/admin/freelance", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),
  updateFreelance: (token: string, id: string, body: FreelanceWorkInput) =>
    request<FreelanceWork>(`/api/admin/freelance/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(body),
    }),
  deleteFreelance: (token: string, id: string) =>
    request<void>(`/api/admin/freelance/${id}`, { method: "DELETE", token }),
};
