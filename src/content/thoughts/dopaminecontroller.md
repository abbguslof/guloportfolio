---
title: "Friction by Design: A Dopamine Firewall for iOS"
description: "Short-form feeds ate my evenings. I made scrolling inconvenient instead of relying on willpower."
pubDate: 2026-10-08
updatedDate: 2026-11-10
category: guide
tags:
  - Wellbeing
  - Privacy
  - DNS
  - iOS
  - Self-hosting
featured: false
draft: false
pdfUrl:
pdfName:
---

Short-form content ate my evenings. I would pick up my phone, open an app without deciding to, and surface 40 minutes later with nothing to show for it. Screen Time limits did not help: two taps and the timer is gone.

I stopped relying on discipline and made scrolling inconvenient. The setup works well enough that mindless scrolling now fails.

**Prerequisites:** a home server (a Raspberry Pi works), a free [NextDNS](https://nextdns.io) account, and an iPhone. The DNS parts work on Android too; the profile steps differ.

## Step 1: Pi-hole and Unbound at home

Pi-hole blocks ads and feeds. Unbound resolves domains itself instead of asking Google or Cloudflare, so nobody sees your lookups except the root servers.

```yaml
# compose.yaml (trimmed)
services:
  pihole:
    image: pihole/pihole:latest
    ports: ["53:53/tcp", "53:53/udp", "8080:80/tcp"]
    environment:
      PIHOLE_DNS_: "unbound#5335"
    restart: unless-stopped
  unbound:
    image: mvance/unbound:latest
    restart: unless-stopped
```

In Pi-hole's Adlists, add OISD and HaGeZi. Add the NSFW list too if you want it blocked.

## Step 2: NextDNS on cellular

NextDNS carries the same blocklists when you leave home. Create a profile, enable OISD and HaGeZi, and turn on the **Porn** category under Parental Control if you want it.

## Step 3: Stop Wi-Fi Assist from cheating

Wi-Fi Assist switches to cellular when your Wi-Fi is weak. Pi-hole answers "nope" for a blocked domain, the phone asks again over cellular, and the feed loads. Use NextDNS's `.mobileconfig` profile everywhere so blocking holds on cellular, then edit the profile to step aside on your home Wi-Fi:

```xml
<key>OnDemandRules</key>
<array>
  <dict>
    <key>Action</key><string>Disconnect</string>
    <key>SSIDMatch</key>
    <array>
      <string>HomeNetwork_5G</string>
      <string>HomeNetwork_2G</string>
    </array>
  </dict>
  <dict>
    <key>Action</key><string>Connect</string>
  </dict>
</array>
```

Put this inside the `DNSSettings` payload, swap in your SSIDs, AirDrop the file to your phone, and install it under **Settings → Profile Downloaded**.

## Step 4: Snapchat, surgically

I cannot delete Snapchat because my friends refuse to talk anywhere else. Spotlight and Stories load from different subdomains than chat does, so I block one and allow the other.

**Denylist** (feeds and analytics):
```
app-analytics-v2.snapchat.com
gcp.api.snapchat.com
us-central1-gcp.api.snapchat.com
usc1-gcp-v62.api.snapchat.com
europe-west1-gcp.api.snapchat.com
```

**Allowlist** (chat, login, notifications):
```
aws.duplex.snapchat.com
aws.api.snapchat.com
us-east4-gcp.api.snapchat.com
aws-proxy-gcp.api.snapchat.com
```

NextDNS covers subdomains. In Pi-hole, add the denylist entries as regex (for example, `(\.|^)gcp\.api\.snapchat\.com$`). Spotlight spins forever; snaps still arrive.

## Step 5: Orion and SocialFocus

Native apps hide their feeds on the same domains as everything else, so DNS cannot separate them. I deleted Instagram, YouTube, and Reddit and use them in the browser.

1. Install **Orion** from the App Store. It uses WebKit and supports Chrome and Firefox extensions.
2. Install **SocialFocus** from the Chrome Web Store inside Orion.
3. Turn off Reels, Shorts, Explore, the home feed, thumbnails, and Reddit's "get the app" popup.
4. Optional: open `instagram.com/direct/inbox`, then **Share → Add to Home Screen**. You get a DM-only icon with no feed.

## Step 6: Verify

```bash
# Home: should resolve and show the "ad" (DNSSEC validated) flag
dig @192.168.1.100 example.com +dnssec

# Cellular: should report your NextDNS profile
curl -s https://test.nextdns.io
```

Open Snapchat and tap Spotlight. If it spins, the setup is working.

## Result

Each layer leaks on its own. Together they make mindless scrolling take effort, so I skip it. I wanted the lazy path to fail.

### References

- [Pi-hole docs: Unbound](https://docs.pi-hole.net/guides/dns/unbound/)
- [SocialFocus](https://socialfocus.app/)
- [NextDNS](https://nextdns.io)
- [OISD](https://oisd.nl/)
- [HaGeZi DNS blocklists](https://github.com/hagezi/dns-blocklists)
