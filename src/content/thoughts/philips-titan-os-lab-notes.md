---
title: "Lab Notes: Rooting a Philips Titan OS TV"
description: "Bench log from a Philips 55PUS8000/12: what worked, what broke, and what comes next."
pubDate: 2026-11-05
category: note
tags:
  - Reverse Engineering
  - Hardware
  - Linux
  - Embedded
  - Networking
featured: false
draft: false
pdfUrl:
pdfName:
---

Bench log, 2026-11-05. Target: `55PUS8000/12`, chassis `TPA256E` / `TPN256E`, mainboard `715GD542`, firmware `TPA256E_V056.002.236.191`. Kernel 6.1.124 on aarch64, userspace armhf. I have root. The [repo](https://github.com/abbguslof/philips-titanos-tools) has the commands and evidence, and details change.

## 2026-10-25: reconnaissance

SAM opened with `123`, `062596`, `123`, `Info`. The service menu exported NVM and EDID to a FAT32 stick labelled `PHILIPS`. The NVM wrapper is 8,036 bytes with two CRC32s; the live variables sit in `nvm_dat` on p11. JointSpace answered on `1925`, and the engineering routes gave 403 because of `tvtype: consumer`.

Pi-hole told the rest of the story: ad auctions, FAST/SSAI, Samba TV audio fingerprinting, and captive-portal pings every 10 to 20 seconds. The UI lag has a network address.

## 2026-10-30: root

A USB stick with an empty-label FAT32 partition and a boot-time autoscript gave a `uid=0` shell on TCP `:2323`. The vendor debug menu sleeps 30 seconds, then evaluates the script as root. Nothing writes to flash; pull the stick and reboot to undo it.

A line appended to the vendor `customer_env.sh` starts a script from the writable `apdat` partition on every boot. That hook makes the shell persistent without the USB stick.

## 2026-11-05: runtime mount

The boot-time `NFSB` verifier stays. A copy of the partition from offset `0x1000` mounts read-only with `mount -t squashfs`, with no RSA check and no dm-verity. A modified `NFSB` image still cannot boot or flash.

## 2026-11-05: custom rootfs

A SquashFS rootfs and an ext4 data image sit on `/swdl`, and the stock UI chroots into them. The panel, tuner, and HDMI path stay stock. The userland above them is mine.

## What works now

- A root shell from a USB cold boot.
- A persistent `root_boot.sh` hook.
- A read-only raw SquashFS mount.
- A custom rootfs chroot.
- A converted v33 SELinux policy with every type permissive. `getenforce` still prints `Enforcing`; `setenforce` returns `EINVAL`.
- JointSpace for keys, input, and Ambilight.

## Cloud UI finding

The launcher and keyboard input come from `app.titanos.tv` and `eu.app.titanos.tv`. Blocking those origins breaks the home screen and the input field that opens the keyboard. The appliance partition has an offline launcher and local keyboard assets, so a local replacement has a path. The cloud origin is still primary.

## Dead ends

- No interactive U-Boot. Serial RX is dead.
- NVM `uart_mode`, `bootdelay`, and `mds_mode` do nothing useful. Userspace `tvtype: consumer` owns the gate.
- JointSpace engineering routes return 403 from the LAN and from loopback.
- TLS pinning rejects a private CA (`DP_203`).
- `init=` injection is a brick risk with no pre-UI recovery.

## Next

- Inventory the live mounts, modules, and vendor device nodes.
- Add a static tool prefix on `apdat` and a key-only SSH server.
- Make the local rootfs the primary UI.
- Measure the LED, TCON, GPIO, I2C, and HDMI ABIs, starting with read-only queries.
- Take the remote input path.
- Remove telemetry without breaking playback, updates, and apps.
- Test the channel-map parser.

No boot-partition writes. The USB stick is the recovery path. Details change; follow the [repo](https://github.com/abbguslof/philips-titanos-tools) for exact details.
