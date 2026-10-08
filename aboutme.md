---
title: MASTER_CONTENT_SPEC – Frågeformulär
tags: [projekt, portfolio, ssot, content-spec]
status: draft
---

# MASTER_CONTENT_SPEC – Frågeformulär

> [!abstract] Syfte
> För att AI-agenterna ska kunna ersätta allt placeholder-innehåll utan att gissa eller hitta på nytt "AI lorem ipsum" behövs en **Single Source of Truth (SSOT)** – en masterfil (t.ex. `MASTER_CONTENT_SPEC.md`).
>
> I koden hänger många detaljer ihop: `fastfetch.json`, `whoami.md`, `status.ts`, `schedule.ts`, `i18n.ts`, projekt, blogginlägg, `.bashrc` och nedladdningsbara filer.

> [!tip] Så använder du formuläret
> Svara med korta punkter, stickord eller råtext under varje fråga. Du kan svara på allt direkt eller ta ett block i taget. Allt sammanställs sedan till den färdiga masterfilen.

## Innehåll

- [[#Block 1 Identitet, Persona & Kontaktuppgifter]]
- [[#Block 2 Studier, Yrkesroll & Din Faktiska Tech-Stack]]
- [[#Block 3 Det Personliga (Träning, Hobbies & Filosofi)]]
- [[#Block 4 Status-lägen & Dynamiskt Schema]]
- [[#Block 5 Portfolioprojekt, Guider, Blogginlägg & Nedladdningar]]

---

## Block 1 Identitet, Persona & Kontaktuppgifter

> [!info] Påverkar
> TUI-headern, `whoami.md`, `contact.md`, `fastfetch.json`, metadata och footer.

### 1. Namn & Alias

- [ ] Vad är ditt riktiga namn (eller det namn du vill visa utåt)?
> 	**Svar:** Gustav Löfqvist
- [ ] Vilket handle/alias vill du använda i prompten och prompttitlar? (Idag: `gulo`)
  > **Svar:** gulo
- [ ] Vad ska din dator/host heta i terminalen? (Idag: `chalmers-station` / `visitor@playground`)
  > **Svar:** chalmers-station, visitor@playground

### 2. Plats & Domän

- [ ] Vilken stad/plats ska visas i footern och i telemetrin? (Idag: `Göteborg, SE`)
  > **Svar:** Göteborg, SE
- [ ] Vilken är din primära domän? (`gulo.se`, `gulo.dev`, eller något annat?)
  > **Svar:** gulo.se
- [ ] Nätverksping och uptime: fejkad/statisk telemetri eller fasta referensvärden? (Idag: `~12ms`, startdatum `2026-01-01`)
  > **Svar:** startdatum 8 oktober 18:03 2026

### 3. Kontaktvägar (Offentliga länkar)

- [ ] GitHub-användarnamn / URL?
  > **Svar:** abbguslof
- [ ] E-postadress för kontakt?
  > **Svar:** gurra@gulo.se
- [ ] Discord-användarnamn (eller vill du dölja/ta bort Discord)?
  > **Svar:** guslof (högst oaktiv)
- [ ] LinkedIn eller Twitter/X (om du vill ha med det)?
  > **Svar:** [Gustav Löfqvist](https://www.linkedin.com/in/gustavlofqvist/)
- [ ] Ska telefonnummer finnas med alls, eller tas bort helt från `contact.md`?
  > **Svar:** telefon ska inte finnas med, utan hänvisa till mejl för mer info.

---

## Block 2 Studier, Yrkesroll & Din Faktiska Tech-Stack

> [!info] Påverkar
> `about.txt`, `school.md`, fastfetch specs, badges och hero-kort.

### 1. Sysselsättning / Utbildning

- [ ] Läser du på Chalmers i verkligheten? Vilket program och årskurs (t.ex. Datateknik D-24), eller pluggar/jobbar du med något annat?
  > **Svar:** pluggas datateknik på chalmers läser år 2 just nu
- [ ] Vilket campus/hus vistas du i om det är relevant (t.ex. Johanneberg, EDIT-huset)?
  > **Svar:** EDIT huset
- [ ] Vad söker du just nu? (T.ex. "Öppen för sommarjobb 2026", "LIA/praktik", "examensarbete", "konsultuppdrag", eller bara hobby/playground?)
  > **Svar:** Öppen för sommarjobb 2027, praktik, examensarbete men just nu är det mest playground

### 2. Hårdvara, OS & Utvecklingsmiljö

- [ ] Vilket operativsystem kör du i verkligheten? (Idag: Debian 12 / Arch + Hyprland)
  > **Svar:** Monarchy (Arch linux) och dualbootar med windows sampt macos för laptop
- [ ] Vilken shell och terminalemulator? (Idag: `zsh` / `bash`, `kitty`)
  > **Svar:** alacritty
- [ ] Vilken editor och konfiguration? (Idag: Neovim v0.10.2 med Lua dotfiles)
  > **Svar:** neovim
- [ ] Vilka är dina **verkliga** huvudspråk och teknologier? (Idag: C, Rust, RISC-V, Docker, Linux, Bash)
  > **Svar:** python, c, java, javascript

---

## Block 3 Det Personliga (Träning, Hobbies & Filosofi)

> [!warning] Vad stämmer och vad är påhittat?
> I koden finns mycket lore kring Valhallabadet, 50m simning och analogt 35mm-foto.

### 1. Sport & Fysisk Träning

- [ ] Simmar du faktiskt tävlingssimning (5–6 pass/vecka, Valhallabadet, frisim/fjäril), eller är detta rent AI-hittepå?
  > **Svar:** Är elitesimmare. Medlemm i elitegruppen GO (GROWTH OBJECTIVE). Tävlar för Mölndal allmännna simsällskap (MASS). Åbybadet och GOCO är där jag simmar. 3 gym, 5 simningar minst i veckan.
- [ ] Om det är sant: vilka distanser/detaljer stämmer?
  > **Svar:** Sprinter, Frisim och fjäril alltså 100 och 50m
- [ ] Om det inte stämmer: vad tränar du på riktigt (gym, löpning, klättring, kampsport, cykling, padel) eller vill du byta ut sportspåret mot något annat?
  > **Svar:** Är elite simmare men gillar mycket och är aktiv människa. Friluftsliv, klättra, vandra, cykla, allt är kul och röra på mig är bland det bästa jag vet. Golf, Discgolf ibland för det är kul.

### 2. Analoga / Kreativa Hobbies

- [ ] Fotograferar du analogt med 35mm-film (Olympus OM-1), eller var det ett placeholder-ämne?
  > **Svar:** Nej. Jag gillar att fota och gör det med en sony zv e10, men det är också för att filma. Ingen jättestor hobby bara kul grej.
- [ ] Vad gör du utanför skärmen/studierna som ger karaktär åt sajten? (T.ex. mekaniska tangentbord, hembryggning, musik/synth, läsning, gaming, etc.)
  > **Svar:** Utanför skrämen/studierna simmar jag mest, det är det som tar upp mest av min tid. Jag elite satsar, sm-medaljör. Är antagen RIU student på chalmers. Annars är jag väldigt nördig och rätt flyttande i det jag gör. Gillar allt tekniskt, gillar att röra på mig, gilalr att socialisera mig och är väldigt pratglad.

### 3. Homelab & Servrar

- [ ] Kör du ett Minecraft PaperMC-serverkluster på riktigt?
  > **Svar:** Driver server arkitektur med proxmox. Och har ett velocity minecraft cluster. blandat med fabric, papermc osv men ingen stor del av servern utan den gör mycket mer. Använder för att driva hemsidor, ha lite self hostade saker, för att det är roligt att lära sig, pihole osv.
- [ ] Vad består ditt faktiska homelab av? (T.ex. Pi-hole, NextDNS, Proxmox, en Raspberry Pi, TrueNAS, VPS hos Hetzner, Docker Swarm, eller inget alls?)
  > **Svar:** En serverpc som kör proxmox samt ett gäng raspberry pis lite var och här.

---

## Block 4 Status-lägen & Dynamiskt Schema

> [!info] Påverkar
> `status.ts` och `schedule.ts`. Sajten har ett system som automatiskt växlar läge mellan tentaveckor, träningsläger och hackathons.

### 1. Presets

- [ ] Vill du behålla systemet med dynamiska profiler (`regular`, `exam`, `camp`, `hackathon`, `vacation`)?
  > **Svar:** mjo det tror jag.
- [ ] Om sporten ändras (t.ex. från simläger till något annat), vad ska motsvarande lägen heta?
  > **Svar:** nej jag är simmare.

### 2. Schema & Datum

- [ ] Ska vi lägga in dina faktiska tentaveckor / semesterperioder för 2026/2027, eller föredrar du att läget står på en manuell fast profil (`auto` vs `regular`)?
  > **Svar:** jag nedan finns information om mitt schema:
  > 
  > Höst termin 2026:
  > |HÖSTTERMINEN 2026|Från||Till||
|---|---|---|---|---|
|Tentamensanmälan period 1|Mån|2026-08-10|Sön|2026-10-11|
|Tentamensanmälan omtentamen oktober|Mån|2026-08-24|Tor|2026-09-24|
|**Läsperiod 1**|Mån|2026-08-31|Sön|2026-11-01|
|Omtentamensperiod oktober/självstudier|Fre|2026-10-09|Lör|2026-10-10|
|Tentamensanmälan period 2|Mån|2026-10-12|Sön|2026-12-20|
|Tentamensperiod 1|Lör|2026-10-24|Fre|2026-10-30|
|**Läsperiod 2**|Mån|2026-11-02|Sön|2027-01-17|
|Tentamensanmälan omtentamen januari|Mån|2026-11-23|Mån|2026-12-14|
|Självstudier|Mån|2026-12-21|Ons|2026-12-30|
|Tentamensanmälan period 3|Mån|2026-12-28|Sön|2027-01-17|
|Omtentamensperiod januari/självstudier|Mån|2027-01-04|Tor|2027-01-07|
|Självstudier|Fre|2027-01-08|Fre|2027-01-08|
|Tentamensperiod 2|Lör|2027-01-09|Lör|2027-01-16|

|VÅRTERMINEN 2027|Från||Till||
|---|---|---|---|---|
|Tentamensanmälan period 3, forts.|Mån|2027-01-18|Sön|2027-02-28|
|**Läsperiod 3**|Mån|2027-01-18|Sön|2027-03-21|
|_CHARM_|Tis|2027-02-09|Ons|2027-02-10|
|Tentamensanmälan omtentamen påsk|Mån|2027-02-15|Sön|2027-03-14|
|Tentamensanmälan period 4|Mån|2027-03-01|Sön|2027-05-16|
|Tentamensperiod 3|Lör|2027-03-13|Lör|2027-03-20|
|**Läsperiod 4**|Mån|2027-03-22|Sön|2027-06-06|
|Självstudier|Tor|2027-03-25|Tis|2027-03-30|
|Omtentamensperiod påsk/självstudier|Ons|2027-03-31|Fre|2027-04-02|
|Tentamensanmälan omtentamen juni|Mån|2027-04-26|Mån|2027-05-24|
|Självstudier|Fre|2027-04-30|Fre|2027-04-30|
|Självstudier|Fre|2027-05-07|Fre|2027-05-07|
|Tentamensperiod 4|Lör|2027-05-29|Lör|2027-06-05|
|Omtentamensperiod juni|Tis|2027-06-08|Tor|2027-06-10|

Läger i turkiet: 14 oktober till 23 oktober.

Sm simning:
==**SM / U21-SM i kortbana (25m) 2026** avgörs den **9–13 december 2026** i Linköping==.
|---|---|---|
|SM / Para-SM / U21-SM (50m)|30 juni – 4 juli 2027|Norrköping (Centralbadet)|
|SM / U21-SM (25m)|15–19 december 2027 _(flyttat)_|Stockholm (Eriksdalsbadet)|

---

## Block 5 Portfolioprojekt, Guider, Blogginlägg & Nedladdningar

> [!info] Påverkar
> Kärnan som ersätter alla markdown- och json-filer.

### 1. Dina Riktiga Projekt (Portfolio)

Nämn **2 till 4 projekt** du vill visa upp istället för `mc-cluster` och `chalmers-sys-sched`.
har inga projekt jag kan nämna just nu. Några på gång med det kommer att ta lite tid innan jag kan skriva om det. Men har massor av dolda privat github repos som ska komma in här när jag är bekväm att släppa dem. 

### 2. Tankar & Guider (Bloggen)

- [ ] Du har tidigare nämnt guiden om att **"de-shittify iOS / ta bort short-form content med NextDNS, Pi-hole, blocklistor & Orion browser"**. Ska den vara en av huvudguiderna?
  > **Svar:** Bifogar dokument Men den är inte färdig. Finns inte riktigt huvudguider eööer så på sidan men det blir nog första bloggen.
- [ ] Vilka andra 2–3 ämnen vill du ha i ditt digitala arkiv? (T.ex. Linux-workflow, dotfiles, specifika labbar, personliga reflektioner?)
  > **Svar:** kommer now skriva om linux workflow och hur det funkar för mig, lite om skolan och hur jag integrerar ai, osv massor mer.

### 3. Nedladdningsbara Filer (`/files` & companion PDFs)

- [ ] Ska det finnas ett CV att ladda ner (`cv-datateknik.pdf`)?
  > **Svar:** ja
- [ ] Vilka faktiska konfigurationsfiler eller skript vill du erbjuda? (T.ex. dotfiles-arkiv, backup-skript, NextDNS-blocklistor, etc.)
  > **Svar:** Just nu inga. Men kommer tillkomma massor sen.

### 4. Språkfilosofi

- [ ] Idag är blogginläggen ("thoughts") enbart på engelska (`EN only`), medan projekt och UI är tvåspråkiga (Svenska + Engelska). Behålla så, eller allt på svenska / allt på engelska?
  > **Svar:** ja. Blogginläggen är bara engelska resten av allt är båda.

### 5. Terminal Easter Eggs & Roliga detaljer

- [ ] Vill du behålla bash-alias (`swim`, `study`, `sleep`, etc.), en dold `.secret` CTF-flagga och skämtsamma `.gitignore`-rader, fast anpassade efter din verkliga vardag?
  > **Svar:** ja en dold ctf flagga är kul

---

> [!success] Nästa steg
> Börja med det du har klart för dig (eller ta Block 1 & 2 först). Skicka sedan svaren så struktureras den definitiva masterfilen utifrån dem.