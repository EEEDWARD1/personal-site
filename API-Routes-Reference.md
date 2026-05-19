# Personal Site API — Route Reference

**Base URL (Local):** `http://localhost:8080`  
**Base URL (Production):** `https://api.eduardteodor.co.uk`

---

## Authentication

| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| POST | `/api/auth/login` | None | `{ "username": "string", "password": "string" }` | `{ "token": "string" }` |

---

## Blog Posts

### Public

| Method | Route | Auth | Description | Response |
|--------|-------|------|-------------|----------|
| GET | `/api/blog` | None | All published posts | `200 List<BlogPost>` |
| GET | `/api/blog/homepage` | None | Starred first, then latest 3 published | `200 List<BlogPost>` |
| GET | `/api/blog/{slug}` | None | Single published post by slug | `200 BlogPost / 404` |

### Admin

| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| GET | `/api/admin/blog` | JWT | — | `200 List<BlogPost>` |
| POST | `/api/admin/blog` | JWT | BlogPost body | `201 BlogPost` |
| PUT | `/api/admin/blog/{uuid}` | JWT | BlogPost body | `200 BlogPost` |
| DELETE | `/api/admin/blog/{uuid}` | JWT | — | `204 No Content` |
| PATCH | `/api/admin/blog/{uuid}/star` | JWT | — | `200 BlogPost` |

### BlogPost Object

```json
{
    "id": "uuid",
    "userId": "uuid",
    "slug": "my-post-slug",
    "title": "Post Title",
    "content": "Full post content",
    "excerpt": "Short preview text",
    "starred": false,
    "published": true,
    "publishedAt": "2026-05-19T00:00:00",
    "createdAt": "2026-05-19T00:00:00",
    "updatedAt": "2026-05-19T00:00:00"
}
```

### Create/Update Request Body

```json
{
    "slug": "my-post-slug",
    "title": "Post Title",
    "content": "Full post content",
    "excerpt": "Short preview text",
    "starred": false,
    "published": true,
    "publishedAt": "2026-05-19T00:00:00"
}
```

---

## Projects

### Public

| Method | Route | Auth | Description | Response |
|--------|-------|------|-------------|----------|
| GET | `/api/projects` | None | All published projects | `200 List<Project>` |
| GET | `/api/projects/homepage` | None | Top 3 featured published projects | `200 List<Project>` |
| GET | `/api/projects/{uuid}` | None | Single published project by UUID | `200 Project / 404` |

### Admin

| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| GET | `/api/admin/projects` | JWT | — | `200 List<Project>` |
| GET | `/api/admin/projects/{uuid}` | JWT | — | `200 Project / 404` |
| POST | `/api/admin/projects` | JWT | Project body | `201 Project` |
| PUT | `/api/admin/projects/{uuid}` | JWT | Project body | `200 Project` |
| DELETE | `/api/admin/projects/{uuid}` | JWT | — | `204 No Content` |

### Project Object

```json
{
    "id": "uuid",
    "userId": "uuid",
    "title": "Project Title",
    "description": "Full project description",
    "summary": "Short one liner",
    "techStack": "Java, Spring Boot, PostgreSQL, Docker",
    "githubUrl": "https://github.com/EEEDWARD1/repo",
    "liveUrl": "https://eduardteodor.co.uk",
    "status": "completed",
    "featured": true,
    "published": true,
    "createdAt": "2026-05-19T00:00:00",
    "updatedAt": "2026-05-19T00:00:00"
}
```

### Create/Update Request Body

```json
{
    "title": "Project Title",
    "description": "Full project description",
    "summary": "Short one liner",
    "techStack": "Java, Spring Boot, PostgreSQL, Docker",
    "githubUrl": "https://github.com/EEEDWARD1/repo",
    "liveUrl": "https://eduardteodor.co.uk",
    "status": "completed",
    "featured": true,
    "published": true
}
```

---

## Freelance Work

### Public

| Method | Route | Auth | Description | Response |
|--------|-------|------|-------------|----------|
| GET | `/api/freelance` | None | All published freelance entries | `200 List<FreelanceWork>` |

### Admin

| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| GET | `/api/admin/freelance` | JWT | — | `200 List<FreelanceWork>` |
| GET | `/api/admin/freelance/{uuid}` | JWT | — | `200 FreelanceWork / 404` |
| POST | `/api/admin/freelance` | JWT | FreelanceWork body | `201 FreelanceWork` |
| PUT | `/api/admin/freelance/{uuid}` | JWT | FreelanceWork body | `200 FreelanceWork` |
| DELETE | `/api/admin/freelance/{uuid}` | JWT | — | `204 No Content` |

### FreelanceWork Object

```json
{
    "id": "uuid",
    "userId": "uuid",
    "clientName": "CGU Construction",
    "projectTitle": "Company Website",
    "description": "Full project description",
    "services": "Next.js, Tailwind CSS, Vercel",
    "testimonial": "Great work, highly recommend!",
    "websiteUrl": "https://cguconstruction.co.uk",
    "featured": true,
    "published": true,
    "completedAt": "2026-05-19T00:00:00",
    "createdAt": "2026-05-19T00:00:00",
    "updatedAt": "2026-05-19T00:00:00"
}
```

### Create/Update Request Body

```json
{
    "clientName": "CGU Construction",
    "projectTitle": "Company Website",
    "description": "Full project description",
    "services": "Next.js, Tailwind CSS, Vercel",
    "testimonial": "Great work, highly recommend!",
    "websiteUrl": "https://cguconstruction.co.uk",
    "featured": true,
    "published": true,
    "completedAt": "2026-05-19T00:00:00"
}
```

---

## Error Responses

All errors return a consistent JSON structure:

```json
{
    "timestamp": "2026-05-19T14:30:00",
    "status": 404,
    "error": "Not Found",
    "message": "Post with id abc-123 not found"
}
```

| Status | Meaning |
|--------|---------|
| `200` | OK |
| `201` | Created |
| `204` | No Content (successful delete) |
| `401` | Unauthorized — missing or invalid JWT |
| `403` | Forbidden — authenticated but not permitted |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## Authentication Guide

All admin routes require a Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**To get a token:**
```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "eduard",
    "password": "your-password"
}
```

Tokens expire after **24 hours**.
