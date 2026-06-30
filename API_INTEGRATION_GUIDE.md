# API Integration Guide

This document is the frontend contract for the current backend. It covers:

- all HTTP endpoints exposed by the API
- request and response shapes
- auth flow
- persisted table structure for the main entities

Use this instead of inferring shapes from frontend code.

## Base URLs

- Local: `http://localhost:8080`
- Production: `https://wbapi.eduardteodor.co.uk`

All request and response bodies are JSON unless stated otherwise.

## Common conventions

- Public read endpoints do not require auth.
- Admin endpoints under `/api/admin/**` require the final JWT.
- IDs are UUID strings.
- `LocalDateTime` values are ISO-8601 strings, for example `2026-06-30T14:30:00`.
- API JSON uses `camelCase`.
- Database columns use `snake_case`.
- Duplicate `slug` values return `409 Conflict`.

## Auth

The backend uses a 2-step login flow with TOTP.

### Auth flow

1. `POST /api/auth/login` with username and password.
2. If TOTP is not enabled yet, backend returns `TOTP_SETUP_REQUIRED` with:
   - `preAuthToken`
   - `secret`
   - `qrCode` as base64 PNG
3. Frontend shows QR code or secret and asks user for the 6-digit code.
4. Frontend calls `POST /api/auth/totp/verify`.
5. On success, backend returns the final JWT with `status = AUTHENTICATED`.
6. For later logins, `/api/auth/login` returns `TOTP_REQUIRED`, then frontend calls `/api/auth/totp/verify`.

### Token rules

- `preAuthToken` is temporary and only valid for TOTP completion.
- Only the final JWT can be used on admin routes.
- Send authenticated requests with:

```http
Authorization: Bearer <jwt>
```

### `POST /api/auth/login`

Request:

```json
{
  "username": "admin",
  "password": "Password123!"
}
```

Possible responses:

```json
{
  "status": "TOTP_SETUP_REQUIRED",
  "token": null,
  "preAuthToken": "string",
  "secret": "string",
  "qrCode": "base64-png"
}
```

```json
{
  "status": "TOTP_REQUIRED",
  "token": null,
  "preAuthToken": "string",
  "secret": null,
  "qrCode": null
}
```

### `POST /api/auth/totp/verify`

Request:

```json
{
  "preAuthToken": "string",
  "code": "123456"
}
```

Success response:

```json
{
  "status": "AUTHENTICATED",
  "token": "jwt",
  "preAuthToken": null,
  "secret": null,
  "qrCode": null
}
```

## Route index

### Public

- `GET /api/blog/posts`
- `GET /api/blog/posts/{slug}`
- `GET /api/projects`
- `GET /api/projects/{slug}`
- `GET /api/freelance`
- `GET /api/freelance/{slug}`

### Admin

- `GET /api/admin/blog-posts`
- `GET /api/admin/blog-posts/{id}`
- `POST /api/admin/blog-posts`
- `PUT /api/admin/blog-posts/{id}`
- `DELETE /api/admin/blog-posts/{id}`
- `GET /api/admin/projects`
- `GET /api/admin/projects/{id}`
- `POST /api/admin/projects`
- `PUT /api/admin/projects/{id}`
- `DELETE /api/admin/projects/{id}`
- `GET /api/admin/freelance-projects`
- `GET /api/admin/freelance-projects/{id}`
- `POST /api/admin/freelance-projects`
- `PUT /api/admin/freelance-projects/{id}`
- `DELETE /api/admin/freelance-projects/{id}`

## Blog API

### Public endpoints

#### `GET /api/blog/posts`

Optional query params:

- `starredOnly=true|false` default `false`

Returns published blog posts only.

Sort order:

1. `publishedAt` descending
2. `createdAt` descending

#### `GET /api/blog/posts/{slug}`

Returns one published blog post by `slug`.

### Admin endpoints

#### `GET /api/admin/blog-posts`

Returns all blog posts.

Sort order:

1. `updatedAt` descending

#### `GET /api/admin/blog-posts/{id}`

Returns one blog post by UUID.

#### `POST /api/admin/blog-posts`

Creates a blog post.

#### `PUT /api/admin/blog-posts/{id}`

Updates a blog post.

#### `DELETE /api/admin/blog-posts/{id}`

Deletes a blog post. Returns `204 No Content`.

### Blog request body

Used by both create and update:

```json
{
  "slug": "my-first-post",
  "title": "My First Post",
  "content": "Full blog post body",
  "excerpt": "Short summary",
  "starred": true,
  "published": true,
  "publishedAt": "2026-06-30T16:30:00"
}
```

Validation:

- `slug`: required, max 255
- `title`: required, max 255
- `content`: required
- `excerpt`: optional, max 500

Behavior:

