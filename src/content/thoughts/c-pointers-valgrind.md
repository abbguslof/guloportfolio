---
title: "Pointers & Memory Leaks in C — Quick Notes from the EDIT Lab"
description: "Quick reference for Valgrind flags, tracking down double-frees, and cleanly freeing circular pointer chains in the scheduler lab."
pubDate: 2026-04-02
category: "anteckning"
tags: ["C", "Chalmers", "GDB", "Valgrind"]
draft: false
---

Quick scratchpad notes from yesterday's operating systems lab session in the EDIT building at Chalmers. Writing this down so I don't have to wade through misleading StackOverflow threads next time pointer arithmetic causes grief.

### Valgrind Command That Catches Everything
```bash
valgrind --leak-check=full \
         --show-leak-kinds=all \
         --track-origins=yes \
         --verbose \
         --log-file=valgrind-out.txt \
         ./scheduler_sim
```

### The Subtle Trap: Circular Pointer Chains
When implementing the round-robin run-queue with a doubly-linked circular ring, we initially forgot to break the cycle before `free_queue()` iterated over the nodes:

```c
// WRONG: Enters an infinite loop or triggers double-free
void bad_free(Node* head) {
    Node* curr = head;
    while (curr != NULL) {
        Node* next = curr->next;
        free(curr);
        curr = next; // Loops back to head!
    }
}

// RIGHT: Explicitly break the circle first
void safe_free(Node* head) {
    if (!head) return;
    Node* curr = head->next;
    while (curr != head && curr != NULL) {
        Node* next = curr->next;
        free(curr);
        curr = next;
    }
    free(head);
}
```

### Rule of Thumb
Always assign deallocated pointers to `NULL` immediately after `free()`. Saves two hours of debugging hidden use-after-free conditions and race conditions in concurrent queue consumers.
