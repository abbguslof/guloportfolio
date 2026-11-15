---
title: "A Short Guide to Rooting a Philips Titan OS TV"
description: "The fast path from stock to a root shell on a Philips Titan OS set, using a USB stick and a cold boot."
pubDate: 2026-11-10
updatedDate: 2026-11-15
category: guide
tags:
  - Reverse Engineering
  - Hardware
  - Linux
  - Embedded
featured: false
draft: false
pdfUrl:
pdfName:
---

This is the short version. The tools, evidence, detailed walkthrough, and restore path are in **[philips-titanos-tools](https://github.com/abbguslof/philips-titanos-tools)**.

This guide covers root and persistence. It does not cover the app-layer firmware update or a modified VER40 package; the repo's research notes do.

Treat this page as a starting point. The repo is the source of truth: payloads, commands, and firmware details can change. Confirm the current procedure against the repo before you run anything.

Verified on a `55PUS8000/12` (`TPA256E` / `TPN256E`, firmware `TPA256E_V056.002.236.191`). Root and persistence survived the vendor `002.236.191` update. Results on other builds are unknown.

## What you need

- A TV you own, with physical access to its USB port and AC plug.
- A spare USB stick. **It will be erased.**
- A Linux machine with `sfdisk`, `mkfs.fat`, `mount`, and Python 3.
- The TV's LAN address.

## 1. Build the USB stick

Clone the repo and run the builder against the **whole disk**:

```bash
git clone https://github.com/abbguslof/philips-titanos-tools.git
cd philips-titanos-tools
sudo ./tools/autoroot_usb.py --device /dev/sdX --host <TV_IP>
```

Use `/dev/sdb`, not `/dev/sdb1`. The tool creates an MBR/FAT32 stick with an empty label, stages the autoscript and a static BusyBox, then verifies the hashes.

The empty label matters: the TV mounts the stick at `/media/sda1`, and the boot hook looks there.

## 2. Cold boot

1. Unplug the TV from AC and wait 10 seconds.
2. Insert the stick into the USB port that enumerates as `sda`.
3. Plug the TV back in.
4. Wait at least **45 seconds**. The vendor hook sleeps 30 seconds before it reads the script.

## 3. Connect

The TV runs BusyBox `telnetd`. Plain `telnet` may show nothing because of IAC negotiation, so use a raw client:

```bash
nc <TV_IP> 2323
# or: socat -,raw,echo=0 tcp:<TV_IP>:2323
id
```

Expected:

```text
uid=0(root) gid=0(root) groups=0(root) context=system_u:system_r:initrc_t
```

That is root. Nothing was written to flash. Remove the stick and cold boot to undo it.

## 4. Make it persistent

From the root shell, pull the installer from your workstation:

```bash
# workstation, repo root
python3 -m http.server 8000 --bind 0.0.0.0

# TV shell
/tmp/busybox wget -O /tmp/persist_root.sh http://<WORKSTATION_IP>:8000/payloads/persist_root.sh
/bin/sh /tmp/persist_root.sh
```

The installer picks the boot hook your firmware reads. On most builds it appends one line to the vendor `customer_env.sh` on the writable `apdat` partition. On the reported `/swdl` variant it writes `/swdl/telnet/telnetd`. Remove the stick, cold boot, and `:2323` comes back on its own. If the port stays closed, the repo's persistent-root guide shows the `grep` checks for each hook.

## 5. Optional: SSH and durable tools

The repo documents a durable prefix at `/mtd_rwarea/apdat/opt`, static binaries on `PATH`, and a key-only Dropbear server on `:2222`. Read [the SSH note](https://github.com/abbguslof/philips-titanos-tools/blob/main/docs/research/23-dropbear-ssh-2026-11-10.md) before enabling it.

Keep telnet `:2323` as your fallback. To disable the SSH server, create `/mtd_rwarea/apdat/opt/disabled` and reboot.

## Restore to stock

Remove the USB stick for the ephemeral path. For persistence, remove the hook your firmware uses, then the shared payload:

```sh
# customer_env.sh hook
sed -i '/root_boot.sh/d' /mtd_rwarea/apdat/customer_env.sh

# /swdl hook
rm -f /swdl/telnet/telnetd
```

```sh
rm -f /mtd_rwarea/apdat/root_boot.sh /mtd_rwarea/apdat/busybox \
      /mtd_rwarea/apdat/root_boot.log /mtd_rwarea/apdat/root_boot.ready \
      /mtd_rwarea/apdat/root_boot.ready.failed
```

If `/swdl/telnet/telnetd.bak` or `/mtd_rwarea/apdat/customer_env.sh.bak` exists, inspect it before you delete it. Then cold boot. Full rollback, including SAM and NVM/EDID restore, is in [restore to stock](https://github.com/abbguslof/philips-titanos-tools/blob/main/docs/guides/restore-to-stock.md).

## Safety

- **Owned devices only.**
- This is a **physical-access** path, not a remote exploit.
- Do **not** write the boot partitions or flash a modified image. There is no proven unbrick path before the UI is up.
- Read the repo's `SECURITY.md` and the [recovery gate](https://github.com/abbguslof/philips-titanos-tools/blob/main/docs/guides/recovery-gate.md). Test the restore path before you experiment.
- The lab unit has a verified boot-area backup and a same-byte restore. A deliberately corrupted boot area is still untested.
