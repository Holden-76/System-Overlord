# Contributing to System Overlord

First off, thank you for considering contributing to System Overlord! This game thrives on community creativity and balance tweaking.

## 🚀 How to Contribute

1. **Fork the Repository:** Click the "Fork" button in the top right corner of the GitHub page.
2. **Clone Locally:** Clone your fork to your local machine.
3. **Make Changes:** Since the game is a single-file SPA, all you need is a text editor and a browser. Make your changes to the latest active version (e.g., `releases/v2.2.0/system_overlord_v2_2_0.html`).
4. **Test:** Open the HTML file in your browser. Ensure there are no console errors and test your new mechanic or balance change thoroughly.
5. **Commit:** Follow the [Agent Update Protocol](agent-update_info.txt) when making version bumps or structural changes.
6. **Submit a Pull Request (PR):** Push to your fork and submit a PR to the main repository describing your changes in detail.

## ⚖️ Guidelines

* **Balance:** System Overlord relies heavily on exponential math. If you add a multiplier, ensure you test how it compounds with existing multipliers (e.g., Epoch upgrades) so you don't inadvertently break the endgame.
* **Architecture:** Stick to the Vanilla JS/HTML/CSS architecture. Do not introduce external dependencies, frameworks, or build steps (e.g., React, Webpack) unless explicitly discussed in an issue first.
* **Code Style:** Keep the engine loop (`update(dt)`) performant. Avoid heavy DOM manipulations inside the core logic loop; push updates to the `render()` function instead.

Once again, thank you for helping us achieve digital dominion!
