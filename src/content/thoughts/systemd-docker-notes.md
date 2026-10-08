---
title: "Running Docker Compose as a systemd Service Unit"
description: "Cheat-sheet for Debian 12: unit template with WantedBy and ExecStart ensuring container stacks start and stop cleanly across reboots."
pubDate: 2026-02-18
category: "anteckning"
tags: ["Docker", "Linux", "Debian", "Homelab"]
draft: false
pdfUrl: "/downloads/systemd-docker-notes.pdf"
pdfName: "systemd-docker-notes.pdf"
---

Reference note for the homelab server. Rather than relying solely on the Docker daemon's internal restart policies, I manage production Compose stacks via dedicated systemd unit files.

### Unit file: `/etc/systemd/system/docker-compose-app.service`
```ini
[Unit]
Description=Docker Compose Application Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/services/app
ExecStart=/usr/bin/docker compose up -d --remove-orphans
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

### Activation
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now docker-compose-app
```

Clean and deterministic. Ensures volumes, attached networks, and background containers gracefully unmount during host shutdown and reboot cycles.
