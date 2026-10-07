---
title: "PaperMC Homelab Cluster & Proxy"
description: "High-performance Minecraft server cluster self-hosted on dedicated bare metal with Velocity proxy, Docker isolation, and Spark profiling."
status: "ACTIVE"
category: "Minecraft"
tech: ["Docker", "Linux / Debian", "Java 21", "Velocity", "Spark"]
repoUrl: "https://github.com"
order: 1
featured: true
---

A self-hosted Minecraft network engineered for sustained tick rate stability (20.0 TPS) and minimal GC overhead under heavy concurrent player load.

### Architecture & Performance
- **Proxy Layer:** Velocity proxy with modern modern forwarding and encrypted packet routing across backend instances.
- **Backend Containers:** PufferPanel & isolated Debian 12 Docker containers using strict cgroup CPU and RAM quotas.
- **Monitoring & Profiling:** Spark profiler integrated with Grafana dashboards for continuous inspection of MSPT (millisecond per tick) and garbage collection pauses.

### Downloads & Server Files
- 📦 [Fabric 1.20.4 Performance Modpack](/files#file-fabric-server-pack)
- 📜 [Automated Backup & Retention Script (zstd)](/files#file-mc-backup-script)
