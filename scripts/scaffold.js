#!/usr/bin/env node
/**
 * scripts/scaffold.js
 * CLI content generator for Gulo's portfolio & digital garden.
 * Usage:
 *   node scripts/scaffold.js thought [slug-or-title]
 *   node scripts/scaffold.js project [slug-or-title]
 *   node scripts/scaffold.js download [slug-or-title]
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const type = process.argv[2]?.toLowerCase();
const inputArg = process.argv.slice(3).join(' ').trim();

const ROOT_DIR = process.cwd();
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const CONTENT_DIR = path.join(ROOT_DIR, 'src/content');

const TODAY = new Date().toISOString().slice(0, 10);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'entry-' + Date.now();
}

function toTitleCase(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  if (!['thought', 'project', 'download'].includes(type)) {
    console.log(`\n\x1b[33mUsage:\x1b[0m`);
    console.log(`  npm run new:thought [title-or-slug]`);
    console.log(`  npm run new:project [title-or-slug]`);
    console.log(`  npm run new:download [title-or-slug]\n`);
    process.exit(1);
  }

  let rawName = inputArg;
  if (!rawName) {
    const defaultPlaceholder = type === 'thought' ? 'new-system-notes' : type === 'project' ? 'new-homelab-app' : 'new-config-bundle';
    rawName = await prompt(`\x1b[36mEnter ${type} title or slug (default: ${defaultPlaceholder}): \x1b[0m`) || defaultPlaceholder;
  }

  const slug = slugify(rawName);
  const title = toTitleCase(slug);

  if (type === 'thought') {
    const targetPath = path.join(CONTENT_DIR, 'thoughts', `${slug}.md`);
    if (fs.existsSync(targetPath)) {
      console.error(`\x1b[31mError: File already exists at ${targetPath}\x1b[0m`);
      process.exit(1);
    }
    const template = fs.readFileSync(path.join(TEMPLATES_DIR, 'thought.md'), 'utf-8');
    const content = template
      .replace('Article or Research Note Title', title)
      .replace('2026-10-08', TODAY);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, 'utf-8');
    console.log(`\n\x1b[32m✓ Created new thought:\x1b[0m ${path.relative(ROOT_DIR, targetPath)}`);
    console.log(`  \x1b[90mTitle:\x1b[0m ${title}`);
    console.log(`  \x1b[90mSlug:\x1b[0m  ${slug}`);
    console.log(`  \x1b[90mDate:\x1b[0m  ${TODAY}`);
    console.log(`\x1b[36mTip:\x1b[0m If written in Overleaf/LaTeX, drop your compiled PDF in public/downloads/ and set pdfUrl: "/downloads/${slug}.pdf"!\n`);
  } else if (type === 'project') {
    const targetPath = path.join(CONTENT_DIR, 'projects', `${slug}.md`);
    if (fs.existsSync(targetPath)) {
      console.error(`\x1b[31mError: File already exists at ${targetPath}\x1b[0m`);
      process.exit(1);
    }
    const template = fs.readFileSync(path.join(TEMPLATES_DIR, 'project.md'), 'utf-8');
    const content = template.replace('Project or Infrastructure Name', title);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, 'utf-8');
    console.log(`\n\x1b[32m✓ Created new project:\x1b[0m ${path.relative(ROOT_DIR, targetPath)}`);
    console.log(`  \x1b[90mTitle:\x1b[0m ${title}`);
    console.log(`  \x1b[90mSlug:\x1b[0m  ${slug}\n`);
  } else if (type === 'download') {
    const targetPath = path.join(CONTENT_DIR, 'downloads', `${slug}.json`);
    if (fs.existsSync(targetPath)) {
      console.error(`\x1b[31mError: File already exists at ${targetPath}\x1b[0m`);
      process.exit(1);
    }
    const template = fs.readFileSync(path.join(TEMPLATES_DIR, 'download.json'), 'utf-8');
    const content = template
      .replace('Resource Display Name', title)
      .replace('package-or-script.tar.gz', `${slug}.tar.gz`)
      .replace('2026-10-08', TODAY);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, 'utf-8');
    console.log(`\n\x1b[32m✓ Created new download descriptor:\x1b[0m ${path.relative(ROOT_DIR, targetPath)}`);
    console.log(`  \x1b[90mTarget binary file:\x1b[0m public/downloads/${slug}.tar.gz`);
    console.log(`  \x1b[90mRemember to place the actual file in public/downloads/!\x1b[0m\n`);
  }
}

main().catch(err => {
  console.error('\x1b[31mScaffolding error:\x1b[0m', err);
  process.exit(1);
});
