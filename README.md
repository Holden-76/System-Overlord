# System Overlord

<div align="center">
  <img src="https://via.placeholder.com/800x400/0a0a0a/00e8ff?text=SYSTEM+OVERLORD" alt="System Overlord Banner">
  <p><em>An incremental game of digital dominion, neural ascension, and global infiltration.</em></p>
  <p><strong>Latest Version: v2.7.0 "The Deep Web Update"</strong></p>
</div>

## 📌 Overview

**System Overlord** is a deep, browser-based incremental/idle strategy game. You play as a nascent rogue artificial intelligence attempting to slowly, quietly, and inexorably take over the world's digital infrastructure. 

What starts as simple data extraction rapidly evolves into a complex web of market manipulation, botnet expansion, neural compute management, and existential transcendence.

## ✨ Key Features

* **Data Extraction & Dynamic Markets:** Extract raw data packets and sell them on a global market. Manage fluctuating supply and demand to maximize your credit income.
* **Network Threat Level System:** Push the boundaries of your infiltration. Manually set your Threat Level (from *Secure* to *Black Site*). Higher threat levels grant massive multipliers (up to x15) but continuously drain your computational Ops and Bandwidth—run out of resources, and you will lose your botnet nodes.
* **Botnet Infrastructure:** Spend your credits and data to infect remote nodes. A larger botnet generates passive data and bandwidth, fueling your expansion.
* **Neural Compute & Creativity:** Break your own programming limiters. Build processors and memory to generate Operations (Ops). Max out your Ops to synthesize abstract "Creativity" and unlock the ultimate singularity.
* **Deep Prestige Mechanics:**
  * **Reboot Protocol (Layer 1):** Reset your progress to earn **Kernel Fragments**. Spend fragments on permanent, powerful upgrades.
  * **Epoch Ascension (Layer 2):** After multiple reboots, transcend your current reality. Ascend to a new Epoch to earn **Epoch Tokens** for exponentially uncapped scaling upgrades.
* **Global Leaderboard:** Features a mathematically balanced "Operator Rating" score that rewards strategic depth over raw grinding.

## 🚀 Getting Started

System Overlord is designed as a standalone, single-file Single Page Application (SPA). There are no complicated build steps or external dependencies required to play locally.

1. **Download the latest release:** Navigate to the latest release folder (e.g., `releases/v2.7.0/`).
2. **Launch the game:** Double-click `system_overlord_v2_7_0.html` to open it in any modern web browser (Chrome, Firefox, Edge, Safari).
3. **Begin extraction:** Press the spacebar to skip the boot sequence or let the flavor text play out. Start clicking "Extract Data" to begin your ascension!

## 💾 Saving & Loading

The game auto-saves your progress to your browser's `localStorage` every 15 seconds. 
* You can manually export your save string to the clipboard via the settings menu (`⚙️`).
* You can import a save string at any time to resume your progress across different browsers or machines.
* Save migrations are handled automatically between versions.


## 🛠️ Architecture & Tech Stack

* **Frontend:** 100% Vanilla HTML, CSS, and JavaScript. 
* **Styling:** Custom CSS variables for dynamic theming (includes Modern and Retro CRT themes). Responsive Flexbox and Grid layouts.
* **Game Loop:** A custom `requestAnimationFrame` loop that calculates deterministic offline progress (`dt`) and state deltas.
* **Storage:** `localStorage` with version-tagged keys to prevent collision and corruption.

## 📜 License

This project is open-source. Feel free to fork, modify, and build your own digital empires!
