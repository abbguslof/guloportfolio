# Content Authoring Guide

This is the authoring manual for **gulo.se**, my personal site. It covers writing articles, publishing projects, sharing downloads, and the Git and deployment pipeline. I publish the repository so others can read the implementation and learn from it. I do not accept outside contributions.

Source code: [github.com/abbguslof/guloportfolio](https://github.com/abbguslof/guloportfolio)

## Git Branching and Release Pipeline

The repository uses two long-lived branches.

```
feature/my-post  ───┐
                    ▼
develop branch  ────► (authoring and testing)
                    │
                    ▼  pull request (CI validation)
main branch     ────► (production at gulo.se)
```

1. **`develop`** is the working branch. Commit or merge new articles, project updates, and fixes here.
2. **`main`** is production. Merging a pull request into `main` triggers `.github/workflows/deploy.yml`, which builds and deploys the site.
3. **`.github/workflows/ci.yml`** runs `npm ci` and `npm run build` on every pull request to `main` and every push to `develop`. A broken build fails there instead of reaching production.

## Quick Content Scaffolding

Generate starter files with the built-in CLI:

```bash
# New thought, blog post, or note
npm run new:thought "my-new-article-title"

# New project entry
npm run new:project "riscv-emulator"

# New download descriptor
npm run new:download "my-backup-tool"
```

Omit the title argument and the CLI prompts you for it.

## 1. Writing Thoughts and Research Notes

Articles live in `src/content/thoughts/` as Markdown (`.md`) or MDX (`.mdx`) files.

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
# Companion Overleaf / LaTeX paper:
pdfUrl: "/downloads/my-paper.pdf"
pdfName: "Research Preprint (PDF, 380 KB)"
---
```

### Overleaf and LaTeX

If you write articles or papers in Overleaf:

1. Compile the final PDF in Overleaf and download it.
2. Copy the PDF to `public/downloads/my-paper.pdf`.
3. Add the file to your Markdown frontmatter:
   ```yaml
   pdfUrl: "/downloads/my-paper.pdf"
   pdfName: "Research Preprint (PDF, 380 KB)"
   ```
4. The article header then shows a download button, so readers can download the PDF alongside the web version.

## 2. Adding Portfolio Projects

Projects live in `src/content/projects/*.md`.

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
order: 1                                          # Lower values appear first
featured: true                                    # Show on the homepage grid
---
```

## 3. Adding Downloadable Files and Scripts

The file hub (`/files`) needs two files for every resource:

1. **The physical file**: stored in `public/downloads/<filename>`.
2. **The metadata descriptor**: stored in `src/content/downloads/<slug>.json`.

### Descriptor Schema

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

The virtual terminal mounts every file in `src/content/downloads/` under `files/`. Visitors can type `wget backup-world.sh` or `open backup-world.sh` to download it.

## 4. Updating Live Telemetry and Status

To update the status in the footer and in the terminal's `status` command:

1. Open [`src/data/status.ts`](src/data/status.ts).
2. Edit `currentStatus`:
   - `activity`: current courses or training.
   - `focus`: technical areas of interest.
   - `homelab`: server uptime and container status.
   - `availability`: internship or project availability.
   - `lastUpdated`: today's date.
3. The change appears without any markup edits.

## 5. Terminal Safety and New Commands

The interactive terminal escapes user input before rendering. If you add commands in [`src/scripts/terminal/commands.ts`](src/scripts/terminal/commands.ts):

- Escape user arguments with `ctx.escapeHtml(arg)`.
- Never insert raw user strings into `innerHTML`.
- Add a manual entry to `man` in `commands.ts`.
