---
title: "Lab Notes: Rooting a Philips Titan OS TV"
description: "Bench log from a Philips 55PUS8000/12: root, a persistent shell, a verified boot-area backup, and the update path that still gates modified firmware."
pubDate: 2026-11-05
updatedDate: 2026-11-15
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

Bench log, 2026-11-15. Target: `55PUS8000/12`, chassis `TPA256E` / `TPN256E`, mainboard `715GD542`, firmware `TPA256E_V056.002.236.191`. Kernel 6.1.124 on aarch64, userspace armhf. I have root, a persistent shell, and a verified boot-area backup. The [repo](https://github.com/abbguslof/philips-titanos-tools) has the commands and evidence, and details change.

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

## 2026-11-10: persistence and SSH

The `customer_env.sh` hook survives a USB-less cold boot. A key-only Dropbear server listens on `:2222`, and BusyBox `telnetd` stays on `:2323` as the fallback. Both live on the writable `apdat` partition. The repo documents the install, the `/swdl` hook variant, and the removal path.

## 2026-11-14: vendor update and A/B activation

The app layer accepted the genuine `TIMGPKGVER40` package as `/swdl/autorun.upg`, validated it, and programmed active slot 0 (`p15`/`p17`/`p19`). The TV rebooted to the old slot; an AC-on cycle activated slot 0. Firmware stayed `002.236.191`, and root and persistence survived. Active boot0 is new. Recovery boot1 and slot 1 (`p16`/`p18`/`p20`) are the pre-update pair.

I also have full eMMC and boot-area backups in two copies. A same-byte restore test wrote the stock bytes back to `mmcblk0boot0` and `mmcblk0boot1`, read back the hashes, and cold-booted both times. A deliberately corrupted boot area is still untested, so modified boot-area writes stay off the table.

## 2026-11-14: update gate

The app-layer flow is USB package -> `/swdl/autorun.upg` -> verify -> eburner flag -> reset. `libfwup.so` forces the secure path: `nvtfw_enable_secure_boot` returns 1, and `nvtfw_sec_verify_whole_img_sign` checks an RSA signature against an embedded public key. The private key is not in the library or the app partition. A modified VER40 package needs a patched `libfwup` plus the app-layer version check.

The classic eburner is a separate flow. Its initramfs reads `/media/sda1/nvt_tv_firmware.img` from USB, not `/swdl/autorun.upg`, extracts `sys_run`, and runs `/tmp/sys_run/run.sh`. Two STBC/AC-on attempts entered it and consumed the package, then rebooted to the dashboard with no proof file. A paused-appmgr retry kept the package and did not enter. The entry trigger is not repeatable; the serial console is the next diagnostic.

## 2026-11-15: current state

Firmware `002.236.191`, active slot 0 and boot0 new, recovery slot 1 and boot1 old. `uid=0` on `:2222`, `telnetd` on `:2323`, and SELinux policy v33 with every type permissive. `/swdl/autorun.upg` is the vendor package.

The p9 metadata is mapped: `PPCH` at `0x400`/`0xa00`, `FWVR` at `0x1000`, `UPST` at `0x3600`, `BTFG` at `0x3800`, and `PKG_ready` at `0x3e00`. The NDAL V4L2 reset path is mapped too: control `0x0f170f1f` on AC-on, ioctl `0xc0185647`, and `/dev/video24`. A local helper resets the TV through the wrapper.

## What works now

- A root shell from a USB cold boot.
- A persistent `root_boot.sh` hook and key-only SSH.
- A read-only raw SquashFS mount.
- A custom rootfs chroot.
- A converted v33 SELinux policy with every type permissive. `getenforce` still prints `Enforcing`; `setenforce` returns `EINVAL`.
- The genuine VER40 USB update with A/B activation, and a verified same-byte boot-area restore.
- JointSpace for keys, input, and Ambilight.

## Cloud UI finding

The launcher and keyboard input come from `app.titanos.tv` and `eu.app.titanos.tv`. Blocking those origins breaks the home screen and the input field that opens the keyboard. The appliance partition has an offline launcher and local keyboard assets, so a local replacement has a path. The cloud origin is still primary.

## Dead ends

- No interactive U-Boot. Serial RX is dead; TX is alive on `ttyS0` at 115200.
- NVM `uart_mode`, `bootdelay`, and `mds_mode` do nothing useful. Userspace `tvtype: consumer` owns the gate.
- JointSpace engineering routes return 403 from the LAN and from loopback.
- TLS pinning rejects a private CA (`DP_203`).
- `init=` injection is a brick risk with no pre-UI recovery.
- A `gdbserver` attach to `idtv` killed the process; the app manager restarted and the UI needed a power cycle.

## Next

- Exercise the A/B pair switch through `nvt_emmc_set_boot_part_id` and the p9 slot before any modified boot-area write.
- Patch `libfwup` RSA and the app-layer version check, then build a modified VER40 component, starting with a harmless one.
- Keep the old pair as recovery and test the corrupted-image restore.
- Retry the classic eburner with the USB image and the mapped p9 metadata, and use the serial console.
- Inventory the live mounts, modules, and vendor device nodes.
- Make the local rootfs the primary UI.
- Measure the LED, TCON, GPIO, I2C, and HDMI ABIs with read-only queries.
- Remove telemetry without breaking playback, updates, and apps.
- Test the channel-map parser.

Field units (`TPN236E`, `TPN258E`, `TPN256E` variants) stay read-only. No boot-partition writes. The USB stick is the recovery path. Details change; follow the [repo](https://github.com/abbguslof/philips-titanos-tools) for exact details.
