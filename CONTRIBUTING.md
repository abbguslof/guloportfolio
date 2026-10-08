# Content Authoring & Contribution Guide

Welcome to the authoring and maintenance manual for **gulo.se**. This document outlines how to write articles, publish projects, share downloadable resources, and work with the Git branching and deployment pipeline.

---

## 🌿 Git Branching & Release Pipeline

The repository follows a two-tier branching strategy:

```
feature/my-post  ───┐
                    ▼
develop branch  ────► (Daily authoring & testing)
                    │
                    ▼  Pull Request (Automated CI validation)
main branch     ────► (Production releases to gulo.se)
```

1. **`develop` branch**: The default working branch. All new articles, project updates, and tweaks should be committed or merged here.
2. **`main` branch**: Production release branch. Merging a PR into `main` immediately triggers the automated GitHub Pages deployment workflow (`.github/workflows/deploy.yml`).
3. **Automated CI (`.github/workflows/ci.yml`)**: Automatically runs `npm ci` and `npm run build` on every pull request to `main` and push to `develop` to guarantee zero broken builds.

---

## ⚡ Quick Content Scaffolding

You can generate starter files in seconds using the built-in CLI generators:

```bash
# Create a new thought / blog post / note
npm run new:thought "my-new-article-title"

# Create a new project entry
npm run new:project "riscv-emulator"

# Create a new download descriptor
npm run new:download "my-backup-tool"
```

If you omit the title argument, the CLI will prompt you interactively.

---

## 📝 1. Writing Thoughts & Research Notes

All articles reside in `src/content/thoughts/` as standard Markdown (`.md`) or MDX (`.mdx`) files.

### Frontmatter Schema

```yaml
---
title: "Title of your article"
description: "A concise 1-2 sentence preview shown on cards and in search results."
pubDate: 2026-10-08
updatedDate: 2026-10-09 # Optional
category: "tanke"        # Options: 'tanke' | 'guide' | 'anteckning'
tags: ["Linux", "Chalmers", "C"]
featured: false          # Set true to pin to homepage
draft: false             # Set true to keep unpublished locally
# Companion Overleaf / LaTeX Paper:
pdfUrl: "/downloads/my-paper.pdf"
pdfName: "Research Preprint (PDF, 380 KB)"
---
```

### 🎓 Academic & Overleaf Workflow
If you write articles or papers in **Overleaf / LaTeX**:
1. Compile your final PDF in Overleaf and download it.
2. Copy the `.pdf` into `public/downloads/my-paper.pdf`.
3. In your Markdown post frontmatter, set:
   ```yaml
   pdfUrl: "/downloads/my-paper.pdf"
   pdfName: "Research Preprint (PDF, 380 KB)"
   ```
4. The site will automatically display a companion download banner in the article header, allowing readers to read your web Markdown notes OR download the formatted LaTeX paper.

---

## 🚀 2. Adding Portfolio Projects

All projects live in `src/content/projects/*.md`.

### Frontmatter Schema

```yaml
---
title: "Project Name"
description: "High-level summary of what the project accomplishes."
status: "ACTIVE"      # Options: 'ACTIVE' | 'MAINTAINED' | 'COMPLETED' | 'WIP' | 'ARCHIVED'
category: "School"    # Options: 'School' | 'Homelab' | 'Minecraft' | 'Web' | 'Other'
tech: ["Rust", "RISC-V", "Operating Systems"]
repoUrl: "https://github.com/abbguslof/repo-name" # Optional
liveUrl: "https://gulo.se/demo"                   # Optional
order: 1                                          # Display order (lower = higher priority)
featured: true                                    # Display on homepage featured grid
---
```

---

## 📦 3. Adding Downloadable Files & Scripts

The file hub (`/files`) combines two files for every resource:
1. **The physical file**: Stored in `public/downloads/<filename>`.
2. **The metadata descriptor**: Stored in `src/content/downloads/<slug>.json`.

### Descriptor JSON Schema

```json
{
  "name": "Minecraft 1.20 Backup Script",
  "filename": "backup-world.sh",
  "size": "974 B",
  "category": "Minecraft",
  "fileUrl": "/downloads/backup-world.sh",
  "description": "Automated snapshot script with zstd compression and rotation.",
  "usage": "chmod +x backup-world.sh && ./backup-world.sh",
  "updatedAt": "2026-10-08",
  "checksum": "sha256:4a8f9c1...",
  "tags": ["Bash", "Linux", "Minecraft"],
  "featured": true,
  "relatedProjects": ["mc-cluster"],
  "relatedThoughts": ["mc-jvm-flags"]
}
```

> **Terminal Integration**: All files in `src/content/downloads/` are automatically mounted in the virtual terminal under `files/`. Visitors can type `wget backup-world.sh` or `open backup-world.sh` to download them directly from the command line!

---

## 📟 4. Updating Live Telemetry & Status

To update the status shown in the footer and when visitors type `status` in the terminal:
1. Open [`src/data/status.ts`](file:///home/gulo/Projects/portfoliosite/src/data/status.ts).
2. Edit `currentStatus`:
   - `activity`: Current courses or training.
   - `focus`: Technical areas of interest.
   - `homelab`: Server uptime and container status.
   - `availability`: Internship or project availability.
   - `lastUpdated`: Today's date.
3. Changes appear immediately without altering markup.

---

## 🔒 5. Terminal Safety & Adding Commands

The interactive terminal uses safe DOM escaping. If you add new shell commands in [`src/scripts/terminal/commands.ts`](file:///home/gulo/Projects/portfoliosite/src/scripts/terminal/commands.ts):
- Always sanitize user-provided arguments using `ctx.escapeHtml(arg)`.
- Never insert raw user strings into `innerHTML`.
- Add manual descriptions to `man` in `commands.ts`.
