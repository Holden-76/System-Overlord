# System Overlord v2.3.0 Release Notes

## 📊 The "Elasticity" Update

This update fundamentally changes how the core market loop operates by introducing a deep, exponential demand model. Price scaling is no longer a simple division equation—it is a balancing act of elastic economics, Threat Level synergies, and global trust.

### 📈 Reworked Demand Model
The `getDemand()` algorithm has been entirely rewritten from the ground up to support non-linear scaling and deep interconnectivity with other mechanics:

1. **Exponential Price Sensitivity:**
   - Instead of a simple `1/price` curve, demand now decays exponentially (`Math.exp`) as you increase the price. This means there is a mathematically "perfect" sweet spot for pricing depending on your current progression, rather than a flat ideal ratio.
2. **Trust Level Scaling:**
   - The global base demand pool now directly scales with your `Trust Level`. As you assimilate global infrastructure and gain trust, your baseline consumer pool expands significantly.
3. **The Black Market Synergy (Threat Level):**
   - High Threat Levels now directly influence your market demand! The higher your Threat Level, the more "illicit" your data becomes. This applies a massive **Black Market Multiplier** to your demand (up to 3.0x).
   - **The Catch:** As your data becomes hotter on the Black Market, buyers become significantly more *price-sensitive*. You will need to carefully balance your prices at higher threat levels to avoid scaring away demand.

### 🛠️ Technical Fixes
- Added comprehensive save migration logic for `v2.3.0` bridging seamlessly from the `v2.2.0` architecture.
- Re-synced the Firebase Leaderboard payloads to track and log `v2.3.0` submissions.
