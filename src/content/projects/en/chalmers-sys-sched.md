---
title: "Preemptive CPU Scheduler (Chalmers)"
description: "Simulation of round-robin and multi-level feedback queue scheduling for RISC-V architecture developed during computer science studies."
status: "COMPLETED"
category: "School"
tech: ["Rust", "C", "RISC-V", "Operating Systems", "GDB"]
repoUrl: "https://github.com"
order: 2
featured: true
---

Developed as part of the operating systems and computer architecture track in Computer Science & Engineering at Chalmers University of Technology.

### Architecture & Features
- **Context Switching:** Hardware register preservation and restoration for RISC-V user and kernel space.
- **Dynamic Scheduling:** Round-robin time-slicing and multi-level feedback queue calculating dynamic thread priorities based on I/O bursts vs compute-bound workloads.
- **Deterministic Testing:** Comprehensive test harness validating concurrency scenarios, edge cases, and zero memory leaks checked via Valgrind.

### Related Resources & Files
- 📄 [Resume — M.Sc. Computer Science & Engineering](/files#file-cv-datateknik)
- ⚙️ [Neovim C/Rust Development Environment Dotfiles](/files#file-dotfiles-neovim)
