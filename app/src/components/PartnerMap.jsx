import { useState } from "react";

// Interactive mock map: stylized dark street grid with selectable partner pins.
// No geolocation, no commercial tiles. Zoom + selection persist per session.
export default function PartnerMap({ items, onView }) {
  const [zoom, setZoom] = useState(() => {
    try {
      return Number(sessionStorage.getItem("map:zoom") || 1);
    } catch {
      return 1;
    }
  });
  const [sel, setSel] = useState(null);

  const setZ = (z) => {
    const v = Math.min(2.2, Math.max(1, Math.round((z + Number.EPSILON) * 10) / 10));
    setZoom(v);
    try {
      sessionStorage.setItem("map:zoom", String(v));
    } catch {}
  };

  const pins = [];
  items.forEach((p) => (p.spots || []).forEach((s, i) => pins.push({ p, s, key: `${p.id}-${i}` })));
  const active = sel && pins.find((x) => x.key === sel);

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="relative h-72 w-full overflow-hidden bg-[#0d1424]">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "center" }} className="absolute inset-0 transition-transform duration-300">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M0 34 H100 M0 62 H100 M18 0 V100 M46 0 V100 M74 0 V100" stroke="#1c2436" strokeWidth="1.6" />
            <path d="M0 48 H100" stroke="#263150" strokeWidth="2.4" />
            <ellipse cx="24" cy="74" rx="17" ry="10" fill="#10241f" />
            <path d="M62 78 Q74 70 88 78 Q96 84 88 90 Q74 96 62 90 Q56 84 62 78" fill="#0f2a33" />
          </svg>
          {pins.map(({ p, s, key }) => (
            <button
              key={key}
              onClick={() => setSel(key)}
              aria-label={`${p.shortName} at ${s.label}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-[var(--shadow-pop)] transition active:scale-95 ${sel === key ? "border-gold bg-gold/20" : "border-indigo-bright bg-card"}`}>
                <span className={`ms text-[18px] ${sel === key ? "fill text-gold" : "text-indigo-bright"}`}>location_on</span>
              </span>
            </button>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
          <button onClick={() => setZ(zoom + 0.3)} aria-label="Zoom in" className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-card/90 text-fg">+</button>
          <button onClick={() => setZ(zoom - 0.3)} aria-label="Zoom out" className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-card/90 text-fg">−</button>
        </div>
      </div>

      {pins.length === 0 && (
        <div className="p-5 text-center">
          <p className="text-sm font-bold text-fg">No locations match these filters</p>
          <p className="mt-1 text-[12px] text-muted">Online-only offers remain in the list view.</p>
        </div>
      )}

      {active && (
        <div className="border-t border-hairline-soft p-3.5">
          <div className="flex items-center gap-3">
            <img src={active.p.image} alt={active.p.name} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-fg">{active.p.shortName}</p>
              <p className="truncate text-[11px] font-semibold text-indigo-bright">{active.p.benefit}</p>
              <p className="text-[11px] text-muted">{active.s.label}</p>
            </div>
          </div>
          <button onClick={() => onView(active.p)} className="mt-3 w-full rounded-xl bg-cta py-2.5 text-[13px] font-bold text-white active:scale-[0.98]">
            View offer
          </button>
        </div>
      )}
    </div>
  );
}
