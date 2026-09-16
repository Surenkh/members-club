import { useRef, useState } from "react";

// 12 slices in Stitch document order with Stitch segment fills.
// Labels: "$10 WIN" pairs with a "★ CASH" second line; hub reads "⚡ TOP XP ⚡".
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

  const cx = 150, cy = 150, r = 146;
  const polar = (a, rad) => [cx + rad * Math.cos((a - 90) * (Math.PI / 180)), cy + rad * Math.sin((a - 90) * (Math.PI / 180))];

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2">
          <div className="h-0 w-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-gold drop-shadow" />
        </div>
        <div className="rounded-full border-[10px] border-[#1c2436] shadow-[var(--shadow-pop)]" style={{ width: 300, height: 300 }}>
          <svg
            ref={wheelRef}
            width="280"
            height="280"
            viewBox="0 0 300 300"
            className="block"
            style={{
              transform: `rotate(${rot}deg)`,
              transition: spinning ? "transform 4.2s cubic-bezier(0.12, 0.8, 0.08, 1)" : "none",
            }}
          >
            {SLICES.map((s, i) => {
              const a0 = i * seg, a1 = a0 + seg;
              const [x0, y0] = polar(a0, r), [x1, y1] = polar(a1, r);
              const [tx, ty] = polar(a0 + seg / 2, r * 0.62);
              return (
                <g key={i}>
                  <path
                    d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`}
                    fill={s.color}
                    stroke="#090d16"
                    strokeWidth="2"
                  />
                  {s.label.map((line, li) => (
                    <text
                      key={li}
                      x={tx}
                      y={ty + (li - (s.label.length - 1) / 2) * 13}
                      fill="#0b1120"
                      fontSize="11"
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
            <circle cx={cx} cy={cy} r="34" fill="#090d16" stroke="#1e293b" strokeWidth="2" />
            <text x={cx} y={cy - 4} fill="#fbbf24" fontSize="10" fontWeight="800" textAnchor="middle">⚡ TOP XP ⚡</text>
            <circle cx={cx} cy={cy + 12} r="6" fill="#fbbf24" />
          </svg>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-teal-pale">
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
        <div className="mt-3 w-full rounded-xl border border-hairline bg-card-2 px-5 py-3 text-center">
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
