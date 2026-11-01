---
title: "Lab Notes: Poking at Philips Titan OS"
description: "Titan OS is sluggish and bloated. Here is the quest to jailbreak it, strip out the bloat, make the TV 'dumb' again, and my findings so far."
pubDate: 2026-10-25
category: note
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

I recently bought a 55-inch Philips TV (`55PUS8000/12`) with the new **Titan OS**. The hardware itself is solid—great panel, clean design, and signature Ambilight. But the software experience is atrocious.

Out of the box, Titan OS is painfully slow. Navigating the UI feels like wading through molasses, keypresses stutter, and opening simple settings menus takes seconds. When you look at the network logs, the reason becomes obvious: the TV isn't slow because the hardware is weak—it's slow because it's spending CPU cycles running heavy web runtimes, background-negotiating ad auctions, and spewing telemetry across dozens of tracking endpoints.

I don't want a sluggish "smart" appliance running surveillance in my living room. **I want to jailbreak it.** 

The endgame:
1. Get a root shell.
2. Strip out the bloatware and ad daemons.
3. Decouple Ambilight and input switching so they can be driven entirely via local APIs (Home Assistant).
4. Make the TV **"dumber"**—a fast, responsive, privacy-respecting monitor with zero cloud strings attached.

I haven't cracked full root yet. This is an active work-in-progress lab notebook detailing my initial attack surface reconnaissance: hardware specs, remote control quirks, extracting U-Boot partitions, reverse-engineering NVM checksums, and tracking the network noise in Pi-hole.

---

## 1. Hardware & System Profile

Underneath the plastic bezel, Philips TVs are designed and built by TPV Technology. The architecture on this chassis is a modern ARM-based embedded Linux stack.

| Parameter | Specification | Notes |
| :--- | :--- | :--- |
| **Model** | `55PUS8000/12` | 55" 4K Titan OS TV |
| **Chassis** | `TPA256E` | 2025/2026 Novatek platform |
| **SoC** | **Novatek NT72690** | Quad-Core ARM Cortex-A55 |
| **Mainboard** | **`715GD542`** | Standalone logic board (safe low-voltage DC) |
| **Bootloader** | Das U-Boot | Standard embedded Linux bootloader |
| **Firmware** | `TPA256E_V056.002.236.191` | Embedded Linux + Titan OS UI |

A huge relief when working on the `715GD542` mainboard: the power supply unit (PSU) is physically isolated on a separate board. The logic board runs entirely on safe low-voltage DC (12V, 5V, 3.3V). No dealing with mains line voltage or charged primary capacitors while probing test pads.

---

## 2. Gaining Access: Service Alignment Mode (SAM)

Most television chassis retain technician service menus. On older Philips remotes with dedicated number pads, entering SAM is documented as `0 6 2 5 9 6 + OK/Info`. 

However, on modern Titan OS models with the minimalist remote (no permanent numeric keys), getting this code to register requires a specific dance:

1. Tune the TV to an active HDMI input or broadcast channel.
2. Press the **`123`** button on the remote so the virtual/backlit numeric keypad lights up and activates.
3. Enter the standard Philips service sequence:
   ```
   0  6  2  5  9  6
   ```
4. **Important quirk:** You must press the **`123`** button again to unpress/deactivate the numeric layer.
5. Finally, press the **`Info`** button.

If timed properly, the full technician SAM overlay drops down over your current input:

```
+-----------------------------------------------------------+
|              SERVICE ALIGNMENT MODE (SAM)                 |
+-----------------------------------------------------------+
|  > System Info                                            |
|  > Clear Error Codes                                      |
|  > Option Bytes (OP #1 -> OP #30)                         |
|  > Alignments (White Balance, Panel Drive)                |
|  > NVM Editor                                             |
|  > Upload to USB                                          |
|  > Download from USB                                      |
|  > Initialize NVM                                         |
|  > BT Pairing Tables                                      |
|  > Dealer Options                                         |
+-----------------------------------------------------------+
```

### Hidden "Dealer Options"
Digging into the **Dealer Options** sub-menu revealed internal switches:
- `Set Virgin Mode`: Restores factory out-of-box setup state.
- `Store`: Toggles between Home Mode and Retail/Showroom Mode.
- `Server Environment`: Controls which backend servers the TV connects to:
  ```
  [ Prod ]   [ Acc ]   [ Dev ]   [ Test ]
  ```
Flipping this points the cloud telemetry and app loading pipelines to internal TPV development/staging clusters—an immediate target for MITM analysis once we configure TLS interception.

---

## 3. Extracting System Backups via USB (Arch Linux)

The SAM menu provides `Upload to USB`, which exports critical configuration partitions and tuner state. However, the Novatek service scripts are notoriously picky about partition schemes.

### Formatting the Drive Cleanly
Under Arch Linux, wipe any GPT/hybrid metadata and lay down an old-school MBR partition table formatted as FAT32:

