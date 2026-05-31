# System Overlord - Master Update Protocol

This document defines the strict, non-negotiable workflow for developing, testing, packaging, and releasing any update to the System Overlord project. 

As an AI agent, you **MUST** reference and execute every applicable step in this protocol during an update session to ensure data integrity, premium aesthetics, and version control hygiene.

---

## Phase 1: Preparation & Scoping
1. **Knowledge Review:** Before making any changes, review existing Knowledge Items (KIs) to understand the current architecture and established patterns.
2. **Determine Version Bump:** Use strict Semantic Versioning (`MAJOR.MINOR.PATCH`).
   - `MAJOR`: Complete codebase overhaul or total UI/UX redesign.
   - `MINOR`: New features, mechanics, or significant UI polish.
   - `PATCH`: Balance tweaks, text changes, or bug hotfixes.
3. **Workspace Setup:**
   - Create a dedicated release directory (e.g., `main/releases/v2.7.0/`).
   - Copy the previous version's HTML file into this new directory and rename it (e.g., `system_overlord_v2_7_0.html`).

---

## Phase 2: Implementation & The Aesthetics Mandate
1. **Core Development:** Implement the requested features or fixes within the new version's HTML file.
2. **The Aesthetics Mandate:** System Overlord must maintain a state-of-the-art, premium "Hacker Dashboard" aesthetic. When adding new UI elements, you must ensure:
   - Proper use of the dual-font system (`Inter` for UI, `Share Tech Mono` for data/logs).
   - Elements utilize established CSS variables for colors, glowing shadows, and gradients.
   - Interactive elements have smooth hover states (`transform: translateY`, `box-shadow` changes).
   - Glassmorphism properties (`backdrop-filter`, `background: linear-gradient`) match existing `.panel` classes.
3. **Internal String Updates:** Update all hardcoded version identifiers inside the new HTML file:
   - `<title>` and `<meta name="description">`.
   - Boot screen sequence logs (`> LOADING KERNEL vX.Y.Z`).
   - Dashboard header label (`<span class="ver">vX.Y.Z</span>`).
   - Firebase Leaderboard submission payload (`version: 'vX.Y.Z'`).

---

## Phase 3: Save Data Integrity (CRITICAL)
1. **Save Key Bump:** Update the `localStorage` key used in the `saveGame()` function to reflect the new version (e.g., `systemOverlordSave_v2_7_0`).
2. **Migration Chain:** Update the `loadGame()` function to first check for the new save key. If not found, it **MUST** elegantly fall back and attempt to load from the immediate previous version's key, chaining backwards. *A player must never lose their save due to an update.*
3. **Wipe Logic:** Ensure the `resetGame()` hard-reset function array includes the new version's key so that local storage can be fully cleared if requested.

---

## Phase 4: Documentation
1. **Release Notes:** Create a `release_notes.md` file inside the new version directory. Summarize the changes concisely and accurately.
2. **CHANGELOG.md:** Append the contents of the release notes to the root `CHANGELOG.md` file under a new version heading.
3. **README.md:** Update the root `README.md` file. Change all references pointing to the "latest release" to the new folder and file name.
4. **Root index.html:** Update `main/index.html` to reflect the new version number, subtitle, and ensure the "INITIALIZE KERNEL" link points to the newly created HTML file.

---

## Phase 5: Verification & Quality Assurance
1. **Syntax Check:** Ensure there are no unclosed HTML tags, broken CSS, or syntax errors in the JS logic.
2. **Logic Validation:** If core algorithms (like `getDemand()` or `calcOps()`) were changed, theoretically trace their edge cases (e.g., Threat Level 5, high prestige) to prevent math crashes (`NaN` or `Infinity`).
3. **Visual Review Check:** Confirm that no legacy version strings exist in the UI and that CSS animations do not cause rendering lag.

---

## Phase 6: Release Packaging
1. **Local CHANGELOG Snapshot:** Copy `release_notes.md` to `CHANGELOG.md` inside the new version directory.
2. **Zip Archive:** Compress the entire new version directory into a `.zip` file and place it in the `main/zip-releases/` directory named `System_Overlord_v<version>.zip` (e.g., using `Compress-Archive` in PowerShell).
3. **SHA-256 Checksum:** Generate a SHA-256 hash of the `.zip` file (e.g., using `Get-FileHash` in PowerShell) and place the `.sha256` output in the `main/zip-releases/` directory to ensure file integrity for end-users.

---

## Phase 7: Finalization
1. **Git Commit:** Stage all modified files, newly created files, and the `.zip` archive. Create a descriptive Git commit summarizing the update (e.g., `feat: v2.7.0 market rework and ui polish`).
2. **Knowledge Sync:** If this update drastically changes the core architecture or introduces entirely new subsystems, update relevant Knowledge Items (KIs) so future sessions have accurate context.
3. **Handoff:** Present the update, the walkthrough artifact, and the SHA-256 checksum to the user.
