---
title: "Guide: Terminal Workflow with tmux, zoxide & fzf"
description: "A breakdown of my tmux workflow and how fzf keybindings let me switch project contexts and directories without ever touching the mouse."
pubDate: 2026-01-20
category: "guide"
tags: ["Linux", "Terminal", "tmux", "fzf"]
draft: false
---

After spending countless hours configuring Linux and Hyprland, this single setup consistently saves the most time during everyday engineering work at Chalmers.

### Why Not Just Terminal Emulator Tabs?
Tabs in Alacritty or Kitty are fundamentally tied to the lifecycle of the graphical window. If your window manager restarts or you close your laptop lid, running processes terminate. With `tmux`, persistent sessions survive in the background—whether SSH'ing into a campus lab server or working locally from your desk.

### The Sessionizer Script (`tmux-sessionizer`)
Bound to `Ctrl+f` in both shell and tmux:

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

### The Result
One keystroke, three characters into the fuzzy finder, and your entire workspace for the right course or server pops open with its project root directory and Neovim buffers intact.