```bash
# 1. Unmount existing automounts
sudo umount /dev/sdX* 2>/dev/null

# 2. Wipe old partition table & filesystem signatures
sudo wipefs -a /dev/sdX

# 3. Create a strict MBR (dos) table with a single 4GB FAT32 partition
sudo sfdisk /dev/sdX << EOF
label: dos
,4G,c,*
EOF

# 4. Format FAT32 with standard 32-bit FAT table
sudo mkfs.fat -F 32 -n "PHILIPS" /dev/sdX1
sync
```

Plug the drive into **USB Port 1**, enter SAM, and select **`Upload to USB`**.

### The Exported Filesystem Structure
The TV dumped a clean directory tree onto the thumb drive:
```
.
├── PhilipsChannelMaps/
│   └── ChannelMap_100/
│       ├── ChannelList/
│       │   ├── chanLst.bin
│       │   └── channellib/
│       │       ├── DVBC.xml
│       │       └── DVBT.xml
│       └── s2channellib/
│           ├── FLASH_FSTSECTS
│           ├── mgr_satset.db
│           └── mgr_tkgs_manage
└── SAM/
    ├── nvm_edid.data
    └── nvm_ubootdat.data
```

- **`nvm_edid.data`**: Raw binary EDID tables defining panel timings, HDR metadata, and native timings for the scaler chips.
- **`PhilipsChannelMaps/`**: Despite files ending in `.db`, these are raw binary C-struct dumps mapping tuner LNB frequencies (e.g. `0x2616` = 9750 MHz) alongside XML channel stubs.
- **`nvm_ubootdat.data`**: The prize. An 8.0 KB raw partition dump of the non-volatile U-Boot environment variables.

---

## 4. Cracking the U-Boot Checksum Algorithm

Inspecting `SAM/nvm_ubootdat.data` with `strings` immediately revealed standard U-Boot environment key-value pairs:

```ini
board_id=NT72690
board_name=715GD542
model_name=55PUS8000/12
uart_mode=1
watch_dog_timeout=1
OP1=160 000 020 068 009 037 008 236
OP2=000 000 000 000 000 000 000 000
```

Notice `uart_mode=1`—the bootloader was already compiled with serial debugging enabled!

### Checksum Reverse Engineering
If we want to edit variables (like altering `bootargs` or injecting `init=/bin/sh`) and re-flash the environment back into the TV via **`Download from USB`**, the firmware will verify integrity checksums before writing to flash.

Looking at the file in a hex editor:
- The first 4 bytes (`0x00`) looked like a standard little-endian CRC32: `5c f5 08 35` (`0x3508f55c`).
- Another 4-byte signature lived at offset `0x24`: `e1 9f f3 31` (`0x31f39fe1`).

I wrote a small Python script on Arch to brute-force possible CRC32 slices across the binary:

```python
import zlib

data = open("SAM/nvm_ubootdat.data", "rb").read()

for start in range(0, 64):
    for end in [len(data), data.rfind(b"\x00\x00") + 1, data.rfind(b"\x00\x00") + 2]:
        crc = zlib.crc32(data[start:end]) & 0xFFFFFFFF
        if crc in (0x3508f55c, 0x5cf50835, 0x31f39fe1, 0xe19ff331):
            print(f"MATCH! start=0x{start:02x} end={end} crc=0x{crc:08x}")
```

### Result: Dual Checksum Structure Decoded
```
+------------------+-----------------------------------------------------+
| Offset           | Description                                         |
+------------------+-----------------------------------------------------+
| 0x00 - 0x03      | Outer CRC32 (0x3508f55c) covering remainder of file |
| 0x04 - 0x23      | NVM partition metadata & geometry flags             |
| 0x24 - 0x27      | Inner CRC32 (0x31f39fe1) covering byte 40 to 8036   |
| 0x2B - 0x1F64    | Null-terminated ASCII key=value string environment  |
+------------------+-----------------------------------------------------+
```

Because this is standard CRC32 with no proprietary salts or asymmetric RSA signatures, we can write an injection script that modifies variables, updates both checksums, and lets us feed customized configurations back into the system through the SAM menu.

---

## 5. Local API Discovery: JointSpace REST (Port 1925)

After assigning the TV a static IP (`192.168.0.49`), port scanning uncovered Philips' local **JointSpace REST API** on port `1925`:

```bash
# Query the unauthenticated system status endpoint
curl -s http://192.168.0.49:1925/1/system | jq .
```

```json
{
  "menulanguage": "English",
  "name": "55PUS8000/12",
  "country": "Sweden",
  "serialnumber": "FZA1A2519001021",
  "softwareversion": "TPA256E_V056.002.236.191",
  "model": "55PUS8000/12",
  "operatingSystem": "Linux",
  "api_version": {
    "Major": 6,
    "Minor": 1,
    "Patch": 0
  },
  "features": {
    "ambilight": ["Ambilight"]
  },
  "security": {
    "secured_transport": true,
    "type": "digest_auth_pairing"
  }
}
```

The TV exposes low-level Ambilight control, input switching, and state queries directly over HTTP. Write operations require a one-time digest authentication handshake pairing with a 4-digit on-screen PIN.

