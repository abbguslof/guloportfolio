---
title: "Pekare & minnesläckor i C — snabbanteckning från EDIT-labbet"
description: "Snabb referens för Valgrind-flaggor, spårning av dubbel-frees och validering av cirkulära pekarkedjor i schemaläggaren."
pubDate: 2026-04-02
category: "anteckning"
tags: ["C", "Chalmers", "GDB", "Valgrind"]
draft: false
---

Snabbt kladd från gårdagens labb i Operativsystemskursen (EDIT-huset). Skriver ner det här så jag slipper googla felaktiga stackoverflow-trådar nästa gång pekare spökar.

### Valgrind-kommando som fångar allt
```bash
valgrind --leak-check=full \
         --show-leak-kinds=all \
         --track-origins=yes \
         --verbose \
         --log-file=valgrind-out.txt \
         ./scheduler_sim
```

### Den subtila fällan: Cirkulära referenser
När vi implementerade round-robin kön med en dubbellänkad cirkulär lista glömde vi att bryta ringen innan `free_queue()` itererade över noderna:

```c
// FEL: Fastnar i oändlig loop eller triggar double-free
void bad_free(Node* head) {
    Node* curr = head;
    while (curr != NULL) {
        Node* next = curr->next;
        free(curr);
        curr = next; // Når head igen!
    }
}

// RÄTT: Bryt cirkeln explicit först
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

### Tumregel
Sätt alltid avallokerade pekare till `NULL` direkt efter `free()`. Sparar 2 timmars felsökning vid dolda race conditions.
