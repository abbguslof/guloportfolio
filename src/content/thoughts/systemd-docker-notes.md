---
title: "Docker Compose som systemd service unit"
description: "Minnesanteckning för Debian 12: unit-mall med WantedBy och ExecStart för att containers startar rent efter reboot."
pubDate: 2026-02-18
category: "anteckning"
tags: ["Docker", "Linux", "Debian", "Homelab"]
draft: false
---

Minnesanteckning för homelab-servern. Istället för att lita enbart på Docker daemons restart-policy skapar jag en dedicerad systemd unit per Compose-stack.

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

### Aktivera
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now docker-compose-app
```

Enkelt och garanterar att nätverk och volymer stängs av kontrollerat vid server-reboots.
