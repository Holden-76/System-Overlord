# System Overlord v2.1.5.1 — "Endless Ascension & Competitive Ranking"
**Release Date:** 2026-05-30

This update patches the wipe function and introduces mathematically endless exponential scaling for prestige and epoch upgrades, making the competitive leaderboard truly uncapped.

---

## 🔁 New: Epoch Ascension (Second Prestige Layer)

The game now has a true second prestige loop above the Reboot system.

### How It Works
- After completing **3 Reboots**, the **Epoch Ascension** section unlocks inside the Reboot Protocol overlay.
- Costs **25 Kernel Fragments** to ascend.
- On Ascension: Kernel Fragments, Reboot count, and Prestige Upgrades all **reset**.
- You earn **+1 Epoch Token** per ascension.
- **Persists forever**: Epoch Count, Epoch Tokens, Epoch Upgrades, lifetime stats, achievements.

### Epoch Upgrades (purchased with Epoch Tokens)
| Upgrade | Effect |
|---|---|
| Data Nexus | Data generation x1.75 per level |
| Credit Surge | Credit income x1.75 per level |
| Ghost Matrix | Detection heat generation x0.85 per level |
| Fragment Resonator | Kernel Fragment yield x1.4 per level |
| Neural Overdrive | Ops generation x1.3 per level |
| Void Protocol | All extraction and processing x1.5 per level |

### Admin Panel (for testing)
Two new debug buttons: **+5 Epoch Tokens** and **Set Reboots=3** (to trigger epoch eligibility instantly).

---

## 🏅 New: Operator Rating Score System

A live **score** (your "Operator Rating") is now displayed at all times in the top navigation bar.

### Formula
```
score = floor(
  (lifetime.totalData / 1000)
  × (1 + prestigeCount × 2)
  × (1 + trust × 0.5)
  × (1 + epochCount × 10)
  × (1 + lifetime.totalNodes × 0.05)
)
```

This rewards depth (multiple prestiges, high trust, epoch progress) over raw grinding, making the score a true reflection of long-term strategic play.

---

## 🏆 New: Leaderboard Overlay

Click the **🏆 Ranks** button in the top navigation bar to open the Operator Rankings overlay.

### Local Leaderboard (works immediately, no setup)
- Tracks up to 20 of your best runs in `localStorage`.
- Automatically records your score whenever you complete a Reboot or Epoch Ascension.
- Columns: Rank, Nickname, Score, Epoch/Reboot/Trust, Run Type.

### Global Leaderboard (requires Firebase setup)
The online leaderboard is fully implemented. To enable it:

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (free)
3. Enable **Realtime Database** (Start in test mode)
4. Copy your database URL (looks like: `https://your-project-default-rtdb.firebaseio.com`)
5. Open `system_overlord_v2_1_5_0.html` in a text editor
6. Search for `const FIREBASE_URL = ''` near the bottom of the file
7. Paste your URL: `const FIREBASE_URL = 'https://your-project-default-rtdb.firebaseio.com/leaderboard'`
8. Save and reload

> **Note:** In Firebase test mode, all reads/writes are public. This is fine for a hobby game. For production use, you would add Firebase Authentication rules.

---

## ♾️ Endless Trust Scaling

The trust milestone system previously had a hard ceiling at 100M TB. It is now **infinitely scaling**:
- Fixed milestones for the first 16 trust levels (up to 100M TB)
- Beyond that, each subsequent trust level requires **3× the previous** — scaling forever
- Story log messages now also extend beyond the original set

---

## 🔧 Epoch Multipliers Integrated Into All Systems

Every major formula in the game now respects your epoch upgrades:

| System | Epoch Upgrade |
|---|---|
| Data Extraction (extractors, botnet) | Data Nexus |
| Credit Income | Credit Surge |
| Detection Heat (node heat) | Ghost Matrix |
| Kernel Fragment Gain | Fragment Resonator |
| Ops Generation | Neural Overdrive |
| Prestige Upgrade Caps | Void Protocol |
| Market Demand formula | Credit Surge |
| Offline Progress | All above multipliers applied |

---

## 🐛 Bug Fixes

- **Wipe Function**: Fixed a race condition where wiping would trigger an auto-save loop upon reload, overwriting the wiped state.
- **Save key updated** to `systemOverlordSave_v2_1_5_1`. Old `v2.1.5.0` and `v2.1.4.0` saves are automatically migrated.
- **Firebase Leaderboard**: Fixed a Firebase configuration error preventing reads without index rules.
- **Endless Scaling**: All prestige and epoch upgrades now use `Math.pow()` for true exponential scaling without max caps.

---

## 📁 Files

- `system_overlord_v2_1_5_1.html` — Main game file
- `release_notes.md` — This file
