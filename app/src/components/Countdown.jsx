import { useEffect, useState } from "react";

export default function Countdown({ to, className = "" }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(to).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const cell = (v, l) => (
    <div className="flex flex-col items-center">
      <span className="rounded-lg border border-hairline bg-card-2 px-2.5 py-1.5 text-base font-bold tabular text-fg">
        {String(v).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-faint">{l}</span>
    </div>
  );
  return (
    <div className={`flex items-start gap-1.5 ${className}`}>
      {cell(d, "days")}
      <span className="pt-2 text-faint">:</span>
      {cell(h, "hrs")}
      <span className="pt-2 text-faint">:</span>
      {cell(m, "min")}
      <span className="pt-2 text-faint">:</span>
      {cell(s, "sec")}
    </div>
  );
}
