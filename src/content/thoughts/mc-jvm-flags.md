---
title: "Optimerade JVM-flaggor för PaperMC 1.20"
description: "Hur jag konfigurerade Aikar's flags och G1GC för stabil 20 TPS under hög serverbelastning."
pubDate: 2026-03-15
tags: ["Minecraft", "Linux", "Sysadmin"]
draft: false
---

När man driftar en community-server för Minecraft är den största fienden sällan ren CPU-cykelbrist, utan ojämna Garbage Collection-pauser (GC pauses). 

Standardinställningarna för OpenJDK 21 fungerar bra för allmänna webbservrar, men i Minecraft leder en paus på mer än 50ms direkt till en tappad tick och märkbart lagg för spelarna.

### Aikar's Flags med finjustering
Genom att sätta `InitiatingHeapOccupancyPercent` och styra regionstorleken för G1GC minimerade vi pauser från 120ms ner till under 15ms:

```bash
java -Xms12G -Xmx12G -XX:+UseG1GC \
  -XX:+ParallelRefProcEnabled \
  -XX:MaxGCPauseMillis=20 \
  -XX:+UnlockExperimentalVMOptions \
  -XX:+DisableExplicitGC \
  -XX:+AlwaysPreTouch \
  -XX:G1NewSizePercent=30 \
  -XX:G1MaxNewSizePercent=40 \
  -XX:G1ReservePercent=20 \
  -XX:G1HeapWastePercent=5 \
  -XX:G1MixedGCCountTarget=4 \
  -XX:InitiatingHeapOccupancyPercent=15 \
  -XX:G1MixedGCLiveThresholdPercent=90 \
  -XX:G1RSetUpdatingPauseTimePercent=5 \
  -XX:SurvivorRatio=32 \
  -XX:+PerfDisableSharedMem \
  -XX:MaxTenuringThreshold=1 \
  -jar paper.jar --nogui
```

### Resultat
Realtidsmätningar via Spark visade att 99.8% av alla ticks låg under 18ms MSPT, även när flera spelare genererade ny terräng samtidigt.
