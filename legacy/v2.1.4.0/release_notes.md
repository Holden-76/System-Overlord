# System Overlord v2.1.4.0 "The UI Clarity Overhaul"
**Release Date:** May 30, 2026

## Overview
Update v2.1.4.0 brings a sweeping structural and visual overhaul to the System Overlord user interface. Recognizing that the game's mechanics were becoming dense and complex—especially going into the late game with Botnets and Neural Compute—this update re-organizes data to drastically reduce visual clutter.

By combining scattered stats into a Unified Dashboard, implementing an Accordion-style layout for Operations systems, and fixing long-standing visual pain points regarding Event Cards, the Overlord OS now looks like a truly premium, state-of-the-art hacking interface.

## Major Changes & New Features

### 1. Unified Header Dashboard
Previously, critical system statistics were scattered across individual bulky cards floating loosely in the top right.
- **Top Navigation Bar**: System-critical controls—such as Archive, Export, Import, Wipe, and settings toggles (Format, Theme, Sound)—have been pulled entirely out of the Operations Column and reorganized into a sleek, minimal navigation bar at the very top of the screen.
- **Dashboard Bar**: Below the Navigation Bar, there is now a dedicated, unified Dashboard Bar containing your essential readouts: **Trust**, **Total Data**, **Income**, and **Data Rate**. This horizontal bar gives you instant, at-a-glance awareness without muddying up your workspace.

### 2. Interactive Module Accordions
As players unlocked powerful mid-to-late game systems (Network Market, Automation, Global Botnet, and Neural Compute), the Operations and Systems columns grew endlessly vertically, creating massive amounts of scroll fatigue.
- **Collapsible Headers**: Every major system block now features an interactive, clickable header (denoted with an arrow indicator `▼`).
- **Targeted Focus**: By clicking the header, the entire module collapses into a single streamlined row, hiding its contents. This allows you to tuck away systems you aren't actively using (like Automation or Network Market) so you can hyper-focus on active upgrades (like Neural Compute and Overclocking).
- **Reduced Scroll Fatigue**: The UI is now dramatically cleaner and far more space-efficient.

### 3. Dedicated Event Slot 
- **Fixed the Project Jump Bug**: The random Event Cards (e.g., the Whistleblower Event, Network Traces, etc.) used to inject themselves directly into the Projects tab. This meant that whenever an event occurred or expired, the list of projects would abruptly shift up or down, causing misclicks.
- **Permanent Top-Slot**: Event cards now have a dedicated anchor spot sitting directly at the top of the middle column (`#col-projects`), entirely outside of the tabbed container. Events now appear prominently exactly where you need to see them, while never disrupting your workflow within the tabs below.

### 4. Layout Polish and Code Quality
- CSS grid layouts have been re-calibrated.
- Smoothed out hover effects for navigation and dashboard elements.
- Dropped the unnecessary flex-wrap breaks that caused visual misalignment in extreme resolutions.
- Version strings correctly bumped everywhere within the internal DOM and game loop logic.

## Known Issues Addressed
- **Fixed:** Incorrect version string remaining in HTML head from v2.1.3.11.
- **Fixed:** System Overlord "Operations" column feeling overly bloated with non-operational system controls (Archive/Save buttons are now properly up in the top right).

*End of release notes. Good luck out there, Overlord.*

- **Fixed:** Severe UI contrast issues during System Lockdown mode have been resolved. Text is no longer washed out by inner red glows, and the background flashes dynamically.
- **Fixed:** Raised the brightness of disabled buttons and standard text descriptions across the board to significantly improve readability.

- **Fixed:** Severe save-state issue where the 'Wipe' function would fail because the browser's \eforeunload\ event would immediately re-save the game before reloading.
- **Fixed:** Critical issue where imported saves would be overwritten instantly or save to an older, inaccessible version key.
- **Fixed:** 'Reboot Protocol' prestige mechanic was permanently wiping your earned achievement stat bonuses (e.g., max combo, click power). Achievements now properly re-apply their permanent bonuses on reboot.
- **Fixed:** Offline progress was ignoring multiple late-game income multipliers, significantly reducing offline earnings.
