# System Overlord v2.2.0 — "The Threat Level Overhaul"
**Release Date:** 2026-05-30

This major update completely redesigns how "Detection" works, removing frustrating elements and replacing them with a highly strategic, risk-reward Threat Level system.

---

## 🚨 Complete Overhaul: Threat Level System

The passive 0-100% Detection heat mechanic, and the random "Lockdown" 30-second timeouts, have been entirely removed. In their place is the **Network Threat Level** system.

### How It Works
You now manually select your **Network Threat Level** (Levels 1 to 5) from a new UI panel on your dashboard.
Higher threat levels grant massive multipliers but continuously drain your resources.

- **Level 1 (Secure):** x1.0 multipliers, no resource drain.
- **Level 2 (Monitored):** x1.5 multipliers, drains 5 Ops/s.
- **Level 3 (Restricted):** x3.0 multipliers, drains 15 Ops/s.
- **Level 4 (Classified):** x6.0 multipliers, drains 50 Ops/s + 1,000 Bandwidth/s.
- **Level 5 (Black Site):** x15.0 multipliers, drains 200 Ops/s + 5,000 Bandwidth/s.

### The Penalty
If you cannot afford the continuous resource drain at your active Threat Level, countermeasure algorithms will activate. Your Botnet Nodes will be rapidly destroyed until you manually retreat to Level 1.

---

## ⚡ Streamlined Bandwidth Management

Bandwidth management in the early-to-mid game has been significantly streamlined to reduce tedious clicking.

- **Auto-Purchase Core:** Bandwidth auto-negotiation is now an inherent behavior in the engine from the start of the game. If you run out of Bandwidth while extracting data or running extractors, the system will automatically buy more as long as you have the credits.
- **New Project:** The old `Auto-Negotiate Bandwidth` project has been replaced with `Bandwidth Expansion`. This new project permanently increases the amount of bandwidth you buy per purchase by 50%.

---

## 🧩 Repurposed Stealth Projects & Events

All projects, upgrades, and random events that previously interacted with the old Detection mechanic have been rewritten to hook into the new Threat Level mechanics.

### Stealth Projects
Projects that used to reduce Detection heat generation now permanently apply percentage-based reductions to the massive Ops and Bandwidth drains incurred at high Threat Levels.
- *Stealth Protocols* (Project)
- *Distributed Proxy* (Project)
- *Neural Firewall* (Project)
- *Ghost Protocol* (Prestige Upgrade)
- *Ghost Matrix* (Epoch Upgrade)

### Random Events
Random events like *Government Investigation*, *Rival AI*, and *Whistleblower* now directly threaten your Botnet Nodes instead of arbitrarily pushing a detection bar.
Additionally, failing a Breach Protocol minigame will now destroy a Botnet Node instead of adding flat detection heat.

---

## 📁 Files

- `system_overlord_v2_2_0.html` — Main game file
- `release_notes.md` — This file
