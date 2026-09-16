import { useRef, useState } from "react";

// 12 slices in Stitch document order with Stitch segment fills.
// Labels: "$10 WIN" pairs with a "★ CASH" second line; hub reads "TOP XP".
const SLICES = [
  { label: ["50 XP"], type: "xp", value: 50, color: "#fef08a" },
  { label: ["No Luck"], type: "none", color: "#cbd5e1" },
  { label: ["$10 WIN", "★ CASH"], type: "cash", value: 10, color: "#6ee7b7" },
  { label: ["100 XP"], type: "xp", value: 100, color: "#c7d2fe" },
  { label: ["Try Again"], type: "retry", color: "#f5d0fe" },
  { label: ["$10 WIN", "★ CASH"], type: "cash", value: 10, color: "#6ee7b7" },
  { label: ["150 XP"], type: "xp", value: 150, color: "#93c5fd" },
  { label: ["No Win"], type: "none", color: "#cbd5e1" },
  { label: ["200 XP"], type: "xp", value: 200, color: "#fef08a" },
  { label: ["Try Again"], type: "retry", color: "#f5d0fe" },
  { label: ["$10 WIN", "★ CASH"], type: "cash", value: 10, color: "#6ee7b7" },
  { label: ["75 XP"], type: "xp", value: 75, color: "#e9d5ff" },
];

const SIZE = 320;
const RIM = 14;

export default function SpinWheel({ onResult }) {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);
  const n = SLICES.length;
  const seg = 360 / n;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const target = Math.floor(Math.random() * n);
    const targetAngle = 360 * 5 + (360 - target * seg - seg / 2);
    setRot((r) => r - (r % 360) + targetAngle);
    setTimeout(() => {
      setSpinning(false);
      setResult(SLICES[target]);
      onResult?.(SLICES[target]);
    }, 4200);
  };

  const cx = 160, cy = 160, r = 158 - RIM;
  const polar = (a, rad) => [cx + rad * Math.cos((a - 90) * (Math.PI / 180)), cy + rad * Math.sin((a - 90) * (Math.PI / 180))];
  const ticks = Array.from({ length: 48 });

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* pointer */}
        <div className="absolute left-1/2 top-[-8px] z-10 -translate-x-1/2">
          <div className="h-0 w-0 border-l-[11px] border-r-[11px] border-t-[18px] border-l-transparent border-r-transparent border-t-gold drop-shadow-[0_2px_6px_rgba(251,191,36,0.5)]" />
        </div>
        {/* gold double rim + tick ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, #8a6a1f, #fbbf24, #8a6a1f, #fbbf24, #8a6a1f)",
            boxShadow: spinning
              ? "0 0 44px 6px rgba(251,191,36,0.45), 0 20px 48px -8px rgba(3,6,18,0.65)"
              : "0 20px 48px -8px rgba(3,6,18,0.65)",
            transition: "box-shadow 0.5s ease",
          }}
        />
        <div className="absolute rounded-full bg-[#0b1120]" style={{ inset: RIM - 4 }} />
        <svg
          className="absolute"
          style={{ inset: RIM }}
          width={SIZE - RIM * 2}
          height={SIZE - RIM * 2}
          viewBox="0 0 320 320"
        >
          {ticks.map((_, i) => {
            const a = (i * 360) / ticks.length;
            const [x0, y0] = [160 + 150 * Math.cos(((a - 90) * Math.PI) / 180), 160 + 150 * Math.sin(((a - 90) * Math.PI) / 180)];
            const [x1, y1] = [160 + 144 * Math.cos(((a - 90) * Math.PI) / 180), 160 + 144 * Math.sin(((a - 90) * Math.PI) / 180)];
            return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={i % 4 === 0 ? "#fbbf24" : "#3a4666"} strokeWidth={i % 4 === 0 ? 2.5 : 1.5} />;
          })}
        </svg>
        <div className="absolute overflow-hidden rounded-full" style={{ inset: RIM + 8, width: SIZE - (RIM + 8) * 2, height: SIZE - (RIM + 8) * 2 }}>
          <svg
            ref={wheelRef}
            width="100%"
            height="100%"
            viewBox="0 0 300 300"
            className="block"
            style={{
              transform: `rotate(${rot}deg)`,
              transition: spinning ? "transform 4.2s cubic-bezier(0.12, 0.8, 0.08, 1)" : "none",
            }}
          >
            {SLICES.map((s, i) => {
              const a0 = i * seg, a1 = a0 + seg;
              const [x0, y0] = [150 + 148 * Math.cos(((a0 - 90) * Math.PI) / 180), 150 + 148 * Math.sin(((a0 - 90) * Math.PI) / 180)];
              const [x1, y1] = [150 + 148 * Math.cos(((a1 - 90) * Math.PI) / 180), 150 + 148 * Math.sin(((a1 - 90) * Math.PI) / 180)];
              const [tx, ty] = [150 + 92 * Math.cos(((a0 + seg / 2 - 90) * Math.PI) / 180), 150 + 92 * Math.sin(((a0 + seg / 2 - 90) * Math.PI) / 180)];
              return (
                <g key={i}>
                  <path
                    d={`M 150 150 L ${x0} ${y0} A 148 148 0 0 1 ${x1} ${y1} Z`}
                    fill={s.color}
                    stroke="#090d16"
                    strokeWidth="2"
                  />
                  {s.label.map((line, li) => (
                    <text
                      key={li}
                      x={tx}
                      y={ty + (li - (s.label.length - 1) / 2) * 14}
                      fill="#0b1120"
                      fontSize="12"
                      fontWeight="800"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${a0 + seg / 2} ${tx} ${ty})`}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
          {/* hub */}
          <div className="absolute left-1/2 top-1/2 flex h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-gold/70 bg-[#090d16] shadow-[0_0_24px_rgba(251,191,36,0.35)]">
            <span className="ms fill text-[20px] text-gold">bolt</span>
            <span className="mt-0.5 px-1 text-center text-[8px] font-bold leading-tight tracking-widest text-gold-pale">TOP XP</span>
          </div>
        </div>
      </div>

      <p className="mt-5 flex items-center gap-1.5 text-[12px] font-semibold text-teal-pale">
        <span className="ms fill text-[15px]">stars</span>
        1 Free Daily Spin Ready! (12 Prizes)
      </p>
      <button
        onClick={spin}
        disabled={spinning}
        className="mt-3 w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition hover:bg-indigo-bright active:scale-[0.98] disabled:opacity-60"
      >
        {spinning ? "Spinning the apex vault..." : "Spin Wheel"}
      </button>

      {result && (
        <div className="mt-3 flex w-full items-center gap-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
          <span className="ms fill text-[24px] text-gold">
            {result.type === "xp" ? "military_tech" : result.type === "cash" ? "payments" : result.type === "retry" ? "refresh" : "info"}
          </span>
          <p className="text-sm font-bold text-fg">
            {result.type === "xp" && <>+{result.value} XP added to your balance</>}
            {result.type === "cash" && <>${result.value} WIN · CASH added to your balance</>}
            {result.type === "retry" && <>Free re-spin earned</>}
            {result.type === "none" && <>No win this time</>}
          </p>
        </div>
      )}
    </div>
  );
}
