---
title: "PaperMC Homelab Cluster & Proxy"
description: "Högpresterande Minecraft-serverkluster driftat på egen hårdvara med Velocity proxy, Docker och Spark-profilering."
status: "ACTIVE"
category: "Minecraft"
tech: ["Docker", "Linux / Debian", "Java 21", "Velocity", "Spark"]
repoUrl: "https://github.com"
order: 1
featured: true
---

Ett självhostat Minecraft-nätverk optimerat för maximal tick-stabilitet (20.0 TPS) och minimal minnesoverhead under hög belastning.

### Arkitektur & Prestanda
- **Proxy:** Velocity med modern forwarding och krypterad paketinspektion.
- **Backend:** PufferPanel & isolerade Docker-containrar med cgroups för CPU/RAM-kvoter.
- **Övervakning:** Spark profiler integrerat med Grafana för realtidsanalys av MSPT och garbage collection pauses.

### Nedladdningar & Serverfiler
- 📦 [Fabric 1.20.4 Performance Modpack](/files#file-fabric-server-pack)
- 📜 [Automatiserat Backup & Roteringsskript (zstd)](/files#file-mc-backup-script)