- if `published=true` and `publishedAt` is omitted, backend sets it automatically
- if `published=false`, `publishedAt` may be null

### Blog response shape

```json
{
  "id": "uuid",
  "slug": "my-first-post",
  "title": "My First Post",
  "content": "Full blog post body",
  "excerpt": "Short summary",
  "starred": true,
  "published": true,
  "publishedAt": "2026-06-30T16:30:00",
  "createdAt": "2026-06-30T16:30:00",
  "updatedAt": "2026-06-30T16:30:00"
}
```

## Projects API

### Public endpoints

#### `GET /api/projects`

Optional query params:

- `featuredOnly=true|false` default `false`

Returns published projects only.

Sort order:

1. `displayOrder` ascending
2. `featured` descending
3. `createdAt` descending

#### `GET /api/projects/{slug}`

Returns one published project by `slug`.

### Admin endpoints

#### `GET /api/admin/projects`

Returns all projects.

Sort order:

1. `displayOrder` ascending
2. `updatedAt` descending

#### `GET /api/admin/projects/{id}`

Returns one project by UUID.

#### `POST /api/admin/projects`

Creates a project.

#### `PUT /api/admin/projects/{id}`

Updates a project.

#### `DELETE /api/admin/projects/{id}`

Deletes a project. Returns `204 No Content`.

### Project request body

Used by both create and update:

```json
{
  "slug": "personal-site",
  "title": "Personal Site",
  "summary": "Portfolio and admin platform",
  "description": "Long-form project description",
  "techStack": "Next.js, Spring Boot, PostgreSQL, Docker",
  "githubUrl": "https://github.com/example/personal-site",
  "liveUrl": "https://example.com",
  "thumbnailUrl": "https://cdn.example.com/project-thumb.jpg",
  "heroUrl": "https://cdn.example.com/project-hero.jpg",
  "status": "COMPLETED",
  "featured": true,
  "published": true,
  "displayOrder": 1
}
```

Validation:

- `slug`: required, max 255
- `title`: required, max 255
- `summary`: optional, max 500
- `description`: required
- `githubUrl`: optional, max 500
- `liveUrl`: optional, max 500
- `thumbnailUrl`: optional, max 500
- `heroUrl`: optional, max 500
- `status`: required, max 50

Notes:

- `techStack` is stored as one text field, not an array
- `thumbnailUrl` and `heroUrl` are nullable

### Project response shape

```json
{
  "id": "uuid",
  "slug": "personal-site",
  "title": "Personal Site",
  "summary": "Portfolio and admin platform",
  "description": "Long-form project description",
  "techStack": "Next.js, Spring Boot, PostgreSQL, Docker",
  "githubUrl": "https://github.com/example/personal-site",
  "liveUrl": "https://example.com",
  "thumbnailUrl": "https://cdn.example.com/project-thumb.jpg",
  "heroUrl": "https://cdn.example.com/project-hero.jpg",
  "status": "COMPLETED",
  "featured": true,
  "published": true,
  "displayOrder": 1,
  "createdAt": "2026-06-30T16:30:00",
  "updatedAt": "2026-06-30T16:30:00"
}
```

## Freelance API

### Public endpoints

#### `GET /api/freelance`

Optional query params:

- `featuredOnly=true|false` default `false`

Returns published freelance projects only.

Sort order:

1. `displayOrder` ascending
2. `featured` descending
3. `completedAt` descending
4. `createdAt` descending

#### `GET /api/freelance/{slug}`

Returns one published freelance project by `slug`.

### Admin endpoints

#### `GET /api/admin/freelance-projects`

Returns all freelance projects.

Sort order:

1. `displayOrder` ascending
2. `updatedAt` descending

#### `GET /api/admin/freelance-projects/{id}`

Returns one freelance project by UUID.

#### `POST /api/admin/freelance-projects`

Creates a freelance project.

#### `PUT /api/admin/freelance-projects/{id}`

Updates a freelance project.

#### `DELETE /api/admin/freelance-projects/{id}`

Deletes a freelance project. Returns `204 No Content`.

### Freelance request body

Used by both create and update:

```json
{
  "slug": "client-redesign",
  "clientName": "Acme Ltd",
  "projectTitle": "Marketing Site Redesign",
  "summary": "Modernized client website",
  "description": "Full freelance engagement details",
  "services": ["Design", "Frontend", "Backend"],
  "testimonial": "Great work.",
  "websiteUrl": "https://client-site.com",
  "thumbnailUrl": "https://cdn.example.com/freelance-thumb.jpg",
  "heroUrl": "https://cdn.example.com/freelance-hero.jpg",
  "featured": true,
  "published": true,
  "completedAt": "2026-06-30T17:00:00",
  "displayOrder": 1
}
```

Validation:

