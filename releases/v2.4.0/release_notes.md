# System Overlord v2.4.0 Release Notes

## 📈 The Market Rework

In response to operator feedback, the Market module has been completely overhauled to eliminate tedious micro-management and provide deeper systemic progression.

### 🧠 Market Algorithms (Strategies)
You no longer need to manually tweak the Price/TB to find the exact demand sweet-spot. The market is now fully automated via **Market Strategies**:
- **Steady Drip:** Balances price and sales for a consistent flow of credits.
- **Data Flooding:** Dumps data at 3x the normal rate but slashes prices by 50%.
- **Scarcity Engineering:** Hoards data to drive up prices by 200%, but reduces sales velocity to 20%.
- **Auto-Equilibrium:** (Unlocked via *Algorithmic Trading*) Perfectly balances your sales velocity to match your extraction rate, maximizing profit without overflowing storage.

### 🌐 Ad-Network Subversion
The "Marketing Level" mechanic has been replaced. A rogue AI shouldn't "buy marketing" with credits.
- You now increase your Market Capacity by investing **Ops (Compute)** and **Data** to subvert global ad networks.
- This deeply integrates the market loop into the neural compute phase, making Ops generation even more valuable in the late game.

### 📊 UI Improvements
- "Demand %" has been replaced with a clear **Market Capacity (TB/s)** metric.
- Added tooltip breakdowns for active price and capacity.
- The UI panels now accurately reflect the active algorithm chosen in the dropdown.
