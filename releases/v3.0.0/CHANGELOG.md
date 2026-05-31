# System Overlord v3.0.0 — "Endless Horizon" Release Notes

**Release Date:** 2026-05-31  
**Type:** Major Version Release  
**Build:** v3.0.0-stable

---

## What's New

### Pillar 1: UI/UX Complete Overhaul
- **Full-screen Command Center layout** — Replaced the 3-column scrollable grid with a premium fixed-viewport design featuring a persistent top bar, left sidebar, center stage, right sidebar, and bottom status bar.
- **Four center tabs** — NETWORK (live map), HARDWARE (rack management), WARFARE (combat panel), and TERMINAL (log/events).
- **Hex-grid mesh background** — Dynamic canvas-drawn hexagonal grid replaces the static radial gradient.
- **System Vitals widget** — Left sidebar now shows real-time Bandwidth, Ops, and Thermal load as animated arc bars.
- **Animated topbar stat line** — Live data/s, $/s, Trust, and active network count always visible.
- **Premium glassmorphism panels** — All panels upgraded with backdrop-filter blur, colored border glows, and micro-animation hover lifts.
- **Bottom status bar** — Persistent HUD showing current data, rates, nodes, reboots, epoch, and heat.

### Pillar 2: Hardware Sub-Layer
- **Server Racks** — Buy racks to expand CPU, GPU, RAM, and Cooling component slots.
- **CPU Catalog** — Ryzen 9 5950X → Threadripper 7980X → Neural ASIC Mk.I → Quantum Processing Unit. Each raises MaxOps ceiling and multiplies generation.
- **GPU Catalog** — RTX 4090 → Quantum Tensor Core → Neural Renderer X. Passive Data/s generation and Creativity multipliers.
- **RAM Catalog** — DDR5 64GB → HBM3 1TB Stack → Quantum Memory Matrix. Ops buffer expansion; HBM3+ prevents Ops decay.
- **Cooling Catalog** — Tower Air → 360mm Liquid Loop → Immersion Tank → Quantum Heat Sink. Expand TDP budget to allow more components.
- **Thermal throttling system** — If power draw exceeds TDP budget, all generation is throttled proportionally. Red heat warnings at 90%+.
- **Hardware Vitals** in left sidebar and dedicated HARDWARE tab with visual rack diagram.

### Pillar 3: Procedural Network Warfare
- **Discover** — New corporate/AI networks appear on the radar every 60 seconds (reduced by Botnet size). Up to 6 live at once.
- **Breach** — Click to trigger the breach minigame. Success dominates the network.
- **Dominate** — Dominated networks passively generate Data and Credits, scaling with tier and loot multiplier.
- **Defend** — Every 40–120 seconds, dominated networks receive counter-attacks. Ops are spent to repel them; failure reduces yield by 25%.
- **Network Modifiers** — Each network rolls a random modifier: HARDENED (defense x2), LUCRATIVE (loot x3, attacks x2), HONEYPOT (BW cost), Q-ENCRYPTED (requires Creativity), GHOST (no attacks).
- **4 Network Tiers** — Scaling with Epoch count. Tier 4 networks yield 625x base loot.
- **Live Network Map** — Canvas-based force-directed visualization in the NETWORK tab. Dominated nodes pulse green; undiscovered nodes drift.
- **Network Warfare Feed** — Real-time log of all attack/breach/defend events.

### Pillar 4: Infinite Mathematical Scaling
- **Big Number Framework** — New `fBig()` formatter handles K, M, B, T, Qa, Qi, Sx, Sp, Oc, No, Dc, and beyond — up to 10^42 before switching to scientific notation.
- **Hardware-extended Ops ceiling** — MaxOps now scales through RAM/CPU installs, not just Memory purchases. No hard cap.
- **Epoch network loot scaling** — Network loot scales by `1.5^epoch` ensuring warfare stays relevant in Epoch 10+.
- **Two new Epoch Upgrades** — Network Amplifier (warfare loot x1.5/level) and HW Overclock (TDP budget x1.2/level).

### New Achievements
- **First Blood** — Dominate your first network.
- **Network Warlord** — Dominate 10 networks total.
- **Hardware Hacker** — Install your first hardware component.
- **Silicon Overlord** — Install 5 hardware components.

### New Projects
- **Network Warfare Protocol** — Counter-attack intervals doubled.
- **Hardware Bootstrap** — +1 CPU slot, +2 RAM slots per rack.

### Other Changes
- Offline progress window redesigned and shows detailed harvest breakdown.
- Breach minigame now integrates with Network Warfare (breaching a warfare target is more rewarding).
- Admin panel expanded with HW credit injection and 4 stage-skip presets.
- All number displays use new `fBig()` formatter for proper large number handling.
- Save migration: v2.7.0 (and earlier) saves are automatically migrated to v3.0.0 with a legacy detection system.

---

## Save Compatibility

| Source Version | Compatible? | Notes |
|---|---|---|
| v2.7.0 | ✅ Yes | Auto-migrated. New fields initialized to defaults. |
| v2.6.0 | ✅ Yes | Auto-migrated. |
| v2.5.0 | ✅ Yes | Auto-migrated. |
| Earlier | ⚠️ Partial | Core progress preserved, some fields may reset. |

---

## Known Issues
- Force-directed network map refreshes every 1 second (not real-time animated) to conserve performance.
- Hardware shop does not support selling/removing installed components (planned for v3.1.0).

---

## File
- `system_overlord_v3_0_0.html` — Single-file game, no external dependencies beyond Google Fonts.
