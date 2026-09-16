import { useEffect, useState } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

export function useNow(step = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), step);
    return () => clearInterval(t);
  }, [step]);
  return now;
}

// Full countdown boxes (details page): 03 Days 14 Hours 22 Mins 26 Secs
export default function Countdown({ to, className = "" }) {
  const now = useNow();
  const diff = Math.max(0, new Date(to).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const cell = (v, l) => (
    <div className="flex flex-col items-center">
      <span className="rounded-lg border border-hairline bg-card-2 px-2.5 py-1.5 font-display text-base font-bold tabular text-fg">
        {pad(v)}
      </span>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-faint">{l}</span>
    </div>
  );
  return (
    <div className={`flex items-start gap-1.5 ${className}`}>
      {cell(d, "Days")}
      <span className="pt-2 text-faint">:</span>
      {cell(h, "Hours")}
      <span className="pt-2 text-faint">:</span>
      {cell(m, "Mins")}
      <span className="pt-2 text-faint">:</span>
      {cell(s, "Secs")}
    </div>
  );
}

// Compact inline chip (competition cards): 03D : 14H : 22M : 48S
export function CountdownChip({ to }) {
  const now = useNow();
  const diff = Math.max(0, new Date(to).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-ink/60 px-2.5 py-1.5 text-[11px] font-bold tabular text-fg backdrop-blur">
      <span className="ms text-[14px] text-teal-pale">schedule</span>
      {pad(d)}D : {pad(h)}H : {pad(m)}M : {pad(s)}S
    </span>
  );
}

// Next Sunday 21:00 UTC draw target (Stitch pattern: "Sunday, May 25, 2025 · 21:00 UTC").
// NOTE: Stitch hardcodes a fixed date; the prototype targets the next occurrence so the
// countdown stays live. Date label keeps Stitch's exact format.
export function nextSunday2100UTC(from = new Date()) {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), 21, 0, 0));
  let add = (7 - d.getUTCDay()) % 7;
  if (add === 0 && d.getTime() <= from.getTime()) add = 7;
  d.setUTCDate(d.getUTCDate() + add);
  return d;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatDrawDate(date) {
  const d = new Date(date);
  return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
