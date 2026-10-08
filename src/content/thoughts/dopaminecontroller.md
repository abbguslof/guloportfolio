---
title: "Friction by Design: A Dopamine Firewall for iOS"
description: Lost willpower from short-form feeds, so I figured out how to block it.
pubDate: 2026-10-08
category: guide
tags:
  - Wellbeing
featured: false
draft: false
pdfUrl:
pdfName:
---
Short-form content was eating my life. I'd pick up my phone, open an app without deciding to, and surface 40 minutes later with nothing to show for it. Screen Time limits didn't help either: two taps and the timer is gone.

So I stopped relying on discipline and made scrolling _inconvenient_. It's not perfect, but it works. I've gotten a lot of time back, and mindless scrolling now mostly just... fails.

**Prerequisites:** a home server (a Raspberry Pi is fine), a free [NextDNS](https://nextdns.io) account, and an iPhone. *(sorry andriods hehe)*

## Step 1: Pi-hole + Unbound at home
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

Then in Pi-hole's Adlists, add OISD and HaGeZi. Add the NSFW list too, because porn is a dopamine problem of its own.

## Step 2: NextDNS on cellular
Same blocklists, but they follow you out the door. Create a profile at nextdns.io, enable the same lists (OISD, HaGeZi), and turn on the **Porn** category under Parental Control.

## Step 3: Stop Wi-Fi Assist from cheating
Wi-Fi Assist quietly switches to cellular when your Wi-Fi is bad. Pi-hole answers "nope" for a blocked domain, cellular asks again, and the feed loads anyway. Rude.

The fix: use NextDNS's `.mobileconfig` profile everywhere, so the blocking still holds on cellular. Then edit the profile so it steps aside on your home Wi-Fi and lets Pi-hole take over:

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

Put this inside the `DNSSettings` payload, swap in your own SSIDs, AirDrop the file to your phone, and install it under **Settings → Profile Downloaded**.

## Step 4: Snapchat, surgically
I can't delete Snapchat, because my friends refuse to talk anywhere else. But Spotlight and Stories load from different subdomains than chat does. Block one, allow the other.

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

NextDNS covers subdomains automatically. In Pi-hole, add the denylist entries as regex (e.g. `(\.|^)gcp\.api\.snapchat\.com$`). Result: Spotlight spins forever, snaps still arrive.

## Step 5: Orion + SocialFocus
Native apps hide their feeds on the same domains as everything else, so DNS can't separate them. I deleted Instagram, YouTube and Reddit and use them in the browser instead.

1. Install **Orion** from the App Store. It's WebKit (fast), but supports Chrome and Firefox extensions.
2. Install **SocialFocus** from the Chrome Web Store, inside Orion.
3. Turn off the bait: Reels, Shorts, Explore, the home feed, thumbnails and Reddit's "get the app" popup.
4. Optional: open `instagram.com/direct/inbox`, then **Share → Add to Home Screen**. You get a DM-only icon with no feed attached.

## Step 6: Verify
```bash
# Home: should resolve and show the "ad" (DNSSEC validated) flag
dig @192.168.1.100 example.com +dnssec

# Cellular: should report your NextDNS profile
curl -s https://test.nextdns.io
```

Then open Snapchat and tap Spotlight. If it spins, you're done.
## Result
Each layer leaks a little on its own. Together, consuming anything without intent takes real effort, so mostly I don't. The goal was never to be more disciplined. It was to make the lazy path a dead end.

### References
- [Pi-hole docs: Unbound](https://docs.pi-hole.net/guides/dns/unbound/)
- [SocialFocus]([https://github.com/hagezi/dns-blocklists](https://socialfocus.app/))
- [NextDNS](https://nextdns.io)