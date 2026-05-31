# System Overlord v3.3.1 Release Notes

## Bug Fixes & Economy Rebalancing
*   **Market Sales Uncapped:** The algorithm restricting the market `sellRate` strictly to your automated generation rate (`extRate + botRate + gpuRate`) has been removed. The market now drains your `state.data` backlog and manually generated data up to the absolute market bandwidth `cap`.
*   **Ascension Epoch Progression Fixed:** A critical operator precedence error (`||0+1`) in the prestige system has been fixed. Players who ascend via the `confirmAscend` process will no longer be permanently reset to Epoch 1. Subsequent ascensions will now correctly accumulate Epochs and Epoch Tokens.
