import { nextSunday2100UTC } from "../components/Countdown";

// Shared demo draw target. Stitch hardcodes a fixed draw date ("Sunday, May 25, 2025,
// 21:00 UTC"); the prototype targets the next Sunday 21:00 UTC so countdowns stay live
// while keeping Stitch's exact label format. Known deviation, flagged in audit.
export function drawTarget(from) {
  return nextSunday2100UTC(from);
}