---

## 6. Pi-hole Surveillance Audit: What is Titan OS Doing?

Connecting the TV to my network and watching Pi-hole DNS queries was an eye-opener—and immediately explained why the UI feels so sluggish. Within just 15 minutes of idle standby and home-screen navigation, the television fired hundreds of DNS requests:

```
2026-10-25 15:56:40  AAAA  dac-api-prod.tpv-analytics.com
2026-10-25 15:56:35  A     89b730ac922a41429ffca1e9dc2dbb68.mediatailor.us-east-1.amazonaws.com
2026-10-25 15:56:29  A     rightsboosterltd-scl-1-se.titan.wurl.tv
2026-10-25 15:56:20  AAAA  nrdp.logs.netflix.com
2026-10-25 15:56:16  A     customerevents.netflix.com
2026-10-25 15:55:46  A     clients3.google.com
2026-10-25 15:53:11  AAAA  app.titanos.tv
2026-10-25 15:52:21  A     download.airserver.com
2026-10-25 15:52:19  A     tiles.springserve.com
2026-10-25 15:52:12  A     certs-store.core.cloud.vewd.com
2026-10-25 15:52:11  A     events-prod01.eu.prod.titanos.tv
```

### Breaking Down the Network Signatures

#### 1. Ad Bidding & Dynamic Insertion (The Primary Culprit for Lag)
- `tiles.springserve.com` & `tv.springserve.com`: Connected TV (CTV) video ad-serving platform. It runs programmatic ad auctions in the background so the home screen can serve dynamic video tiles.
- `rightsboosterltd-scl-1-se.titan.wurl.tv`: Wurl delivers FAST (Free Ad-supported Streaming TV) channel infrastructure with real-time targeted ad replacement.
- `*.mediatailor.us-east-1.amazonaws.com`: AWS Elemental MediaTailor, used for server-side ad insertion (SSAI) to stitch ads into streaming video feeds.

Every time you move the remote cursor over the home menu, background requests hit these ad exchanges to fetch promotional video snippets and banner assets. No wonder menu navigation lags.

#### 2. The Heavy HTML5 Engine: Vewd
- `certs-store.core.cloud.vewd.com`
- `metrics.core.cloud.vewd.com`
- Titan OS is not a native C++/Qt UI; it relies on **Vewd** (formerly Opera TV) for its underlying WebKit/Chromium web app environment and HbbTV engine. Running multiple web app sandboxes on an embedded Cortex-A55 consumes memory and chokes responsiveness.

#### 3. Device Telemetry & Profiling (`TPV` & `Titan OS`)
- `dac-api-prod.tpv-analytics.com`: Data Acquisition Cloud (DAC) operated by TPV Technology. Collects device diagnostic payloads and usage metrics.
- `events-prod01.eu.prod.titanos.tv`: Titan OS telemetry ingestion endpoint hosted in AWS eu-west.
- `app.titanos.tv`: The remote web-shell and app directory loaded by the TV UI.

#### 4. The 20-Second Captive Portal Pings
Notice the repeated queries every 10–20 seconds:
```
www.google.com   (AAAA + A)
www.yahoo.com    (AAAA + A)
clients3.google.com
```
The embedded Linux network daemon runs a persistent connectivity watch dog. It queries both Google and Yahoo simultaneously to verify WAN internet connectivity without relying on a single provider. If either fails, the OS triggers its network warning toast.

---

## 7. Jailbreak Roadmap: Making the TV Dumber

We now have the layout of the board, an open service menu, verified checksum generation for U-Boot variables, a working local REST API, and a clear map of network endpoints. 

The goal isn't to build a better smart TV—it's to **strip away the smarts** until all that remains is a high-speed, local-only display:

1. **Physical Serial UART (`115200 8N1`)**: Since `uart_mode=1` is already flipped on in the U-Boot environment, hook up a 3.3V USB-TTL serial adapter to the `715GD542` logic board's debug header. Intercept the U-Boot countdown to drop into an interactive bootloader prompt.
2. **U-Boot Parameter Injection (Path to Root)**: Write a script to modify `nvm_ubootdat.data` on Arch, inject custom `bootargs` (e.g. `init=/bin/sh`, `single`, or spawning a telnet/SSH daemon), recalculate the dual CRC32 checksums, and flash back into NVM via **`Download from USB`** in the SAM menu.
3. **Bloatware Neutering**: Once root is achieved, disable the background Vewd ad-auction services, kill the SpringServe/TPV telemetry daemons, and prevent the TV from launching the cloud web-shell.
4. **Local Control & Ambilight Integration**: Use the Port 1925 JointSpace REST API to bind input switching and Ambilight directly to Home Assistant, completely cutting off the TV's internet access at the router level.
5. **Pi-hole Rules in the Meantime**: Sinkhole all SpringServe, Wurl, and TPV analytics domains while whitelisting the Google/Yahoo pings so the TV doesn't constantly complain about losing connection.

More notes and serial terminal captures to follow as soon as the test leads are soldered.
