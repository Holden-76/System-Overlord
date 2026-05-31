# System Overlord v2.7.0 Release Notes: The Deep Web Update

## Features
*   **Offline Progress (Sleep Mode):** The system now tracks the `lastSaveTime` and calculates passive income (Data, Credits, Ops) for up to 4 hours of offline time. A "SYSTEM AWAKENED" report overlays the screen upon returning.
*   **Active Hacking Minigame:** Manually extracting data now has a 2% chance to trigger a "Firewall Intrusion" event. Players have 3 seconds to input a sequence of WASD keys to receive a massive reward burst.
*   **Procedural UI Sound Effects:** Expanded the Web Audio API `AudioEngine` to generate high-quality synthesized sound effects for hovering, clicking, failing, and succeeding without relying on external assets.

## Bug Fixes & Adjustments
*   Fixed legacy initialization issues with the `saveGame()` and `loadGame()` fallback chains.
*   Adjusted the boot sequence to reflect the new kernel version `v2.7.0`.
