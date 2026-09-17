import { nextSunday2100UTC } from "./time";

// Per-draw targets keep the countdowns distinct like the Stitch prototype.
// These are mock offsets, not production draw dates.
const OFFSETS = {
  "porsche-911": 0,
  "rolex-leica": 2,
  stmoritz: 6,
  "monaco-gp": 4,
  "ap-royaloak": 1,
};

export function drawTarget(id = "porsche-911", from) {
  const target = nextSunday2100UTC(from);
  target.setUTCDate(target.getUTCDate() + (OFFSETS[id] || 0));
  return target;
}
