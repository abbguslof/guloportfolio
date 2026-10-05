---
title: "Guide: Terminalflöde med tmux, zoxide och fzf"
description: "En genomgång av min tmux-konfiguration och hur fzf-bindings gör att jag byter kontext och mappar utan att röra musen."
pubDate: 2026-01-20
category: "guide"
tags: ["Linux", "Terminal", "tmux", "fzf"]
draft: false
---

Efter att ha lagt orimligt många timmar på att konfigurera Linux och Hyprland är det här den enskilda setupen som sparar mest tid i vardagen på Chalmers.

### Varför inte bara flikar i terminalemulatorn?
Flikar i Alacritty eller Kitty är knutna till GUI-fönstret. Kraschar terminalen eller om man stänger locket dör processerna. Med `tmux` lever sessionerna kvar i bakgrunden, oavsett om man kopplar upp sig via SSH från en labbsal eller sitter hemma vid skrivbordet.

### Sessionizer-skriptet (`tmux-sessionizer`)
Kopplat till `Ctrl+f` i shell och tmux:

```bash
#!/usr/bin/env bash
if [[ $# -eq 1 ]]; then
    selected=$1
else
    selected=$(find ~/Projects ~/Chalmers ~/Homelab -mindepth 1 -maxdepth 1 -type d | fzf)
fi

if [[ -z $selected ]]; then
    exit 0
fi

selected_name=$(basename "$selected" | tr . _)
tmux_running=$(pgrep tmux)

if [[ -z $TMUX ]] && [[ -z $tmux_running ]]; then
    tmux new-session -s $selected_name -c $selected
    exit 0
fi

if ! tmux has-session -t=$selected_name 2> /dev/null; then
    tmux new-session -ds $selected_name -c $selected
fi

tmux switch-client -t $selected_name
```

### Resultat
Ett knapptryck, tre bokstäver i fuzzy-findern, och hela arbetsytan för rätt kurs eller server öppnas med rätt rotkatalog och Neovim-buffertar redo.
