### v3.2.0 - The AI LAB & Complete Polish
*   **AI LAB Update:** Added a major new gameplay mechanic! You can now spend massive amounts of Ops and Data to train Neural Automations (Auto-Extractor, Subversion Spammer, and Auto-Breach Protocol). Automations reset on reboot but allow true idle scaling.
*   **Animated Toggles:** Reworked the Settings menu (Tooltips and CRT Scanlines) to use sleek, animated sliding pill toggles.
*   **Overlap Bug Fixed:** Fixed a layout rendering bug where the Network map and Terminal tab would overlap elements.
*   **Mojibake Annihilation:** Conducted a deep-clean of the source code to eliminate every single mangled emoji that appeared as gibberish across achievements, the market, network targets, and terminal logs.

### v3.1.1 - Clean Text Hotfix
*   **Gibberish Removed:** Hunted down and eliminated a huge set of mangled characters/emojis from achievements, logs, and network displays. Replaced them with clean unicode symbols.

### v3.1.0 - UI Polish & God Mode
*   **Settings Expansion:** Added CRT Scanline toggles, global Tooltips toggle, and Save Management (Export/Import) buttons.
*   **Admin Panel Overhaul:** Replaced basic buttons with a robust "God Mode" direct injection system, allowing specific custom inputs. Added system overrides for Threat Levels, Ops, and Thermal Heat.
*   **Tooltips Expansion:** Added a global dynamic tooltip engine with deep coverage across Resources, Vitals, the Top Bar, Extract buttons, and Tabs.
*   **Version Link:** The game version text is now a clickable link directly back to the GitHub source.
*   **Save Chain Update:** Upgraded local storage save architecture to cleanly support v3.1.0 while maintaining fallback to v3.0.0 and older.


# Changelog

All notable changes to this project will be documented in this file.

## [v3.0.0] - "Endless Horizon" â€” 2026-05-31
### Added
- **Pillar 1 â€” Full-Screen Command Center UI:** Completely replaced the 3-column grid layout with a premium full-viewport design featuring a persistent top bar, left sidebar, center stage with four tabs (NETWORK, HARDWARE, WARFARE, TERMINAL), right sidebar, and bottom status bar. Hex-grid mesh background, System Vitals widget, animated topbar stats.
- **Pillar 2 â€” Hardware Sub-Layer:** Full server rack management system. Install CPUs (Ryzen 9 5950X â†’ Quantum Processing Unit), GPUs (RTX 4090 â†’ Neural Renderer X), RAM (DDR5 â†’ Quantum Memory Matrix), and Cooling units. Each raises the MaxOps ceiling, generates passive Data/s, and multiplies generation. Thermal throttling system penalizes overloaded racks.
- **Pillar 3 â€” Procedural Network Warfare:** Procedurally generated corporate and AI networks discovered every 60 seconds. Breach via the existing minigame, dominate for passive income, and defend against counter-attacks using Ops. Five network modifiers (HARDENED, LUCRATIVE, HONEYPOT, Q-ENCRYPTED, GHOST). Four scaling tiers tied to Epoch count. Live canvas network map and real-time Warfare Feed.
- **Pillar 4 â€” Infinite Mathematical Scaling:** New `fBig()` big number formatter supporting K â†’ Dd (10^42) before scientific notation fallback. Hardware-extended MaxOps with no hard ceiling. Two new Epoch Upgrades: Network Amplifier and HW Overclock.
- **Save Migration:** Auto-migrates all saves from v2.5.0 through v2.7.0. New fields initialized to defaults. No data loss.
- **Four New Achievements:** First Blood, Network Warlord, Hardware Hacker, Silicon Overlord.
- **Two New Projects:** Network Warfare Protocol, Hardware Bootstrap.

## [v2.7.0] - The Deep Web Update
### Added
- **Offline Progress (Sleep Mode):** The system now tracks the `lastSaveTime` and calculates passive income (Data, Credits, Ops) for up to 4 hours of offline time. A "SYSTEM AWAKENED" report overlays the screen upon returning.
- **Active Hacking Minigame:** Manually extracting data now has a 2% chance to trigger a "Firewall Intrusion" event. Players have 3 seconds to input a sequence of WASD keys to receive a massive reward burst.
- **Procedural UI Sound Effects:** Expanded the Web Audio API `AudioEngine` to generate high-quality synthesized sound effects for hovering, clicking, failing, and succeeding without relying on external assets.

### Fixed
- Fixed legacy initialization issues with the `saveGame()` and `loadGame()` fallback chains.
- Adjusted the boot sequence to reflect the new kernel version `v2.7.0`.

## [v2.6.0] - The Premium Aesthetics Update
### Added
- **Typography Upgrade:** Integrated `Inter` as the primary sans-serif font for UI elements, reserving `Share Tech Mono` for numerical data and terminal logs to create a sleek, modern hierarchy.
- **Advanced Glassmorphism:** Rebuilt dashboard panels with layered drop shadows, subtle inner borders, and refined backdrop filters to simulate physical frosted glass.
- **Animated Gradients:** Replaced the static background with a breathing, multi-radial mesh gradient. All progress bars now feature an animated shimmer effect.
- **Dynamic Interactions:** Interactive elements now physically lift and cast glowing shadows on hover.


## [v2.5.0] - The Polish Update
### Added
- **Cinematic Ending:** Reaching "The Singularity" now triggers a dramatic narrative sequence and visual takeover instead of a simple alert box.
- **Dynamic Soundscape:** Added an ambient drone track via the Web Audio API that dynamically shifts in pitch and intensity based on your Threat Level and Ops generation.
- **Visual Heartbeat Core:** Added a geometric core to the dashboard that physically pulses based on your system's data extraction and processing speed.
- **Threat Glitches:** The UI now visibly glitches and tears when operating at Threat Level 4 or 5.
- **Onboarding Tutorial:** New players will now experience a guided terminal sequence during their first boot to help them grasp the core extraction loop.

## [v2.4.1] - 2026-05-30
### Fixed & Improved
- **Early-Game Balance:** Changed the new "Subvert Network" mechanic to cost Credits and Data instead of Ops and Data. This fixes an issue where the market capacity was hard-locked in the early game before the Neural Compute module was unlocked.
- **UI Polish:** Added proper styling and hover states to the Market Algorithms dropdown and Subversion button to match the premium dark theme.

## [v2.4.0] - 2026-05-30
### Added
- **Market Algorithms:** Replaced manual price adjustments with automated strategies (Steady Drip, Data Flooding, Scarcity Engineering, and Auto-Equilibrium).
- **Ad-Network Subversion:** Replaced the generic "Marketing Level" with a thematic "Subversion" mechanic that requires Ops and Data.

### Changed
- Replaced confusing "Demand %" with a transparent "Market Capacity (TB/s)".
- `Algorithmic Trading` project now unlocks the `Auto-Equilibrium` market strategy instead of a flat demand buff.

## [v2.3.1] - 2026-05-30
### Fixed & Improved
- **UI Polish:** Increased dashboard glassmorphism, added dynamic panel hover states, and introduced subtle text glows for better readability.
- **Layout Tweaks:** Improved spacing to reduce clutter and ensure standard visual alignment.

## [v2.3.0] - 2026-05-30
### Added
- **Threat Level System:** Implemented a new 5-tier Threat Level system.
- **Exponential Elasticity:** Replaced linear demand calculation with an exponential decay curve.

## [v2.2.0] - 2026-05-30
### Added
- Restored `agent-update_info.txt` to align with protocol.
- First complete stable SPA version.