- `slug`: required, max 255
- `clientName`: optional, max 255
- `projectTitle`: required, max 255
- `summary`: optional, max 500
- `description`: required
- `websiteUrl`: optional, max 500
- `thumbnailUrl`: optional, max 500
- `heroUrl`: optional, max 500

Notes:

- `services` is persisted as a Postgres `TEXT[]`
- backend trims each entry in `services` and removes blank values
- if `services` is omitted, backend stores an empty array
- `testimonial` is optional text
- `completedAt` is optional

### Freelance response shape

```json
{
  "id": "uuid",
  "slug": "client-redesign",
  "clientName": "Acme Ltd",
  "projectTitle": "Marketing Site Redesign",
  "summary": "Modernized client website",
  "description": "Full freelance engagement details",
  "services": ["Design", "Frontend", "Backend"],
  "testimonial": "Great work.",
  "websiteUrl": "https://client-site.com",
  "thumbnailUrl": "https://cdn.example.com/freelance-thumb.jpg",
  "heroUrl": "https://cdn.example.com/freelance-hero.jpg",
  "featured": true,
  "published": true,
  "completedAt": "2026-06-30T17:00:00",
  "displayOrder": 1,
  "createdAt": "2026-06-30T17:00:00",
  "updatedAt": "2026-06-30T17:00:00"
}
```

## Table structure

These are the current persisted shapes derived from the JPA entities.

### `blog_posts`

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | UUID | no | primary key |
| `slug` | varchar(255) | no | unique |
| `title` | varchar(255) | no |  |
| `content` | text | no |  |
| `excerpt` | varchar(500) | yes |  |
| `starred` | boolean | no |  |
| `published` | boolean | no |  |
| `published_at` | timestamp | yes |  |
| `created_at` | timestamp | no | set on insert |
| `updated_at` | timestamp | no | set on insert/update |

### `projects`

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | UUID | no | primary key |
| `slug` | varchar(255) | no | unique |
| `title` | varchar(255) | no |  |
| `summary` | varchar(500) | yes |  |
| `description` | text | no |  |
| `tech_stack` | text | yes | plain text field |
| `github_url` | varchar(500) | yes |  |
| `live_url` | varchar(500) | yes |  |
| `thumbnail_url` | varchar(500) | yes | added by V7 |
| `hero_url` | varchar(500) | yes | added by V7 |
| `status` | varchar(50) | no |  |
| `featured` | boolean | no |  |
| `published` | boolean | no |  |
| `display_order` | integer | no |  |
| `created_at` | timestamp | no | set on insert |
| `updated_at` | timestamp | no | set on insert/update |

### `freelance_projects`

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | UUID | no | primary key |
| `slug` | varchar(255) | no | unique |
| `client_name` | varchar(255) | yes |  |
| `project_title` | varchar(255) | no |  |
| `summary` | varchar(500) | yes |  |
| `description` | text | no |  |
| `services` | text[] | no | defaults to empty list in entity |
| `testimonial` | text | yes |  |
| `website_url` | varchar(500) | yes |  |
| `thumbnail_url` | varchar(500) | yes | existing field |
| `hero_url` | varchar(500) | yes | added by V6 |
| `featured` | boolean | no |  |
| `published` | boolean | no |  |
| `completed_at` | timestamp | yes |  |
| `display_order` | integer | no |  |
| `created_at` | timestamp | no | set on insert |
| `updated_at` | timestamp | no | set on insert/update |

### `users`

Frontend usually does not need direct access to this table, but auth behavior depends on these fields.

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | UUID | no | primary key |
| `username` | varchar(100) | no | unique |
| `password_hash` | varchar(255) | no | never exposed by API |
| `totp_secret` | varchar(255) | yes | never exposed except setup response |
| `totp_enabled` | boolean | no | controls login flow |
| `created_at` | timestamp | no | set on insert |
| `updated_at` | timestamp | no | set on insert/update |

## Frontend implementation rules

- Use slug-based routes for public detail pages.
- Use UUID-based routes for admin edit and delete actions.
- Attach JWT to every `/api/admin/**` request.
- Treat login as a multi-step flow, not a single request.
- Expect `404` when requesting an unpublished record through a public slug route.
- Expect `204` with empty body on deletes.
- Expect nullable media fields:
  - `thumbnailUrl`
  - `heroUrl`
  - `websiteUrl`
  - `githubUrl`
  - `liveUrl`
  - `completedAt`
  - `publishedAt`

## Common status codes

- `200 OK`
- `201 Created`
- `204 No Content`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`

## Notes for Codex or other frontend agents

- Do not guess field names from DB columns; use the JSON field names shown above.
- For create and update requests, send the full object expected by the corresponding upsert payload.
- `services` must be an array of strings for freelance requests.
- `techStack` is a single string, not an array.
- Media fields for projects and freelance work are already part of both admin payloads and public responses.
