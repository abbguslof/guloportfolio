# Security Policy

## Reporting a vulnerability

Report security issues through GitHub's private advisory form:

https://github.com/abbguslof/guloportfolio/security/advisories/new

Do not open a public issue for a vulnerability. I read every report and reply as soon as I can.

## Scope

This policy covers the live site at https://gulo.se and the code in this repository.

The browser uses a Supabase publishable key. That key is not a secret; it only allows inserts into two tables, and row level security blocks public reads. Service-role keys never go in the repository or the client bundle.

The terminal runs in the browser and exposes no real shell. Commands work on in-memory state and download links.
