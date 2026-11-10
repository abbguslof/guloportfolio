---
title: "Poking at Philips Titan OS"
description: "The TV is slow, the home screen comes from the cloud, and I want root. Early notes from a Philips 55PUS8000/12."
pubDate: 2026-10-25
category: tanke
tags:
  - Reverse Engineering
  - Hardware
  - Linux
  - Embedded
  - Networking
featured: true
draft: false
pdfUrl:
pdfName:
---

I bought a `55PUS8000/12` a few weeks ago. The panel is great. Titan OS is not.

Menus stutter. Pi-hole shows the TV talking to `app.titanos.tv`, `tiles.springserve.com`, `*.titan.wurl.tv`, `dac-api-prod.tpv-analytics.com`, and a stack of other endpoints. The home screen is a web app fetched from the cloud. The remote has no number pad.

I want root. I do not have it yet. These are the doors I have found.

## What I have

- SAM opens with `123`, `062596`, `123`, `Info`. It exports NVM and EDID to USB.
- The NVM dump is 8 KB of U-Boot-style variables with two CRC32s. If I can edit it and pass the checks, `Download from USB` might take it back.
- JointSpace answers on `1925`. It controls inputs, volume, and Ambilight. Write access needs a pairing PIN.
- Pi-hole maps the telemetry. The UI lag has a network address.

## What might work

- Serial UART at `115200 8N1`. `uart_mode=1` is set in NVM, so the header may be live.
- A USB autoscript. The vendor debug path might evaluate a file at boot.
- NVM `bootargs` injection, if the checksums are the only gate.
- Pi-hole rules while I wait, so the TV stops shouting at the internet.

## What I do not know

- Whether serial RX works. TX is one thing; a shell is another.
- Whether the bootloader has a prompt or runs straight to Linux.
- Whether the NVM checksum is the real gate or the first one.
- Whether the cloud launcher can be replaced with the local one already on the TV.

## Why it is like this

The vendor keeps the home screen on their servers. They can change it without a firmware update, sell tiles, and measure attention. You own the panel; they own the interface. The TV is a kiosk with an HDMI port.

The test leads are in the box. I will put findings in the [repo](https://github.com/abbguslof/philips-titanos-tools) as I go. Some of this will be wrong. That is the point of notes.
