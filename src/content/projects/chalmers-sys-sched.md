---
title: "Preemptive CPU-schemaläggare (Chalmers D)"
description: "Simulering av round-robin och flernivå prioritetsschemaläggning för RISC-V arkitektur utvecklad under datateknikstudierna."
status: "COMPLETED"
category: "School"
tech: ["Rust", "C", "RISC-V", "Operating Systems", "GDB"]
repoUrl: "https://github.com"
order: 2
featured: true
---

Utvecklad som en del av operativsystem- och datorteknikspåret på Datateknik vid Chalmers Tekniska Högskola.

### Egenskaper
- Kontextbyte och registersparande för RISC-V hårdvaruregister.
- Dynamisk prioritetsberäkning baserad på I/O-bursts mot beräkningsintensiva trådar.
- Fullständig testsvit med deterministiska scenarios och minneskontroller via Valgrind.
