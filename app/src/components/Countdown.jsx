import { useNow } from "../lib/time";

function pad(n) {
  return String(n).padStart(2, "0");
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
    <span className="liquid-glass inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold tabular text-fg">
      <span className="ms text-[14px] text-teal-pale">schedule</span>
      {pad(d)}D : {pad(h)}H : {pad(m)}M : {pad(s)}S
    </span>
  );
}
