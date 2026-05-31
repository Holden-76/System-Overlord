# System Overlord v2.4.1 Release Notes

## 🛠️ Hotfix: Early-Game Balance & UI Polish

This minor patch addresses a critical early-game softlock introduced in the v2.4.0 Market Rework, alongside some visual polish for the new interface.

### Balance Changes
- **Ad-Network Subversion Cost:** The cost to subvert ad networks has been changed from **Ops + Data** to **Credits + Data**. 
  - *Developer Note:* In v2.4.0, requiring Ops accidentally prevented players from upgrading their market capacity during the early game, because the Neural Compute module (which generates Ops) isn't unlocked until later. Returning to a Credit/Data cost restores smooth early-game progression while maintaining a thematic resource sink.

### UI Improvements
- **Market Algorithm Dropdown:** Replaced the generic browser select box with a custom dark-theme dropdown that fits the game's premium aesthetic. Added subtle hover states and glows.
- **Subversion Button:** Upgraded the "Subvert Network" button to use the new `.btn-subvert` class, featuring dynamic gradients and responsive hover animations.
