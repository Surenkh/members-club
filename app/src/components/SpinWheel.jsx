import { useRef, useState } from "react";

const SLICES = [
  { label: "50 XP", type: "xp", value: 50, color: "#3525cd" },
  { label: "Try Again", type: "none", color: "#1a2338" },
  { label: "100 XP", type: "xp", value: 100, color: "#5b54e8" },
  { label: "No Luck", type: "none", color: "#131a2e" },
  { label: "150 XP", type: "xp", value: 150, color: "#3525cd" },
  { label: "Cash", type: "cash", value: 10, color: "#8a5cf6" },
  { label: "75 XP", type: "xp", value: 75, color: "#5b54e8" },
  { label: "200 XP", type: "xp", value: 200, color: "#6f67ff" },
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
    // Land so the target slice is at the pointer (top)
    const targetAngle = 360 * 5 + (360 - target * seg - seg / 2);
    setRot((r) => r - (r % 360) + targetAngle);
    setTimeout(() => {
      setSpinning(false);
      setResult(SLICES[target]);
      onResult?.(SLICES[target]);
    }, 4200);
  };

  const cx = 150, cy = 150, r = 148;
  const polar = (a, rad) => [cx + rad * Math.cos((a - 90) * (Math.PI / 180)), cy + rad * Math.sin((a - 90) * (Math.PI / 180))];

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* pointer */}
        <div className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2">
          <div className="h-0 w-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-gold drop-shadow" />
        </div>
        <div className="rounded-full border-[10px] border-[#1a2338] shadow-[var(--shadow-pop)]" style={{ width: 320, height: 320 }}>
          <svg
            ref={wheelRef}
            width="300"
            height="300"
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
                    stroke="#0b1120"
                    strokeWidth="2"
                  />
                  <text
                    x={tx}
                    y={ty}
                    fill={s.type === "none" ? "#9aa4c7" : "#fff"}
                    fontSize="12"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${a0 + seg / 2} ${tx} ${ty})`}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r="30" fill="#0b1120" stroke="#263150" strokeWidth="2" />
            <circle cx={cx} cy={cy} r="8" fill="#e8c37e" />
          </svg>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="mt-5 rounded-xl bg-indigo px-8 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition active:scale-[0.98] disabled:opacity-60"
      >
        {spinning ? "Spinning..." : "Spin the Wheel"}
      </button>

      {result && (
        <div className="mt-3 rounded-xl border border-hairline bg-card-2 px-5 py-3 text-center">
          <p className="text-sm font-bold text-fg">
            {result.type === "xp" && <>+{result.value} XP added to your balance</>}
            {result.type === "cash" && <>${result.value} credit won</>}
            {result.type === "none" && <>{result.label === "Try Again" ? "Free re-spin earned" : "No win this time"}</>}
          </p>
        </div>
      )}
    </div>
  );
}
